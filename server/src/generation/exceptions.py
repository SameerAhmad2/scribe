
from typing import Any
from functools import wraps
from fastapi import HTTPException
from collections.abc import Callable

from openai import APIError, APIConnectionError, \
    RateLimitError, AuthenticationError, OpenAIError


def openai_error_handler(func: Callable[..., Any]):
    @wraps(func)
    def capture_error_information(*args, **kwargs):
        try:
            return func(*args, **kwargs)

        except (APIError, OpenAIError) as e:
            # Handle API error here, e.g. retry or log
            print(f"OpenAI API returned an API Error: {e}")
            raise HTTPException(
                status_code=503, detail="Service is temporarily unavailable... Please try again later!")

        except (AuthenticationError, PermissionError) as e:
            # Handle connection error here
            print(
                f"Failed to authenticate with provided token for OpenAI API: {e}")
            raise HTTPException(
                status_code=503, detail="Service is temporarily unavailable... Please try again later!")

        except (APIConnectionError) as e:
            # Handle connection error here
            print(f"Failed to connect or verify signature to OpenAI API: {e}")
            raise HTTPException(
                status_code=503, detail="Service is temporarily unavailable... Please try again later!")

        except RateLimitError as e:
            # Handle rate limit error (we recommend using exponential backoff)
            print(f"OpenAI API request exceeded rate limit: {e}")
            raise HTTPException(
                status_code=503, detail="Service is temporarily unavailable... Please try again later!")

    return capture_error_information
