import os
from dotenv import load_dotenv

from utilities.exceptions import EnvVariableError


def get_env_variable(name: str) -> str | EnvVariableError:
    try:
        load_dotenv()
        return os.environ[name]
    except KeyError:
        EnvVariableError(env_name=name)