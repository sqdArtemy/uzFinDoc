from http import HTTPStatus
from flask_restful import Resource, reqparse
from marshmallow import ValidationError
from flask import jsonify, make_response, Response
from flask_jwt_extended import jwt_required, get_jwt_identity

from db_init import db, transaction
from models import User, Organization
from schemas import OrganizationUpdateSchema, OrganizationCreateSchema, OrganizationGetSchema, UserGetSchema
from utilities.enums import Messages
from utilities.exceptions import PermissionDeniedError


parser = reqparse.RequestParser()
parser.add_argument("name", location="form")


class OrganizationListView(Resource):
    organization_create_schema = OrganizationCreateSchema()
    organization_get_schema = OrganizationGetSchema()

    @jwt_required()
    def post(self) -> Response:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()

        if user.organization:
            raise ValidationError(f"User with id {user_id} already have organization.")

        data = parser.parse_args()
        data["owner_id"] = user_id

        with transaction():
            organization = OrganizationCreateSchema().load(data)
            db.session.add(organization)
            db.session.flush()

            user.organization_id = organization.id
            db.session.add(user)

        return make_response(self.organization_get_schema.dump(organization), HTTPStatus.CREATED)


class OrganizationDetailedView(Resource):
    organization_get_schema = OrganizationGetSchema()
    organization_update_schema = OrganizationUpdateSchema()

    @jwt_required()
    def get(self, organization_id: int) -> Response:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        organization = user.organization

        if organization and organization.id != organization_id:
            raise PermissionDeniedError("User does not have access to that organization")

        return make_response(jsonify(self.organization_get_schema.dump(organization)), HTTPStatus.OK)

    @jwt_required()
    def delete(self, organization_id: int) -> Response:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        organization = Organization.query.filter_by(id=organization_id).first()

        if organization and organization.owner_id != user_id or user.organization_id != organization_id:
            raise ValidationError("You are not an owner of this organization.")

        db.session.delete(organization)
        db.session.commit()

        return make_response(jsonify({"message": "Organization deleted."}), HTTPStatus.NO_CONTENT)

    @jwt_required()
    def put(self, organization_id: int) -> Response:
        requester_id = get_jwt_identity()
        organization = Organization.query.filter_by(id=organization_id).first()

        if organization and organization.owner_id != requester_id:
            raise PermissionDeniedError("User is not an owner of this organization.")

        data = parser.parse_args()
        for key, value in data.items():
            setattr(organization, key, value)

        db.session.add(organization)
        db.session.commit()

        return make_response(jsonify(self.organization_get_schema.dump(organization)), HTTPStatus.OK)


class OrganizationMembershipView(Resource):
    user_get_schema = UserGetSchema(many=True, exclude=["organization"])

    @jwt_required()
    def post(self, organization_id: int, user_email: str) -> Response:
        requester_id = get_jwt_identity()
        organization = Organization.query.filter_by(id=organization_id).first()
        user = User.query.filter_by(email=user_email).first()

        if not organization:
            raise ValidationError("User does not have organization.")

        if organization and organization.owner_id != requester_id:
            raise PermissionDeniedError("User is not an owner of this organization.")

        if not user:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("email", user_email))

        if user.organization_id:
            raise ValidationError("User if already a member of organization.")

        user.organization_id = organization_id
        db.session.commit()

        return make_response(jsonify(self.user_get_schema.dump(organization.users)), HTTPStatus.OK)

    @jwt_required()
    def delete(self, organization_id: int, user_email: str) -> Response:
        requester_id = get_jwt_identity()
        requester = User.query.filter_by(id=requester_id).first()
        organization = Organization.query.filter_by(id=organization_id).first()
        user = User.query.filter_by(email=user_email).first()

        if not organization:
            raise ValidationError("User does not have organization.")

        if organization and organization.owner_id != requester_id:
            raise PermissionDeniedError("User is not an owner of this organization.")

        if not user:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("id", requester_id))

        if user_email == requester.email:
            raise ValidationError("You cannot leave this organization, you can delete it instead.")

        if user.organization_id != organization_id:
            raise ValidationError("User is not a member of this organization.")

        user.organization_id = None
        db.session.commit()

        return make_response(jsonify(self.user_get_schema.dump(organization.users)), HTTPStatus.OK)


class OrganizationMembershipListView(Resource):
    user_get_schema = UserGetSchema(many=True, exclude=["organization"])

    @jwt_required()
    def get(self, organization_id: int) -> Response:
        requester_id = get_jwt_identity()
        organization = User.query.filter_by(id=requester_id).first().organization

        if not organization:
            raise ValidationError("User does not have organization.")

        if organization and organization_id != organization_id:
            raise PermissionDeniedError("User is not an owner of this organization.")

        return make_response(jsonify(self.user_get_schema.dump(organization.users)), HTTPStatus.OK)
