from operator import or_

from flask_restful import Resource
from flask import Response, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from models import Document, Translation, User
from db_init import db
from utilities.enums import Messages


class DocumentDownloadView(Resource):
    @jwt_required()
    def get(self, document_id: int) -> Response:
        requester_id = get_jwt_identity()
        requester = User.query.filter_by(id=requester_id).first()
        document = Document.query.get_or_404(document_id)

        """
        SELECT id
        FROM "Document"
        JOIN "Translation" on ("Translation".output_document_id = "Document".id OR "Translation".input_document_id = "Document".id)
        WHERE "Translation".creator_id = 20 OR "Translation".organization_id = 6;
        """
        document_ids = db.session.query(Document.id) \
            .join(Translation, or_(Translation.input_document_id == Document.id, Translation.output_document_id == Document.id)) \
            .join(User, or_(User.id == Translation.creator_id, User.organization_id == Translation.organization_id)) \
            .filter(
                or_(
                    User.id == requester_id,
                    User.organization_id == requester.organization_id
                )
                ).distinct().all()

        if document.id not in [result[0] for result in document_ids]:
            raise ValidationError(Messages.USER_CANNOT_SEE_THIS_DOCUMENT.value)

        return send_file(
            document.link,
            download_name=f"{document.name}.{document.format}",
            as_attachment=True
        )
