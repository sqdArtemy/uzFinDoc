import os
import aiofiles
from typing import BinaryIO
from dotenv import load_dotenv
from openai import OpenAI

from utilities.exceptions import EnvVariableError


def get_env_variable(name: str) -> str | EnvVariableError:
    try:
        load_dotenv()
        return os.environ[name]
    except KeyError:
        EnvVariableError(env_name=name)


def is_file_exists(file_path: str) -> bool:
    if os.path.exists(file_path):
        return True
    else:
        return False


async def save_file(input_file: BinaryIO, file_path: str) -> None:
    async with aiofiles.open(file_path, mode="wb") as file:
        await file.write(input_file.read())


async def get_text_translation(text: str) -> str:
    client = OpenAI(api_key=get_env_variable("OPENAI_KEY"))
    temperature = float(get_env_variable("OPENAI_TEMPERATURE"))
    model = get_env_variable("OPENAI_MODEL")

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a professional bot which translates financial documents from uzbek language to english. So please, translate given text precisly and thoroughly."},
            {"role": "user", "content": text}
        ],
        temperature=temperature
    )

    return response.choices[0].message.content

