from http import HTTPStatus
from flask_cli import FlaskGroup
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask_restful import Api, abort
from flask_jwt_extended import JWTManager
from flask_cors import CORS

import views
from app_init import app
from utilities.middlewares import check_blacklisted_tokens

jwt_ = JWTManager(app)
api = Api(app)
cli = FlaskGroup(app)
CORS(app)

import models

# User`s URLs
api.add_resource(views.UserRegisterView, "/user/register")
api.add_resource(views.UserLoginView, "/user/login")
api.add_resource(views.UserLogOutView, "/user/logout")
api.add_resource(views.UserDetailedViewSet, "/user/<int:user_id>")
api.add_resource(views.UserMeView, "/me")


@app.errorhandler(NoAuthorizationError)
def incorrect_jwt(*args, **kwargs):
    abort(HTTPStatus.UNAUTHORIZED, error_message={"message": "Missing token."})


@app.before_request
def check_tokens():
    check_blacklisted_tokens()


if __name__ == '__main__':
    app.run()
