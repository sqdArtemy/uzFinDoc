from http import HTTPStatus
from flask_restful import Resource, reqparse
from marshmallow import ValidationError
from flask import jsonify, make_response, request, Response, redirect
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jti
from werkzeug.security import check_password_hash

from db_init import db, redis_store, transaction
from models import User
from utilities.enums import Messages
from utilities.exceptions import PermissionDeniedError
from schemas import UserCreateSchema, UserGetSchema, UserUpdateSchema

parser = reqparse.RequestParser()
parser.add_argument("email", location="form")
parser.add_argument("name_first_name", location="form")
parser.add_argument("name_middle_name", location="form")
parser.add_argument("name_last_name", location="form")
parser.add_argument("phone", location="form")
parser.add_argument("organization_id", location="form")


class UserRegisterView(Resource):
    user_create_schema = UserCreateSchema()
    user_get_schema = UserGetSchema()

    def post(self) -> Response:
        parser.add_argument("password", location="form")
        data = parser.parse_args()

        try:
            with transaction():
                user = self.user_create_schema.load(data)

                f"""
                INSERT INTO "User" ("email", "name_first_name", "name_last_name", "name_middle_name", "phone", "password")
                VALUES ({user.email}, {user.name_first_name}, {user.name_last_name}, {user.name_middle_name}, {user.phone}, {user.password})
                """

                db.session.add(user)
                db.session.flush()

            request_data = {
                "user": self.user_get_schema.dump(user),
                "access_token": create_access_token(identity=user.id),
                "refresh_token": create_refresh_token(identity=user.id)
            }

            return make_response(jsonify(request_data), HTTPStatus.CREATED)
        except ValidationError as e:
            raise ValidationError(e.messages)


class UserLoginView(Resource):
    user_get_schema = UserGetSchema()

    def post(self) -> Response:
        login_parser = reqparse.RequestParser()
        login_parser.add_argument("email", location="form", required=True)
        login_parser.add_argument("password", location="form", required=True)
        data = login_parser.parse_args()

        f"""
        SELECT * 
        FROM "User"
        WHERE email = {data['email']}
        """

        user = User.query.filter_by(email=data['email']).first()

        if not user or not check_password_hash(user.password, data['password']):
            raise ValidationError(Messages.INVALID_CREDENTIALS.value)

        response_data = {
            "user": self.user_get_schema.dump(user),
            "access_token": create_access_token(identity=user.id),
            "refresh_token": create_refresh_token(identity=user.id)
        }

        return make_response(jsonify(response_data), HTTPStatus.OK)


class UserLogOutView(Resource):

    @jwt_required()
    def get(self) -> Response:
        jti = get_jti(request.headers.get("Authorization").split()[1])
        redis_store.set(jti, "true")
        return make_response({"message": "Logged out."}, HTTPStatus.OK)


class UserMeView(Resource):

    @jwt_required()
    def get(self) -> Response:
        return redirect(f"/user/{get_jwt_identity()}")


class UserDetailedViewSet(Resource):
    user_get_schema = UserGetSchema()
    user_update_schema = UserUpdateSchema()

    @jwt_required()
    def get(self, user_id: int) -> Response:

        f"""
        SELECT *
        FROM "User"
        WHERE id = {user_id};
        """

        user = User.query.get_or_404(user_id, description=Messages.OBJECT_NOT_FOUND.value.format("User", "id", user_id))

        return make_response(jsonify(self.user_get_schema.dump(user)), HTTPStatus.OK)

    @jwt_required()
    def put(self, user_id: int) -> Response:
        with transaction():
            if user_id != get_jwt_identity():
                raise PermissionDeniedError(Messages.FORBIDDEN.value)

            f"""
            SELECT * 
            FROM "User" 
            WHERE id = {user_id};
            """

            user = User.query.get_or_404(
                user_id, description=Messages.OBJECT_NOT_FOUND.value.format("User", "id", user_id)
            )

            data = parser.parse_args()
            data = {key: value for key, value in data.items() if value and getattr(user, key) != value}
            updated_user_data = self.user_update_schema.load(data)

            for key, value in updated_user_data.items():
                setattr(user, key, value)

            db.session.add(user)

        return make_response(jsonify(self.user_update_schema.dump(user)), HTTPStatus.OK)

    @jwt_required()
    def delete(self, user_id: int) -> Response:
        if user_id != get_jwt_identity():
            raise PermissionDeniedError(Messages.FORBIDDEN.value)

        f"""
        DELETE FROM "User" 
        WHERE id = {user_id};
        """

        user = User.query.get_or_404(user_id, description=Messages.OBJECT_NOT_FOUND.value.format("User", "id", user_id))
        db.session.delete(user)
        db.session.commit()

        return make_response({"message": Messages.OBJECT_DELETED.value.format("User")}, HTTPStatus.NO_CONTENT)


class JWTRefresh(Resource):
    @jwt_required(refresh=True)
    def get(self):
        response_data = {
            "access_token": create_access_token(identity=get_jwt_identity())
        }

        return make_response(jsonify(response_data), HTTPStatus.OK)
