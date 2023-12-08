from enum import Enum
from typing import Literal, Union
from src.core.schemas import PrivateBaseModel

from pydantic import FieldValidationInfo, field_validator


class SystemPrompt(Enum):
    Define = "/define"
    Revise = "/revise"
    Analyse = "/analyse"
    Explain = "/explain"
    Annotate = "/annotate"


class GenerativeTransformerModel(Enum):
    Complex = "gpt-4"
    Simple = "gpt-3.5-turbo"
    Intermediate = "gpt-3.5-turbo-16k"
    Azure = "gpt-model-01"


class AcceptedCodeLanguages(Enum):
    Python = "python"
    Javascript = "javascript"
    Typescript = "typescript"


class BaseGenerationSchema(PrivateBaseModel):
    language_model: Literal["openai"]
    code_block_to_generate_from: str
    code_extension: AcceptedCodeLanguages


class DefineSchemaIn(BaseGenerationSchema):
    alternative_framework: str = None

    @field_validator("alternative_framework", mode="before")  # noqa
    @classmethod
    def ensure_valid_framework_for_code_extension(
        cls, alternative_framework: Union[str, None], info: FieldValidationInfo
    ):
        valid_frameworks = {
            "python": ["Sphinx", "Doxygen", "pdoc", "SwaggerUI"],
            "typescript": ["TypeDoc", "JSDoc", "ESDoc"],
            "javascript": ["JSDoc", "ESDoc"],
        }

        code_extension = info.data.get("code_extension")
        if not code_extension:
            raise ValueError("Invalid code extension provided")
        if (
            alternative_framework is not None
            and alternative_framework not in valid_frameworks[code_extension.value]
        ):
            raise ValueError(
                f"Invalid framework provided for the given programming language"
            )
        return alternative_framework


class ReviseSchemaIn(BaseGenerationSchema):
    variable_naming_scheme: str = "lower"

    @field_validator("variable_naming_scheme", mode="before")  # noqa
    @classmethod
    def ensure_valid_naming_scheme(
        cls, variable_naming_scheme: Union[str, None], _: FieldValidationInfo
    ):
        valid_naming_schemes = [
            "snake",
            "camel",
            "pascal",
            "lower",
            "upper",
            "hungarian",
        ]
        if (
            variable_naming_scheme is not None
            and variable_naming_scheme not in valid_naming_schemes
        ):
            raise ValueError(f"Naming scheme must be in {valid_naming_schemes}")
        return variable_naming_scheme


class AnalyseSchemaIn(BaseGenerationSchema):
    pass


class AnnotateSchemaIn(BaseGenerationSchema):
    pass


class ExplainSchemaIn(BaseGenerationSchema):
    explanation_complexity: int = 30

    @field_validator("explanation_complexity", mode="before")  # noqa
    @classmethod
    def ensure_valid_complexity_level(
        cls, explanation_complexity: int, _: FieldValidationInfo
    ):
        if explanation_complexity not in [10, 20, 30, 40, 50]:
            raise ValueError(
                "Explanation complexity must be between in [10, 20, 30, 40, 50]"
            )
        return explanation_complexity


FuncName = str


class FuncComplexity(PrivateBaseModel):
    space: str
    runtime: str


class AnalyseSchemaOut(PrivateBaseModel):
    analysed_output: str
    complexity_breakdown: dict[FuncName, FuncComplexity]


class DefineSchemaOut(PrivateBaseModel):
    defined_output: str
    successful_definition: bool


class ReviseSchemaOut(PrivateBaseModel):
    revised_output: str
    successful_revision: bool


class AnnotateSchemaOut(PrivateBaseModel):
    annotated_output: str
    successful_annotation: bool


class ExplainSchemaOut(PrivateBaseModel):
    explanation_complexity: int
    explained_output: str
