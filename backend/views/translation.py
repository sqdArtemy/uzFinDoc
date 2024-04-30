import os
import uuid
from http import HTTPStatus
from flask_restful import Resource, abort, reqparse
from flask import jsonify, make_response, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from datetime import datetime, timezone

from db_init import db, transaction
from models import User, Document, Translation
from models.enums import DocumentType, Language, TranslationStatus
from schemas import TranslationGetSchema, TranslationCreateSchema, DocumentCreateSchema
from utilities.functions import save_file, get_text_translation
from utilities.document_utilities import (
    get_text_from_docx, get_text_from_pdf, create_pdf_with_text, create_docx_with_text
)
from app_init import app


class TranslationCreateView(Resource):
    translation_create_schema = TranslationCreateSchema()
    translation_get_schema = TranslationGetSchema()
    document_create_schema = DocumentCreateSchema()

    parser = reqparse.RequestParser()
    parser.add_argument("language", type=str, required=True, location="form")
    parser.add_argument("input_document", type=FileStorage, location="files", required=True)
    parser.add_argument("output_format", type=str, required=True, location="form")

    @jwt_required()
    async def post(self) -> Response:
        requester_id = get_jwt_identity()
        data = self.parser.parse_args()
        user = User.query.filter_by(id=requester_id).first()

        input_document = data.get("input_document")
        output_format = data.get("output_format")
        document_format = input_document.content_type.split('/')[-1]
        document_name = secure_filename(input_document.filename).replace(f".{document_format}", '')

        if document_format == "vnd.openxmlformats-officedocument.wordprocessingml.document":
            document_format = "docx"

        if document_format not in ("docx", "pdf") or output_format not in ("docx", "pdf"):
            abort(
                HTTPStatus.BAD_REQUEST,
                error_messages={"message": "Our application currently supports only .pfd and .docx files!"}
            )

        save_path = os.path.join(app.config["UPLOAD_FOLDER"], f"{str(uuid.uuid4())}.{document_format}")
        await save_file(input_file=input_document, file_path=save_path)

        extractor = get_text_from_docx if document_format== "docx" else get_text_from_pdf
        document_text = await extractor(save_path)

        with transaction():
            in_document = Document(
                name=document_name,
                format=document_format,
                text=document_text,
                link=save_path,
                type=DocumentType.INPUT_FILE,
                language=Language.UZ
            )
            db.session.add(in_document)
            db.session.flush()

            translated_text = await get_text_translation(text=document_text)
            output_path = os.path.join(app.config["UPLOAD_FOLDER"], f"{str(uuid.uuid4())}.{output_format}")
            document_creator = create_pdf_with_text if output_format == "pdf" else create_docx_with_text
            await document_creator(text=translated_text, file_path=output_path)

            out_document = Document(
                name=f"{document_name}_translated",
                format=output_format,
                text=translated_text,
                link=output_path,
                type=DocumentType.OUTPUT_FILE,
                language=Language.ENG
            )

            db.session.add(out_document)
            db.session.flush()

            translation = Translation(
                language=Language.ENG,
                details_status=TranslationStatus.DONE,
                details_word_count=len(document_text.split(' ')),
                creator_id=user.id,
                input_document_id=in_document.id,
                generated_at=datetime.now(timezone.utc).isoformat(),
                output_document_id=out_document.id,
                organization_id=user.organization_id
            )

            db.session.add(translation)

        return make_response(jsonify(self.translation_get_schema.dump(translation)), HTTPStatus.OK)