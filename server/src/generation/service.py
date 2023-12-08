import openai

from src.core.utils import timeit
from src.core.settings import AppSettings
from src.generation.schemas import (
    AcceptedCodeLanguages,
    GenerativeTransformerModel,
    SystemPrompt,
)
from .constants import (
    ANNOTATE_PROMPT,
    ANALYSE_PROMPT,
    REVISE_PROMPT,
    EXPLAIN_PROMPT,
    DEFINE_PROMPT,
    ANNOTATE_CODE_PREFIX,
    EXPLAIN_CODE_PREFIX,
    REVISE_CODE_PREFIX,
    ANALYSE_CODE_PREFIX,
    DEFINE_CODE_PREFIX,
    FRAMEWORK_PARAMETER_TAG,
    COMPLEXITY_PARAMETER_TAG,
    NAME_SCHEME_PARAMETER_TAG,
)


settings = AppSettings()
openai.api_key = settings.openai_api_secret_key
openai.organization = settings.openai_organization


class OpenAIChatSession:
    session = None

    def __init__(
        self,
        command: SystemPrompt,
        language: AcceptedCodeLanguages,
        model: GenerativeTransformerModel = GenerativeTransformerModel.Simple,
    ):
        self.model = model
        self.command = command
        self.language = language
        self.session = openai.OpenAI(
            api_key=settings.openai_api_secret_key,
            organization=settings.openai_organization,
        )

    @classmethod
    def get_chat_models(cls):
        return openai.Model.list()

    def single_line_comment(self, line) -> bool:
        if self.language == "python":
            return line[0] == "#" or not line.count("'''") % 2
        return False

    def comment_block_signature(self, line) -> bool:
        if self.language == "python":
            return line.count("'''") % 2 == 1
        return False

    @timeit
    def verify_revision_correctness(self, original, generated_code) -> bool:
        return True

    @timeit
    def verify_code_correctness(self, original, generated_code) -> bool:
        original_code_lines = list(filter(lambda x: x != "", original.split("\n")))
        generated_code_lines = list(
            filter(lambda x: x != "", generated_code.split("\n"))
        )

        original_pointer = 0
        initiated_comment_block = False
        for line in generated_code_lines:
            # If observed comment block initiation previously and see another. This marks the
            # end of a comment block so we can safely set comment block to False
            if initiated_comment_block:
                if self.comment_block_signature(line):
                    initiated_comment_block = False
                continue

            # If we are not in a comment block and see its signature, we have initiated a comment block
            # Therefore we can ignore all lines until we reach the end of the comment block
            if not initiated_comment_block and self.comment_block_signature(line):
                initiated_comment_block = True
                continue

            # If we are not in a comment block or a single line comment we can compare and continue
            if not self.single_line_comment(line):
                if line != original_code_lines[original_pointer]:
                    return False
                original_pointer += 1

        return True

    def get_system_prompt(self) -> str:
        if self.command == SystemPrompt.Define:
            return DEFINE_PROMPT
        if self.command == SystemPrompt.Revise:
            return REVISE_PROMPT
        if self.command == SystemPrompt.Analyse:
            return ANALYSE_PROMPT
        if self.command == SystemPrompt.Explain:
            return EXPLAIN_PROMPT
        return ANNOTATE_PROMPT

    def generate_conversation_messages(self, user_content: str = ""):
        if not user_content:
            raise Exception("No user prompt provided")
        return [
            {"role": "system", "content": self.get_system_prompt()},
            {"role": "user", "content": user_content},
        ]

    @staticmethod
    def remove_gpt_based_comment_blocks_from_code(code_block: str) -> str:
        lines_of_code = code_block.split("\n")
        if lines_of_code[0].startswith("```"):
            lines_of_code = lines_of_code[1:]
        return "\n".join(lines_of_code).rstrip("\n").rstrip("`")

    @timeit
    # Annotate code block that returns a commented version of code which is analogous in functionality.
    # Provided line by line code documentation for functions and classes.
    def annotate_code_block(self, code_block) -> tuple[bool, str]:
        if self.session is None:
            raise Exception("OpenAI session doesn't exist")
        response = self.session.chat.completions.create(
            model=self.model.value,
            messages=self.generate_conversation_messages(
                user_content=f"{ANNOTATE_CODE_PREFIX}\n\n{code_block}"
            ),
        )
        response_block = response.choices[0].message.content
        code_matched = self.verify_code_correctness(code_block, response_block)
        return code_matched, response_block

    @timeit
    # Explain code block that returns description of code with an appropriate level of technical complexity
    def explain_code_block(self, code_block, complexity: int = 3):
        if self.session is None:
            raise Exception("OpenAI session doesn't exist")
        explanation_query = f"{EXPLAIN_CODE_PREFIX} {COMPLEXITY_PARAMETER_TAG}={complexity}\n\n{code_block}"
        response = self.session.chat.completions.create(
            model=self.model.value,
            messages=self.generate_conversation_messages(
                user_content=explanation_query
            ),
        )
        return response.choices[0].message.content

    @timeit
    # Returns the same code block but adds a function or class definition to each declaration in the block
    # in the format of the specified framework
    def define_code_block(self, code_block, framework: str = None) -> tuple[bool, str]:
        if self.session is None:
            raise Exception("OpenAI session doesn't exist")
        definition_query = (
            f"{DEFINE_CODE_PREFIX} {FRAMEWORK_PARAMETER_TAG}={framework}\n\n{code_block}"
            if framework
            else f"{DEFINE_CODE_PREFIX}\n\n{code_block}"
        )
        response = self.session.chat.completions.create(
            model=self.model.value,
            messages=self.generate_conversation_messages(user_content=definition_query),
        )
        response_block = response.choices[0].message.content
        code_matched = self.verify_code_correctness(code_block, response_block)
        return code_matched, self.remove_gpt_based_comment_blocks_from_code(
            response_block
        )

    @staticmethod
    @timeit
    def parse_complexity_analysis_output(analysis: str) -> dict[str, dict[str, str]]:
        output_dict = dict()
        individual_complexities = analysis.split("\n")
        for line in individual_complexities:
            parts = line.split(":")
            complexity_dict = dict()
            function_name, function_complexity_string = parts[0], parts[1]
            split_complexities = function_complexity_string.split(",")
            runtime, space = [*split_complexities[0]], [*split_complexities[1]]
            if not len(split_complexities[0]) or not len(split_complexities[1]):
                return {}

            # Go through runtime complexity and parse big O notation.
            try:
                while space.pop() != " ":
                    continue
                while runtime.pop() != " ":
                    continue
            except IndexError as e:
                return {}
            complexity_dict["space"] = "".join(space).rstrip(" ").lstrip(" ")
            complexity_dict["runtime"] = "".join(runtime).rstrip(" ").lstrip(" ")

            # Go through space complexity and parse big O notation.
            output_dict[function_name] = complexity_dict
        return output_dict

    @timeit
    # Analyse code block returns a dictionary of the runtime and space complexity breakdown of
    # all functions declared within a code block
    def analyse_code_block(self, code_block) -> tuple[str, dict[str, dict[str, str]]]:
        if self.session is None:
            raise Exception("OpenAI session doesn't exist")
        response = self.session.chat.completions.create(
            model=self.model.value,
            messages=self.generate_conversation_messages(
                user_content=f"{ANALYSE_CODE_PREFIX}\n\n{code_block}"
            ),
        )

        analysed_output = response.choices[0].message.content
        return analysed_output, self.parse_complexity_analysis_output(analysed_output)

    @timeit
    # Revise code block provides a revised version of the block with updated variable names in
    # any case that is requested by the client.
    def revise_code_block(self, code_block, scheme: str = "lower") -> tuple[bool, str]:
        if self.session is None:
            raise Exception("OpenAI session doesn't exist")
        revision_query = (
            f"{REVISE_CODE_PREFIX} {NAME_SCHEME_PARAMETER_TAG}={scheme}\n\n{code_block}"
        )
        response = self.session.chat.completions.create(
            model=self.model.value,
            messages=self.generate_conversation_messages(user_content=revision_query),
        )
        response_block = response.choices[0].message.content
        code_matched = self.verify_revision_correctness(code_block, response_block)
        return code_matched, self.remove_gpt_based_comment_blocks_from_code(
            response_block
        )
