from http import HTTPStatus
from flask_restful import Resource, abort, reqparse
from flask import jsonify, make_response, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from db_init import db, transaction
from models import User
from schemas import OrganizationUpdateSchema, OrganizationCreateSchema, OrganizationGetSchema


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
            abort(
                HTTPStatus.BAD_REQUEST,
                error_message={"message": f"User with id {user_id} already have organization."}
            )

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
            abort(HTTPStatus.FORBIDDEN, error_message={"message": "User does not have access to that organization"})

        return make_response(jsonify(self.organization_get_schema.dump(organization)), HTTPStatus.OK)

    @jwt_required()
    def delete(self, organization_id: int) -> Response:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        organization = user.organization

        if organization and organization.owner_id != user_id or user.organization_id != organization_id:
            abort(HTTPStatus.FORBIDDEN, error_message={"You are not an owner of this organization."})

        db.session.delete(organization)
        db.session.commit()

        return make_response(jsonify({"message": "Organization deleted."}), HTTPStatus.NO_CONTENT)

    @jwt_required()
    def put(self, organization_id: int) -> Response:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        organization = user.organization

        if organization and organization.owner_id != user_id or user.organization_id != organization_id:
            abort(HTTPStatus.FORBIDDEN, error_message={"message": "User does not have access to that organization"})

        data = parser.parse_args()
        for key, value in data.items():
            setattr(organization, key, value)

        db.session.add(organization)
        db.session.commit()

        return make_response(jsonify(self.organization_get_schema.dump(organization)), HTTPStatus.OK)
