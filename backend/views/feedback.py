from http import HTTPStatus
from flask_restful import Resource, reqparse
from flask import jsonify, make_response, Response
from flask_jwt_extended import jwt_required, get_jwt_identity

from db_init import db
from models import Translation
from schemas import FeedbackCreateSchema, FeedbackGetSchema


parser = reqparse.RequestParser()
parser.add_argument("rating", type=int, location="form")
parser.add_argument("review", type=str, location="form")


class FeedbackViewSet(Resource):
    get_feedback_schema = FeedbackGetSchema()
    get_feedbacks_schema = FeedbackGetSchema(many=True)
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
        requester_id = get_jwt_identity()

        data = {
            "translation_id": translation_id,
            "creator_id": requester_id
        }
        self.get_feedback_schema.load(data)
        translation = Translation.query.filter_by(id=translation_id).first()

        return make_response(jsonify(self.get_feedbacks_schema.dump(translation.feedback)), HTTPStatus.OK)