from typing import Annotated
from fastapi import APIRouter, Depends


from src.generation.service import OpenAIChatSession
from src.generation.schemas import (
    ExplainSchemaIn,
    ExplainSchemaOut,
    ReviseSchemaIn,
    ReviseSchemaOut,
    DefineSchemaIn,
    DefineSchemaOut,
    AnnotateSchemaIn,
    AnnotateSchemaOut,
    AnalyseSchemaIn,
    AnalyseSchemaOut,
    GenerativeTransformerModel,
    SystemPrompt,
)


generation_router = APIRouter(
    prefix="/generation",
    tags=["code_generation", "openai", "explanations", "documentation"],
    responses={
        401: {"description": "Invalid user authorization credentials"},
        404: {"description": "Generation route not found."},
    },
)


@generation_router.post("/annotate/", response_model=AnnotateSchemaOut)
async def annotate_code_snippet(metadata: AnnotateSchemaIn):
    chat_session = OpenAIChatSession(
        language=metadata.code_extension,
        model=GenerativeTransformerModel.Azure,
        command=SystemPrompt.Annotate,
    )
    successful_annotation, annotated_output = chat_session.annotate_code_block(
        metadata.code_block_to_generate_from
    )

    return {
        "annotated_output": annotated_output,
        "successful_annotation": successful_annotation,
    }


@generation_router.post("/explain/", response_model=ExplainSchemaOut)
async def explain_code_snippet(metadata: ExplainSchemaIn):
    chat_session = OpenAIChatSession(
        language=metadata.code_extension,
        model=GenerativeTransformerModel.Azure,
        command=SystemPrompt.Explain,
    )
    explained_output = chat_session.explain_code_block(
        metadata.code_block_to_generate_from,
        complexity=metadata.explanation_complexity // 10,
    )

    return {
        "explained_output": explained_output,
        "explanation_complexity": metadata.explanation_complexity,
    }


@generation_router.post("/analyse/", response_model=AnalyseSchemaOut)
async def analyse_code_snippet(metadata: AnalyseSchemaIn):
    chat_session = OpenAIChatSession(
        language=metadata.code_extension,
        model=GenerativeTransformerModel.Azure,
        command=SystemPrompt.Analyse,
    )
    analysed_output, complexity_dict = chat_session.analyse_code_block(
        metadata.code_block_to_generate_from
    )

    return {"analysed_output": analysed_output, "complexity_breakdown": complexity_dict}


@generation_router.post("/revise/", response_model=ReviseSchemaOut)
async def revise_code_snippet(
    metadata: ReviseSchemaIn,
):
    chat_session = OpenAIChatSession(
        language=metadata.code_extension,
        model=GenerativeTransformerModel.Azure,
        command=SystemPrompt.Revise,
    )
    successful_revision, revised_output = chat_session.revise_code_block(
        metadata.code_block_to_generate_from, scheme=metadata.variable_naming_scheme
    )

    return {
        "revised_output": revised_output,
        "successful_revision": successful_revision,
    }


@generation_router.post("/define/", response_model=DefineSchemaOut)
async def define_code_snippet(metadata: DefineSchemaIn):
    chat_session = OpenAIChatSession(
        language=metadata.code_extension,
        model=GenerativeTransformerModel.Azure,
        command=SystemPrompt.Define,
    )
    successful_definition, defined_output = chat_session.define_code_block(
        metadata.code_block_to_generate_from, framework=metadata.alternative_framework
    )

    return {
        "defined_output": defined_output,
        "successful_definition": successful_definition,
    }
