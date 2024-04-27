from marshmallow import EXCLUDE, fields

from models import Document
from app_init import ma


class DocumentGetSchema(ma.ModelSchema):
    class Meta:
        model = Document
        fields = ("id", "name", "format", "text", "uploaded_at", "link", "type", "language")
        load_instance = True
        ordered = True


class DocumentCreateSchema(ma.ModelSchema):
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
    type = fields.Str(required=True)
    language = fields.Str(required=True)
