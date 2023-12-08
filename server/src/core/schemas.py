from decimal import Decimal
from datetime import datetime

from pydantic import BaseModel, model_validator, model_serializer


class PrivateBaseModel(BaseModel):
    @classmethod
    @model_validator(mode="before")
    def set_null_microseconds(cls, data: dict) -> dict:
        """Drops microseconds in all the datetime field values."""
        datetime_fields = {
            k: v.replace(microsecond=0).isoformat()
            for k, v in data.items()
            if isinstance(k, datetime)
        }
        return {**data, **datetime_fields}

    @classmethod
    @model_validator(mode="before")
    def set_max_decimal_places(cls, data: dict) -> dict:
        """Truncates all decimal values to 3 decimal places"""
        decimal_fields = {
            k: round(v, 3) for k, v in data.items() if isinstance(k, Decimal)
        }
        return {**data, **decimal_fields}

    @model_serializer
    def to_serializable_dict(self) -> dict:
        """Return a dict which contains only serializable fields."""
        return self.__dict__
