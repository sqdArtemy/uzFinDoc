from marshmallow import EXCLUDE, fields, validates_schema, ValidationError

from models import UnknownWord, User, Document
from app_init import ma
from utilities.enums import Messages
from utilities.exceptions import PermissionDeniedError
from db_init import db


class UnknownWordSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UnknownWord
        fields = ("written_form", "reporter_id", "document_id", "possible_translation")
        load_instance = True
        unknown = EXCLUDE
        sqla_session = db.session

    written_form = fields.Str(required=True)
    reporter_id = fields.Int(required=True)
    document_id = fields.Int(required=True)
    possible_translation = fields.Str(required=True)

    @validates_schema
    def validate_unknown_word(self, data, **kwargs) -> None:
        reporter_id = data.get("reporter_id", None)
        document_id = data.get("document_id", None)

        if not (reporter_id or User.query.filter_by(id=reporter_id).first()):
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", "id", reporter_id))

        document = Document.query.filter_by(id=document_id).first()

        if not document:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Document", "id", document_id))

        document_translations = document.translation_in

        if len(document_translations) == 0:
            raise ValidationError(Messages.DOCUMENT_HAS_NO_TRANSLATIONS.value)

        if document_translations[0].creator_id != reporter_id:
            raise PermissionDeniedError(Messages.USER_NOT_UPLOADED_THIS_DOCUMENT.value)

