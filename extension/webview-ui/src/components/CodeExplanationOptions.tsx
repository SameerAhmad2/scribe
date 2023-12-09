import { vscode } from "../utilities/vscode";
import { CSSProperties, ReactNode, useEffect, useState } from "react";

import { Box, FormControl, SelectChangeEvent } from "@mui/material";
import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";

import {
  StyledLabel,
  StyledSelect,
  StyledLoadingButton,
  StyledSlider,
  StyledTextField,
  StyledTypography,
} from "./common/StyledComponents";
import { fetchExplanation } from "../api/services";

const complexityMarks = [
  {
    value: 1,
    label: "Brief",
  },
  {
    value: 2,
    label: "",
  },
  {
    value: 3,
    label: "Functional",
  },
  {
    value: 4,
    label: "",
  },
  {
    value: 5,
    label: "Elaborate",
  },
];

const explainSectionMetaData = {
  defaultOption: "English",
  sectionTitle: "Language",
  buttonTitle: "Pick Language",
  options: [
    "Arabic",
    "English",
    "German",
    "Hindi",
    "Italian",
    "Japanese",
    "Latin",
    "Mandarin",
    "Portuguese",
    "Russian",
    "Spanish",
    "Urdu",
  ],
};

// Define different styles for your component
const desktopStyles: CSSProperties = {
  display: "flex",
  width: "92%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};

const mobileStyles: CSSProperties = {
  display: "flex",
  width: "92%",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
};

const ExplainLanguageSelection = ({
  section,
  onChangeSelectedOption,
  sectionSelectedOption,
}: any) => {
  const [showOptionTitle, setShowOptionTitle] = useState(
    !sectionSelectedOption
  );

  const handleFocus = () => setShowOptionTitle(false);
  const handleBlur = () => {
    if (!sectionSelectedOption) {
      setShowOptionTitle(true);
    } else {
      setShowOptionTitle(false);
    }
  };

  const { defaultOption, options, sectionTitle, buttonTitle } = section;
  const handleOptionChange = (
    event: SelectChangeEvent<unknown>,
    _: ReactNode
  ) => {
    const {
      target: { value },
    } = event;
    setShowOptionTitle(false);
    onChangeSelectedOption(value as string);
  };

  useEffect(() => {
    if (sectionSelectedOption || defaultOption) {
      setShowOptionTitle(false);
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        {...{
          sx: { display: "flex", width: "92%" },
        }}
      >
        <FormControl sx={{ width: "100%" }}>
          <StyledLabel
            id="documentation-alternative-section-label"
            htmlFor="documentation-alternative-section-native-select"
          >
            {showOptionTitle ? buttonTitle : sectionTitle}
          </StyledLabel>
          {
            <StyledSelect
              native
              fullWidth
              variant="outlined"
              onBlur={handleBlur}
              onFocus={handleFocus}
              onChange={handleOptionChange}
              id="documentation-alternative-section-native-select"
              value={sectionSelectedOption || defaultOption || ""}
              labelId="documentation-alternative-section-name-label"
            >
              {(options as string[]).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </StyledSelect>
          }
        </FormControl>
      </Box>
    </Box>
  );
};

const CodeExplain = () => {
  const [text, setText] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [options, setOptions] = useState({ complexity: 2 });
  const [selectedOption, setSelectedOption] = useState("");
  const [responsiveDivStyles, setResponsiveDivStyles] = useState<CSSProperties>(
    window.innerWidth <= 500 ? mobileStyles : desktopStyles
  );

  const onChangeComplexity = (_: any, complexity: number | number[]) =>
    setOptions({ ...options, complexity: complexity as number });

  const onClick = () => {
    vscode.postMessage({
      command: "explain",
      text: selectedOption
        ? JSON.stringify({ additional_context: selectedOption.toLowerCase() })
        : '""',
    });
  };

  const loadingWrapper = async (
    fn: Function,
    args: any[],
    error_msg: string
  ) => {
    try {
      setWaiting(true);
      const res = await fn(...args);
      setWaiting(false);
      return { status: true, content: res };
    } catch (error) {
      setWaiting(false);
      return { status: false, error_msg };
    }
  };

  const onChangeSelectedOption = (new_option: string) => {
    setSelectedOption(new_option);
  };

  const getExplanationOutput = async (
    inputCode: string,
    complexity: number,
    language?: string,
    responseLanguage?: string
  ) => {
    return await loadingWrapper(
      fetchExplanation,
      [inputCode, complexity, language, responseLanguage],
      "Failed to generate an explanation...\n Please try again!"
    );
  };

  // Add an event listener to update styles on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 500) {
        setResponsiveDivStyles(mobileStyles);
      } else {
        setResponsiveDivStyles(desktopStyles);
      }
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [desktopStyles, mobileStyles]);

  useEffect(() => {
    const handleMessageEvent = async (event: MessageEvent) => {
      if (!event.data) {
        vscode.postMessage({
          command: "error",
          text: "Oops... an error occured! Please try again.",
        });
        return true;
      }

      const {
        command,
        language,
        additional_context,
        response: { content, range: _ },
      } = JSON.parse(event.data);

      switch (command) {
        case "explain":
          const result = await getExplanationOutput(
            content,
            options.complexity,
            language,
            additional_context
          );
          if (result.status && result.content.status) {
            setText(result.content.content);
          } else {
            vscode.postMessage({
              command: "notify",
              text: !result.status
                ? result.error_msg
                : result.content.error_msg,
            });
          }
          return true;

        default:
          return false;
      }
    };

    window.addEventListener("message", handleMessageEvent);
    return () => window.removeEventListener("message", handleMessageEvent);
  }, [options.complexity]);

  return (
    <main
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent:"flex-start"
      }}
    >
      <StyledTypography variant="h6" fontWeight="bold">
        Set Explanation Granularity
      </StyledTypography>

      <div
        style={{
          width: "100%",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "80%" }}>
          <StyledSlider
            {...{
              marks: complexityMarks,
              step: 1,
              min: 1,
              max: 5,
              valueLabelDisplay: "auto",
              value: options.complexity,
              defaultValue: options.complexity,
              onChangeCommitted: onChangeComplexity,
              "aria-label": "Code Explanation Complexity",
            }}
          />
        </Box>
      </div>

      <br />
      <div style={responsiveDivStyles}>
        {
          <ExplainLanguageSelection
            {...{
              section: explainSectionMetaData,
              onChangeSelectedOption: onChangeSelectedOption,
              sectionSelectedOption: selectedOption,
            }}
          />
        }
        <br />
        <Box
          {...{
            sx: {
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          <Box
            {...{
              sx: {
                display: "flex",
                width: "92%",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          >
            <StyledLoadingButton
              {...{ onClick, variant: "outlined", loading: waiting }}
              fullWidth
            >
              Explain
            </StyledLoadingButton>
          </Box>
        </Box>
      </div>

      <br />
      <VSCodeDivider />

      <br />
      <Box
        {...{
          component: "form",
          autoComplete: "off",
          sx: { width: "90%", color: "#feefb7" },
        }}
        noValidate
      >
        <StyledTextField
          {...{
            value: text,
            maxRows: 26,
            label: "Explanation Output",
            InputProps: { readOnly: true },
            id: "styled-explanation-text-area",
            placeholder:
              "\nHighlight code snippets from your editor to see the generated function explanations!\n",
            defaultValue:
              "\nHighlight code snippets from your editor to see the generated function explanations!\n",
          }}
          multiline
          fullWidth
          focused
          autoFocus
        />
      </Box>
    </main>
  );
};

export default CodeExplain;
