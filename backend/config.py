import os
from datetime import timedelta

from utilities.functions import get_env_variable


class Config:
    # App settings:
    JSON_SORT_KEYS = False
    TESTING = False
    DEBUG = False
    CSRF_ENABLED = True
    PROPAGATE_EXCEPTIONS = True
    SECRET_KEY = get_env_variable("SECRET_KEY")
    JWT_SECRET_KEY = get_env_variable("JWT_SECRET_KEY")
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    ROOT_FOLDER = os.path.abspath(os.path.dirname(__name__))
    UPLOAD_FOLDER = os.path.join(ROOT_FOLDER, "media/uploads")

    #  Postgres config
    POSTGRES_URL = get_env_variable("POSTGRES_URL")
    POSTGRES_USER = get_env_variable("POSTGRES_USER")
    POSTGRES_PW = get_env_variable("POSTGRES_PW")
    POSTGRES_DB = get_env_variable("POSTGRES_DB")

    # Database URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = f"postgresql://{POSTGRES_USER}:{POSTGRES_PW}@{POSTGRES_URL}/{POSTGRES_DB}"
    DATE_FORMAT = "%Y-%m-%d"
    DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S%z"

    # Redis
    REDIS_HOST = get_env_variable("REDIS_HOST")
    REDIS_PORT = get_env_variable("REDIS_PORT")
    REDIS_DB = get_env_variable("REDIS_DB")


class ProductionConfig(Config):
    DEBUG = False


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
