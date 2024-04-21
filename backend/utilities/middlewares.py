"""
This file contains all middleware classes for this web application
"""
from http import HTTPStatus
from flask import request
from flask_restful import abort
from flask_jwt_extended import get_jti
from jwt import ExpiredSignatureError

from db_init import redis_store


def check_blacklisted_tokens() -> None:
    jwt_header = request.headers.get('Authorization')

    try:
        if jwt_header:
            token = jwt_header.split()[1]
            jti = get_jti(encoded_token=token)
            if redis_store.get(jti):
                raise ExpiredSignatureError()
    except ExpiredSignatureError as e:
        abort(HTTPStatus.UNAUTHORIZED, error_message={"message": str(e)})
