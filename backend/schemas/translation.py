from marshmallow import fields, validates, ValidationError, EXCLUDE, post_dump, pre_load

from models import User, Organization, Document, Translation
from app_init import ma
from utilities.enums import Messages
from utilities.exceptions import PermissionDeniedError
from db_init import db


class TranslationGetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Translation
        fields = (
            "id", "generated_at", "details_status", "details_word_count", "creator", "input_document",
            "output_document", "organization", "feedback", "process_time", "requester_id", "feedbacks"
        )
        ordered = True
        load_instance = True
        include_relationships = True
        dump_only = [
            "generated_at", "details_status", "details_word_count", "creator", "input_document",
            "output_document", "organization", "feedback", "process_time"
        ]
        load_only = ["requester_id"]
        sqla_session = db.session

    organization = fields.Nested("schemas.organization.OrganizationGetSchema", data_key="organization")
    creator = fields.Nested("schemas.user.UserGetSchema", exclude=["organization"], data_key="creator")
    input_document = fields.Nested("schemas.document.DocumentGetSchema", data_key="input_document")
    output_document = fields.Nested("schemas.document.DocumentGetSchema", data_key="output_document")
    feedback = fields.Nested("schemas.feedback.FeedbackGetSchema", exclude=["translation"], data_key="feedback")

    @pre_load
    def validate_translation(self, data, **kwargs):
        requester_id = data.get('requester_id', None)
        translation_id = data.get('id', None)

        if not (requester_id and User.query.filter_by(id=requester_id)):
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", "id", requester_id))

        translation = Translation.query.filter_by(id=translation_id).first()

        if not translation:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Translation", "id", translation_id))

        if translation.creator_id != requester_id:
            raise PermissionDeniedError(Messages.OBJECT_NOT_FOUND.value.format("Translation", "creator_id", requester_id))

        return data

    @post_dump
    def enum_formatter(self, data, **kwargs):
        data["details_status"] = data["details_status"].value if data["details_status"] else None
        return data


class TranslationCreateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Translation
        fields = (
            "details_status", "details_word_count", "creator_id", "input_document_id", "output_document_id",
            "organization_id", "process_time"
        )
        unknown = EXCLUDE
        ordered = True
        load_instance = True
        include_relationships = True

    details_status = fields.Str(required=True)
    details_word_count = fields.Int(required=True)
    creator_id = fields.Int(required=True)
    process_time = fields.Int(required=True)
    input_document_id = fields.Int(required=True)
    output_document_id = fields.Int(required=True)
    organization_id = fields.Int(required=True)

    @validates("process_time")
    def validate_creator_id(self, value: int) -> None:
        if value < 0:
            raise ValidationError(Messages.VALUE_POSITIVE.value)

    @validates("creator_id")
    def validate_creator_id(self, value: int) -> None:
        if not User.query.filter_by(id=value).first():
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", "id", value))

    @validates("organization_id")
    def validate_organization_id(self, value: int) -> None:
        if not Organization.query.filter_by(id=value).first():
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Organization", "id", value))

    @validates("input_document_id")
    def validate_input_document_id(self, value: int) -> None:
        if not Document.query.filter_by(id=value).first():
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Document", "id", value))

    @validates("output_document_id")
    def validate_document_id(self, value: int) -> None:
        if not Document.query.filter_by(id=value).first():
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Document", "id", value))
