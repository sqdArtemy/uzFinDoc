from http import HTTPStatus
from flask_restful import Resource, reqparse
from marshmallow import ValidationError
from flask import jsonify, make_response, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload

from db_init import db, transaction
from models import User, Organization
from schemas import OrganizationUpdateSchema, OrganizationCreateSchema, OrganizationGetSchema, UserGetSchema
from utilities.enums import Messages
from utilities.exceptions import PermissionDeniedError
from views.mixins.filter import FilterMixin
from views.mixins.sort import SortMixin
from views.parsers.sort_filter import sort_filter_parser

parser = reqparse.RequestParser()
parser.add_argument("name", location="form")
parser.add_argument("email", location="form")


class OrganizationListView(Resource):
    organization_create_schema = OrganizationCreateSchema()
    organization_get_schema = OrganizationGetSchema()

    @jwt_required()
    def post(self) -> Response:
        user_id = get_jwt_identity()

        f"""
        SELECT * 
        FROM "User"
        WHERE id = {user_id};
        """

        user = User.query.filter_by(id=user_id).first()

        if user.organization:
            raise ValidationError(Messages.USER_ALREADY_HAVE_ORG.value.format("id", user_id))

        data = parser.parse_args()
        data["owner_id"] = user_id

        with transaction():
            organization = OrganizationCreateSchema().load(data)
            db.session.add(organization)
            db.session.flush()

            f"""
            UPDATE "User"
            SET organization_id = {organization.id}
            WHERE id = {data["owner_id"]};
            """

            user.organization_id = organization.id
            db.session.add(user)

        return make_response(self.organization_get_schema.dump(organization), HTTPStatus.CREATED)


class OrganizationDetailedView(Resource):
    organization_get_schema = OrganizationGetSchema()
    organization_update_schema = OrganizationUpdateSchema()

    @jwt_required()
    def get(self, organization_id: int) -> Response:
        request_data = {
            "id": organization_id,
            "requester_id": get_jwt_identity()
        }

        f"""
        SELECT * 
        FROM "Organization"
        WHERE id = {organization_id};
        """

        organization = self.organization_get_schema.load(request_data)

        return make_response(jsonify(self.organization_get_schema.dump(organization)), HTTPStatus.OK)

    @jwt_required()
    def delete(self, organization_id: int) -> Response:
        request_data = {
            "id": organization_id,
            "requester_id": get_jwt_identity()
        }
        organization = self.organization_get_schema.load(request_data)

        f"""
        DELETE FROM "Organization"
        WHERE id = {organization_id};
        """

        db.session.delete(organization)
        db.session.commit()

        return make_response(
            jsonify({"message": Messages.OBJECT_DELETED.value.format("Organization")}), HTTPStatus.NO_CONTENT
        )

    @jwt_required()
    def put(self, organization_id: int) -> Response:
        request_data = {
            "id": organization_id,
            "requester_id": get_jwt_identity()
        }
        organization = self.organization_get_schema.load(request_data)

        data = parser.parse_args()
        data = {key: value for key, value in data.items() if value and getattr(organization, key) != value}
        data = self.organization_update_schema.load(data)

        for key, value in data.items():
            setattr(organization, key, value)

        f"""
        INSERT INTO "Organization" ("name", "email", "owner_id")
        VALUES ({organization.name}, {organization.email}, {organization.owner_id});
        """

        db.session.add(organization)
        db.session.commit()

        return make_response(jsonify(self.organization_get_schema.dump(organization)), HTTPStatus.OK)


class OrganizationMembershipView(Resource):
    user_get_schema = UserGetSchema(many=True, exclude=["organization"])
    organization_get_schema = OrganizationGetSchema()

    @jwt_required()
    def post(self, organization_id: int, user_email: str) -> Response:
        request_data = {
            "id": organization_id,
            "requester_id": get_jwt_identity()
        }
        organization = self.organization_get_schema.load(request_data)

        f"""
        SELECT *
        FROM "User"
        WHERE email = {user_email};
        """

        user = User.query.filter_by(email=user_email).first()

        if not user:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", "email", user_email))

        if user.organization_id:
            raise ValidationError(Messages.USER_ALREADY_HAVE_ORG.value.format("email", user_email))

        f"""
        UPDATE "User"
        SET organization_id = 6
        WHERE email = {user_email};
        """

        user.organization_id = organization_id
        db.session.commit()

        return make_response(jsonify(self.user_get_schema.dump(organization.users)), HTTPStatus.OK)

    @jwt_required()
    def delete(self, organization_id: int, user_email: str) -> Response:
        requester_id = get_jwt_identity()
        organization = Organization.query.get_or_404(
            organization_id, description=Messages.OBJECT_NOT_FOUND.value.format("Organization", "id", organization_id)
        )

        f"""
        SELECT *
        FROM "User"
        WHERE id = {requester_id};
        """

        requester = User.query.filter_by(id=requester_id).first()

        if organization.owner_id != requester_id and requester.email != user_email:
            raise PermissionDeniedError(Messages.USER_NOT_OWNER.value)

        f"""
        SELECT *
        FROM "User"
        WHERE email = {user_email};
        """

        user = User.query.filter_by(email=user_email).first()
        if not user:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", "email", user_email))

        if user_email == requester.email and organization.owner_id == requester_id:
            raise ValidationError(Messages.OWNER_CANNOT_LEAVE_ORG.value)

        if user.organization_id != organization_id:
            raise ValidationError(Messages.USER_NOT_A_MEMBER.value)

        f"""
        UPDATE "User"
        SET organization_id = NULL
        WHERE email = {requester.email} OR organization_id = {requester.id};
        """

        user.organization_id = None
        db.session.commit()

        return make_response(jsonify(self.user_get_schema.dump(organization.users)), HTTPStatus.OK)


class OrganizationMembershipListView(Resource, SortMixin, FilterMixin):
    user_get_schema = UserGetSchema(many=True, exclude=["organization"])

    @jwt_required()
    def get(self, organization_id: int) -> Response:
        requester_id = get_jwt_identity()

        f"""
        SELECT "Organization".*
        FROM "User"
        JOIN "Organization" ON "User".organization_id = "Organization".id
        WHERE "User".id = {requester_id};
        """

        organization = User.query.filter_by(id=requester_id).first().organization
        data = sort_filter_parser.parse_args()
        sort_by = data.get("sort_by")
        filters = data.get("filters")

        if not organization:
            raise ValidationError(Messages.USER_HAS_NO_ORG.value)

        if organization.id != organization_id:
            raise PermissionDeniedError(Messages.USER_NOT_A_MEMBER.value)

        f"""
        SELECT "User".*
        FROM "User"
        JOIN "Organization" ON "User".organization_id = "Organization".id
        WHERE "Organization".id = {organization.id};
        """

        users = User.query.filter_by(organization_id=organization.id).options(joinedload(User.organization))
        if filters:
            users = self.get_filtered_query(
                query=users,
                model=User,
                filters=filters
            )
        if sort_by:
            users = self.get_sorted_query(
                query=users,
                model=User,
                sort_fields=sort_by
            )

        return make_response(jsonify(self.user_get_schema.dump(users)), HTTPStatus.OK)
