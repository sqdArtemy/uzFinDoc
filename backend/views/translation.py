import os
import uuid
import time
from http import HTTPStatus
from flask_restful import Resource, reqparse
from marshmallow import ValidationError
from flask import jsonify, make_response, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from datetime import datetime, timezone

from db_init import db, transaction
from models import User, Organization, Translation
from models.enums import DocumentType, Language, TranslationStatus
from schemas import TranslationGetSchema, TranslationCreateSchema, DocumentCreateSchema
from utilities.functions import save_file, get_text_translation
from utilities.document_utilities import (
    get_text_from_docx, get_text_from_pdf, create_pdf_with_text, create_docx_with_text
)
from utilities.exceptions import PermissionDeniedError
from utilities.enums import DocumentFormats, Messages
from app_init import app
from views.mixins.filter import FilterMixin
from views.mixins.sort import SortMixin
from views.parsers.sort_filter import sort_filter_parser


class TranslationCreateView(Resource, SortMixin, FilterMixin):
    translation_create_schema = TranslationCreateSchema()
    translation_get_schema = TranslationGetSchema()
    document_create_schema = DocumentCreateSchema()

    parser = reqparse.RequestParser()
    parser.add_argument("input_document", type=FileStorage, location="files", required=True)
    parser.add_argument("output_format", type=str, required=True, location="form")
    parser.add_argument("is_organizational", type=bool, required=True, location="form")

    @jwt_required()
    async def post(self) -> Response:
        requester_id = get_jwt_identity()
        data = self.parser.parse_args()

        """
        SELECT *
        FROM "User"
        WHERE id = 6;
        """

        user = User.query.filter_by(id=requester_id).first()
        available_formats = DocumentFormats.AVAILABLE_FORMATS.value
        is_organizational = data.get("is_organizational")

        input_document = data.get("input_document")
        output_format = data.get("output_format")
        document_format = input_document.content_type.split('/')[-1]
        document_name = secure_filename(input_document.filename).replace(f".{document_format}", '')

        if document_format == DocumentFormats.DOCX_CODE.value:
            document_format = DocumentFormats.DOCX.value

        if document_format not in available_formats or output_format not in available_formats:
            raise ValidationError(DocumentFormats.SUPPORTED_FORMATS.value)

        save_path = os.path.join(app.config["UPLOAD_FOLDER"], f"{str(uuid.uuid4())}.{document_format}")
        await save_file(input_file=input_document, file_path=save_path)

        extractor = get_text_from_docx if document_format == DocumentFormats.DOCX.value else get_text_from_pdf
        document_text = await extractor(save_path)

        with transaction():
            in_document = self.document_create_schema.load({
                "name": document_name,
                "format": document_format,
                "text": document_text,
                "uploaded_at": datetime.now(timezone.utc).isoformat(),
                "link": save_path,
                "type": DocumentType.INPUT_FILE,
                "language": Language.UZ
            })

            """
            INSERT INTO "Document" ("name", "format", "text", "uploded_at", "link", "type", "language")
            VALUES ("Name", "DOCX", "Text to be translated", CURRENT_TIME, "D:\DB_project", "INPUT_FILE", "UZ");
            """

            db.session.add(in_document)
            db.session.flush()

            start_time = time.time()

            translated_text = await get_text_translation(text=document_text)
            output_path = os.path.join(app.config["UPLOAD_FOLDER"], f"{str(uuid.uuid4())}.{output_format}")
            document_creator = create_pdf_with_text if output_format == "pdf" else create_docx_with_text
            await document_creator(text=translated_text, file_path=output_path)

            end_time = time.time()

            out_document = self.document_create_schema.load({
                "name": f"{document_name}_translated",
                "format": output_format,
                "text": translated_text,
                "uploaded_at": datetime.now(timezone.utc).isoformat(),
                "link": output_path,
                "type": DocumentType.OUTPUT_FILE,
                "language": Language.ENG
            })

            """
            INSERT INTO "Document" ("name", "format", "text", "uploded_at", "link", "type", "language")
            VALUES ("Name_translated", "DOCX", "Text to be translated", CURRENT_TIME, "D:\DB_project", "OUTPUT_FILE", "ENG");
            """

            db.session.add(out_document)
            db.session.flush()

            translation = self.translation_create_schema.load({
                "details_status": TranslationStatus.DONE,
                "details_word_count": len(document_text.split(' ')),
                "creator_id": user.id,
                "input_document_id": in_document.id,
                "process_time": end_time-start_time,
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "output_document_id": out_document.id,
                "organization_id": user.organization_id,
                "is_organizational": is_organizational
            })

            """
            INSERT INTO "Translation" ("details_status", "details_word_count", "creator_id", "input_document_id", "output_document_id", "organization_id", "is_organizational")
            VALUES ("Done", 4, 6, 7, 7, 4, TRUE);
            """

            db.session.add(translation)

        return make_response(jsonify(self.translation_get_schema.dump(translation)), HTTPStatus.OK)

    @jwt_required()
    def get(self) -> Response:
        requester_id = get_jwt_identity()
        data = sort_filter_parser.parse_args()
        sort_by = data.get("sort_by")
        filters = data.get("filters")

        """
        SELECT * 
        FROM "Translation"
        WHERE creator_id = 6;
        """

        translations = Translation.query.filter_by(creator_id=requester_id).options(joinedload(Translation.creator))
        if filters:
            translations = self.get_filtered_query(
                query=translations,
                model=Translation,
                filters=filters
            )
        if sort_by:
            translations = self.get_sorted_query(
                query=translations,
                model=Translation,
                sort_fields=sort_by
            )

        return make_response(
            jsonify(TranslationGetSchema(many=True, exclude=["creator", "feedbacks"]).dump(translations)),
            HTTPStatus.OK
        )


