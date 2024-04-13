from flask_cli import FlaskGroup
from flask_restful import Api
from flask_jwt_extended import JWTManager

from app_init import app

JWTManager(app)
api = Api(app)
cli = FlaskGroup(app)

import models

if __name__ == '__main__':
    app.run()
