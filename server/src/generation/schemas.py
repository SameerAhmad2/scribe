
from enum import Enum
from typing import Literal, Union
from src.core.schemas import PrivateBaseModel

from fastapi import Form
from typing import Annotated
from pydantic import FieldValidationInfo, field_validator


class SystemPrompt(Enum):
    Define = '/define'
    Revise = '/revise'
    Analyse = '/analyse'
    Explain = '/explain'
    Annotate = '/annotate'
    Generate = '/generate'


class GenerativeTransformerModel(Enum):
    Complex = "gpt-4"
    Simple = "gpt-3.5-turbo"
    Intermediate = "gpt-3.5-turbo-16k"
    Azure = "gpt-model-01"


class AcceptedCodeLanguages(Enum):
    Java = 'java'
    Python = 'python'
    CPlusPlus = 'cpp'
    Javascript = 'javascript'
    Typescript = 'typescript'
    JavascriptReact = 'javascriptreact'
    TypescriptReact = 'typescriptreact'


class AcceptedNaturalLanguages(Enum):
    Urdu = 'urdu'
    Hindi = 'hindi'
    Latin = 'latin'
    German = 'german'
    Arabic = 'arabic'
    Russian = 'russian'
    Italian = 'italian'
    English = 'english'
    Spanish = 'spanish'
    Mandarin = 'mandarin'
    Japanese = 'japanese'
    Portuguese = 'portuguese'


class BaseGenerationSchema(PrivateBaseModel):
    language_model: Literal['openai']
    code_block_to_generate_from: str
    code_extension: AcceptedCodeLanguages


class BaseGenerationPDFSchema(PrivateBaseModel):
    language_model: Literal['openai']
    code_extension: AcceptedCodeLanguages


class DefineSchemaIn(BaseGenerationSchema):
    alternative_framework: str = None

    @field_validator('alternative_framework', mode='before')  # noqa
    @classmethod
    def ensure_valid_framework_for_code_extension(cls, alternative_framework: Union[str, None],
                                                  info: FieldValidationInfo):
        valid_frameworks = {
            'cpp': [],
            'python': ['pydoc', 'docstring', 'doxygen', 'swaggerUI', 'sphinx'],  # noqa
            'javascript': ['jsdoc', 'esdoc'],  # noqa
            'javascriptreact': ['jsdoc', 'esdoc'],  # noqa
            'typescript': ['typedoc', 'tsdoc', 'esdoc'],  # noqa
            'typescriptreact': ['typedoc', 'tsdoc', 'esdoc'],  # noqa
            'java': ['javadoc'],  # noqa
        }

        code_extension = info.data.get('code_extension')
        if not code_extension:
            raise ValueError('Invalid code extension provided')
        if alternative_framework is not None \
                and alternative_framework.lower() not in valid_frameworks[code_extension.value]:
            raise ValueError(
                f"Invalid framework provided for the given programming language")
        return alternative_framework


class ReviseSchemaIn(BaseGenerationSchema):
    variable_naming_scheme: str = 'lower'

    @field_validator('variable_naming_scheme', mode='before')  # noqa
    @classmethod
    def ensure_valid_naming_scheme(cls, variable_naming_scheme: Union[str, None], _: FieldValidationInfo):
        valid_naming_schemes = ['snake', 'camel',
                                'pascal', 'lower', 'upper', 'hungarian']
        if variable_naming_scheme is not None and variable_naming_scheme not in valid_naming_schemes:
            raise ValueError(
                f"Naming scheme must be in {valid_naming_schemes}")
        return variable_naming_scheme


class AnalyseSchemaIn(BaseGenerationSchema):
    pass


class AnnotateSchemaIn(BaseGenerationSchema):
    pass


class ExplainSchemaIn(BaseGenerationSchema):
    explanation_complexity: int = 30
    response_language: AcceptedNaturalLanguages = AcceptedNaturalLanguages.English

    @field_validator('explanation_complexity', mode='before')  # noqa
    @classmethod
    def ensure_valid_complexity_level(cls, explanation_complexity: int, _: FieldValidationInfo):
        if explanation_complexity not in [10, 20, 30, 40, 50]:
            raise ValueError(
                "Explanation complexity must be between in [10, 20, 30, 40, 50]")
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


class FunctionExplanationSchema(PrivateBaseModel):
    name: str
    description: str
    function_descriptor: str

    # Code blocks that show example usage
    usage_example: str


class GeneratePDFSchemaOut(PrivateBaseModel):
    id: str
    title: str
    footnotes: list[str]
    description: Union[str, None]
    function_explanations: list[FunctionExplanationSchema]


class GeneratePDFSchemaIn(BaseGenerationPDFSchema):

    @classmethod
    def as_form(cls,
                language_model: Annotated[Literal['openai'], Form()],
                code_extension: Annotated[AcceptedCodeLanguages, Form()]) -> 'GeneratePDFSchemaIn':

        return cls(language_model=language_model,
                   code_extension=code_extension)
    pass
