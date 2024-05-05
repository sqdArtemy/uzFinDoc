from marshmallow import EXCLUDE, fields, post_dump

from models import Document
from schemas.custom_fields import LanguageField, DocumentTypeField
from app_init import ma


class DocumentGetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Document
        fields = ("id", "name", "format", "text", "uploaded_at", "link", "type", "language")
        load_instance = True
        ordered = True

    @post_dump
    def enum_formatter(self, data, **kwargs):
        data["language"] = data["language"].value
        data["type"] = data["type"].value
        return data


class DocumentCreateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Document
        fields = ("name", "format", "text", "link", "uploaded_at", "type", "language")
        load_instance = True
        unknown = EXCLUDE

    name = fields.Str(required=True)
    format = fields.Str(required=True)
    text = fields.Str(required=True)
    link = fields.Str(required=True)
    uploaded_at = fields.DateTime(required=True)
    type = DocumentTypeField(required=True)
    language = LanguageField(required=True)
