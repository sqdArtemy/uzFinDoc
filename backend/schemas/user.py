from marshmallow import fields, post_load, validates, ValidationError, EXCLUDE
from werkzeug.security import generate_password_hash

from models import User, Organization
from utilities.validators import is_name_valid, is_email_valid, is_password_valid, is_phone_valid
from app_init import ma
from db_init import db


class UserSchemaMixin:

    @validates('email')
    def validate_email(self, value: str) -> None:
        if User.query.filter_by(email=value).first():
            raise ValidationError(f"User with email '{value}' already exists.")

    @validates('phone')
    def validate_phone(self, value: str) -> None:
        if User.query.filter_by(phone=value).first():
            raise ValidationError(f"User with phone +'{value}' already exists.")

    @validates("organization_id")
    def validate_organization_id(self, value: int) -> None:
        if not Organization.query.filter_by(id=value).first():
            raise ValidationError(f"Organization with id '{value}' does not exist.")

    @post_load
    def hash_password(self, data: dict, **kwargs) -> dict:
        if data.get("password"):
            data["password"] = generate_password_hash(data.get("password"))

        return data


class UserCreateSchema(ma.SQLAlchemyAutoSchema, UserSchemaMixin):
    class Meta:
        model = User
        fields = (
            "email", "name_first_name", "name_last_name", "name_middle_name", "phone", "password"
        )
        unknown = EXCLUDE
        include_relationships = True
        load_instance = True

    name_first_name = fields.Str(required=True, validate=is_name_valid)
    name_middle_name = fields.Str(required=True, validate=is_name_valid)
    name_last_name = fields.Str(required=True, validate=is_name_valid)
    phone = fields.Str(required=True, validate=is_phone_valid)
    email = fields.Str(required=True, validate=is_email_valid)
    password = fields.Str(required=True, validate=is_password_valid)


class UserGetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = (
            "id", "email", "name_first_name", "name_last_name", "name_middle_name", "phone", "organization"
        )
        ordered = True
        include_relationships = True
        load_instance = True
        sqla_session = db.session

    organization = fields.Nested("schemas.organization.OrganizationGetSchema", exclude=["owner"], data_key="organization")


class UserUpdateSchema(ma.SQLAlchemyAutoSchema, UserSchemaMixin):
    class Meta:
        model = User
        fields = (
            "email", "name_first_name", "name_last_name", "name_middle_name", "phone", "password", "organization_id"
        )
        unknown = EXCLUDE
        include_relationships = True

    name_first_name = fields.Str(required=False, validate=is_name_valid)
    name_middle_name = fields.Str(required=False, validate=is_name_valid)
    name_last_name = fields.Str(required=False, validate=is_name_valid)
    phone = fields.Str(required=False, validate=is_phone_valid)
    email = fields.Str(required=False, validate=is_email_valid)
    password = fields.Str(required=False, validate=is_password_valid, load_only=True)
    organization_id = fields.Int(required=False)
