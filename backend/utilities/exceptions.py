"""
There are all custom exceptions that are specific for this project.
"""


class EnvVariableError(Exception):
    def __init__(self, env_name: str):
        self.env_name = env_name

    def __str__(self) -> str:
        return f"Environment variable '{self.env_name}' is not defined."


class JWTExpiredError(Exception):
    def __init__(self):
        self.message = "Provided JWT has expired."

    def __str__(self) -> str:
        return self.message
