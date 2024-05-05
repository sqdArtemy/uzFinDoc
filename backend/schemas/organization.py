from marshmallow import fields, validates, ValidationError, EXCLUDE, validates_schema

from models import Organization
from utilities.validators import is_name_valid, is_email_valid
from utilities.enums import Messages
from utilities.exceptions import PermissionDeniedError
from app_init import ma
from db_init import db


class OrganizationGetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Organization
        fields = ("id", "name", "email", "created_at", "owner", "requester_id")
        dump_only = ("name", "email", "created_at", "owner")
        load_only = ("requester_id",)
        ordered = True
        include_relationships = True
        load_instance = True
        sqla_session = db.session

    owner = fields.Nested("schemas.user.UserGetSchema", exclude=["organization"], data_key="owner")

    @validates_schema
    def validate_schema_owner(self, data, **kwargs) -> None:
        requester_id = data.get("requester_id", None)
        organization_id = data.get("id", None)

        organization = Organization.query.get_or_404(
            organization_id, description=Messages.OBJECT_NOT_FOUND.value.format("Organization", "id", organization_id)
        )

        if organization.owner_id != requester_id:
            raise PermissionDeniedError(Messages.USER_NOT_OWNER.value)


class OrganizationCreateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Organization
        fields = ("name", "email", "owner_id")
        ordered = True
        include_relationships = True
        load_instance = True
        sqla_session = db.session
        unknown = EXCLUDE

    @validates("name")
    def is_name_unique(self, value: str) -> None:
        if Organization.query.filter_by(name=value).first():
            raise ValidationError(Messages.OBJECT_ALREADY_EXISTS.value.format("organization", "name", value))

    name = fields.Str(required=True, validate=is_name_valid)
    email = fields.Str(require=True, validate=is_email_valid)
    owner_id = fields.Int(required=True)


class OrganizationUpdateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Organization
        fields = ("name", "email")
        ordered = True
        include_relationships = True
        unknown = EXCLUDE

    name = fields.Str(required=False, validate=is_name_valid)
    email = fields.Str(required=False, validate=is_email_valid)

    @validates("name")
    def is_name_unique(self, value: str) -> None:
        if Organization.query.filter_by(name=value).first():
            raise ValidationError(Messages.OBJECT_ALREADY_EXISTS.value.format("organization", "name", value))

    @validates("email")
    def is_name_unique(self, value: str) -> None:
        if Organization.query.filter_by(email=value).first():
            raise ValidationError(Messages.OBJECT_ALREADY_EXISTS.value.format("organization", "email", value))
