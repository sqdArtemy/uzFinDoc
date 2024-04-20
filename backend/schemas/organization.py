from marshmallow import fields, post_load, validates, ValidationError, EXCLUDE

from models import Organization
from utilities.validators import is_name_valid
from app_init import ma
from db_init import db


class OrganizationGetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Organization
        fields = ('id', 'name', 'created_at', "owner")
        ordered = True
        include_relationships = True
        load_instance = True
        sqla_session = db.session

    owner = fields.Nested("schemas.UserGetSchema", exclude=["organization"], data_key="owner")
