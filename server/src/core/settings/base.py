import os

from dotenv import load_dotenv
from pydantic import ConfigDict
from base64 import b64decode as b64d
from pydantic_settings import BaseSettings

load_dotenv()


class CommonSettings(BaseSettings):
    app_name: str = "CodeScribe"
    app_version: str = "0.0.1"
    extension_version: str = "0.0.1"
    organization_name: str = "SNED"
    app_environment: str = os.getenv("ENVIRONMENT", None)

    openai_organization: str = os.getenv("OPENAI_ORGANIZATION_ID", None)
    openai_api_secret_key: str = os.getenv("OPENAI_SECRET_KEY", None)

    accepted_versions: list[str] = ["v1"]
    deprecated_versions: list[str] = []

    requests_per_user_per_minute: int = 10
    model_config = ConfigDict(
        ignored_types=(
            int,
            str,
        ),
    )
