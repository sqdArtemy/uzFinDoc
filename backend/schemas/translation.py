from marshmallow import fields, validates, ValidationError, EXCLUDE

from models import User, Organization, Document, Translation
from app_init import ma
from utilities.enums import Messages


class TranslationGetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Translation
        fields = (
            "id", "language", "generated_at", "details_status", "details_word_count", "creator",
            "input_document", "output_document", "organization"
        )
        load_instance = True
        include_relationships = True
        ordered = True

    organization = fields.Nested("schemas.organization.OrganizationGetSchema", data_key="organization")
    creator = fields.Nested("shemas.user.UserGetSchema", data_key="creator")
    input_document = fields.Nested("schemas.document.DocumentGetSchema", data_key="input_document")
    output_document = fields.Nested("schemas.document.DocumentGetSchema", data_key="output_document")


class TranslationCreateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Translation
        fields = (
            "language", "details_status", "details_word_count", "creator_id", "input_document_id", "output_document_id",
            "organization_id"
        )
        unknown = EXCLUDE
        ordered = True
        load_instance = True
        include_relationships = True

    language = fields.Str(required=True)
    details_status = fields.Str(required=True)
    details_word_count = fields.Int(required=True)
    creator_id = fields.Int(required=True)
    input_document_id = fields.Int(required=True)
    output_document_id = fields.Int(required=True)
    organization_id = fields.Int(required=True)

    @validates("creator_id")
    def validate_creator_id(self, value: int) -> None:
        if not User.query.filter_by(id=value).first():
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", value))

    @validates("organization_id")
    def validate_organization_id(self, value: int) -> None:
        if not Organization.query.filter_by(id=value).first():
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Organization", value))

    @validates("input_document_id")
    def validate_input_document_id(self, value: int) -> None:
        if not Document.query.filter_by(id=value).first():
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Document", value))

    @validates("output_document_id")
    def validate_document_id(self, value: int) -> None:
        if not Document.query.filter_by(id=value).first():
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Document", value))
