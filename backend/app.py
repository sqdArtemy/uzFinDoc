from flask_cli import FlaskGroup
from flask_restful import Api
from flask_jwt_extended import JWTManager

import views
from app_init import app
from utilities.middlewares import check_blacklisted_tokens

JWTManager(app)
api = Api(app)
cli = FlaskGroup(app)

import models

# User`s URLs
api.add_resource(views.UserRegisterView, "/user/register")
api.add_resource(views.UserLoginView, "/user/login")
api.add_resource(views.UserLogOutView, "/user/logout")
api.add_resource(views.UserDetailedViewSet, "/user/<int:user_id>")
api.add_resource(views.UserMeView, "/me")


@app.before_request
def check_tokens():
    check_blacklisted_tokens()


if __name__ == '__main__':
    app.run()
