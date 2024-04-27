from flask_restful import Resource
from flask import Response, send_file
from flask_jwt_extended import jwt_required

from models import Document


class DocumentDownloadView(Resource):
    @jwt_required()
    def get(self, document_id: int) -> Response:
        document = Document.query.get_or_404(document_id)

        return send_file(
            document.link,
            download_name=f"{document.name}.{document.format}",
            as_attachment=True
        )
