from http import HTTPStatus

from flask_restful import Resource, reqparse
from flask import Response, make_response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from schemas import UnknownWordSchema
from db_init import db


parser = reqparse.RequestParser()
parser.add_argument("written_form", type=str, location="form")
parser.add_argument("possible_translation", type=str, location="form")


class UnknownWordView(Resource):
    get_unknown_word_schema = UnknownWordSchema()

    @jwt_required()
    def post(self, document_id: int) -> Response:
        requester_id = get_jwt_identity()

        data = parser.parse_args()
        data["document_id"] = document_id
        data["reporter_id"] = requester_id

        unknown_word = self.get_unknown_word_schema.load(data)
        db.session.add(unknown_word)
        db.session.commit()

        return make_response(jsonify(self.get_unknown_word_schema.dump(unknown_word)), HTTPStatus.OK)