class DetailedTranslationView(Resource):
    get_translation_schema = TranslationGetSchema()

    @jwt_required()
    def get(self, translation_id: int) -> Response:
        requester_id = get_jwt_identity()
        data = {
            "requester_id": requester_id,
            "id": translation_id
        }

        """
        SELECT * 
        FROM "Translation"
        WHERE id = 6;
        """

        translation = self.get_translation_schema.load(data)

        return make_response(jsonify(self.get_translation_schema.dump(translation)), HTTPStatus.OK)

    @jwt_required()
    def delete(self, translation_id: int) -> Response:
        requester_id = get_jwt_identity()
        data = {
            "requester_id": requester_id,
            "id": translation_id
        }
        """
        DELETE FROM "Translation"
        WHERE id = 6 AND creator_id = 6;
        """
        translation = self.get_translation_schema.load(data)
        db.session.delete(translation)
        db.session.commit()

        return make_response(HTTPStatus.NO_CONTENT)


class OrganizationTranslationsView(Resource, SortMixin, FilterMixin):
    get_translations_schema = TranslationGetSchema(many=True, exclude=["organization", "feedbacks"])

    @jwt_required()
    def get(self, organization_id: int) -> Response:
        requester_id = get_jwt_identity()

        """
        SELECT * 
        FROM "User"
        WHERE id = 6;
        """

        requester = User.query.filter_by(id=requester_id).first()

        """
        SELECT * 
        FROM "Organization"
        WHERE id = 6;
        """

        organization = Organization.query.filter_by(id=organization_id).first()
        data = sort_filter_parser.parse_args()
        sort_by = data.get("sort_by")
        filters = data.get("filters")

        if not organization:
            raise ValidationError(
                Messages.OBJECT_NOT_FOUND.value.format("Organization", "organization_id", organization_id)
            )

        if requester.organization_id != organization_id:
            raise PermissionDeniedError(Messages.USER_HAS_NO_ACCESS_TO_ORG.value)


        """
        SELECT * 
        FROM "Translation"
        WHERE organization_id = 6;
        """

        translations = Translation.query.filter_by(
            organization_id=organization_id
        ).options(joinedload(Translation.organization))
        if filters:
            translations = self.get_filtered_query(
                query=translations,
                model=Translation,
                filters=filters
            )
        if sort_by:
            translations = self.get_sorted_query(
                query=translations,
                model=Translation,
                sort_fields=sort_by
            )

        return make_response(jsonify(self.get_translations_schema.dump(translations)), HTTPStatus.OK)
