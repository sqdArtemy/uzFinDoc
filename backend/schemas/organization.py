from marshmallow import fields, validates, ValidationError, EXCLUDE

from models import Organization
from utilities.validators import is_name_valid
from app_init import ma
from db_init import db


class OrganizationGetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Organization
        fields = ("id", "name", "created_at", "owner")
        ordered = True
        include_relationships = True
        load_instance = True
        sqla_session = db.session

    owner = fields.Nested("schemas.user.UserGetSchema", exclude=["organization"], data_key="owner")


class OrganizationCreateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Organization
        fields = ("name", "owner_id")
        ordered = True
        include_relationships = True
        load_instance = True
        sqla_session = db.session
        unknown = EXCLUDE

    @validates("name")
    def is_name_unique(self, value: str) -> None:
        if Organization.query.filter_by(name=value).first():
            raise ValidationError(f"Organization with name {value} already exists.")

    name = fields.Str(required=True, validate=is_name_valid)
    owner_id = fields.Int(required=True)


class OrganizationUpdateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Organization
        fields = ("name", )
        ordered = True
        include_relationships = True
        unknown = EXCLUDE

    @validates("name")
    def is_name_unique(self, value: str) -> None:
        if Organization.query.filter_by(name=value).first():
            raise ValidationError(f"Organization with name {value} already exists.")

    name = fields.Str(required=False, validate=is_name_valid)
