"""
Script for generating .env template
"""
import secrets


def env_generator() -> None:
    with open(".env", 'w') as env_file:
        env_file.write(f"""SECRET_KEY="{secrets.token_urlsafe(32)}"
JWT_SECRET_KEY="{secrets.token_urlsafe(32)}"
POSTGRES_USER=""
POSTGRES_PW=""
POSTGRES_URL="127.0.0.1:5432"
POSTGRES_DB=""
REDIS_HOST=""
REDIS_PORT=""
REDIS_DB=""
UZWORDNET_FILE="./media/uzwordnet.json"
OPENAI_KEY=""
OPENAI_MODEL="gpt-4-turbo"
OPENAI_TEMPERATURE=0.5
""")


if __name__ == "__main__":
    env_generator()
