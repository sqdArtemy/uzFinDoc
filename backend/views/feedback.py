from http import HTTPStatus
from flask_restful import Resource, reqparse
from marshmallow import ValidationError
from flask import jsonify, make_response, request, Response, redirect
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jti
from werkzeug.security import check_password_hash

from db_init import db, redis_store, transaction
from models import User, Translation
from utilities.enums import Messages
from utilities.exceptions import PermissionDeniedError
from schemas import FeedbackCreateSchema, FeedbackGetSchema


parser = reqparse.RequestParser()
parser.add_argument("rating", type=int, location="form")
parser.add_argument("review", type=str, location="form")


class FeedbackViewSet(Resource):
    get_feedback_schema = FeedbackGetSchema()
    create_feedback_schema = FeedbackCreateSchema()

    @jwt_required()
    def post(self, translation_id: int) -> Response:
        requester_id = get_jwt_identity()

        data = parser.parse_args()
        data["translation_id"] = translation_id
        data["creator_id"] = requester_id

        feedback = self.create_feedback_schema.load(data)

        db.session.add(feedback)
        db.session.commit()

        return make_response(jsonify(self.get_feedback_schema.dump(feedback)), HTTPStatus.OK)

    @jwt_required()
    def get(self, translation_id: int) -> Response:
        pass