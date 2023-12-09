import { vscode } from "../utilities/vscode";
import {
  CSSProperties,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";

import {
  Box,
  styled,
  FormControl,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

import {
  StyledLabel,
  StyledSelect,
  StyledLoadingButton,
  StyledTypography,
} from "./common/StyledComponents";
import {
  fetchAnalysis,
  fetchAnnotation,
  fetchDefinition,
  fetchRevision,
  fetchPDFMetaData
} from "../api/services";

const documentationOptionsMetaData = [
  {
    id: "define",
    buttonName: "Define",
    name: "Code Definitions",
    description:
      "Create framework specific definitions for your functions and classes \
    for easier manual documentation integrations and quick standardization!",
    onClick: (framework: string | undefined = undefined) =>
      vscode.postMessage({
        command: "define",
        text: framework
          ? JSON.stringify({ additional_context: framework })
          : '""',
      }),
    secondSection: {
      defaultOption: "",
      hasGroupedOptions: true,
      sectionTitle: "Doc Framework",
      buttonTitle: "Pick Framework",
      options: {
        Python: ["pydoc", "Docstring", "Doxygen", "SwaggerUI", "Sphinx"],
        Javascript: ["JSDoc", "ESDoc"],
        Typescript: ["TypeDoc", "TSDoc", "ESDoc"],
        Java: ["Javadoc"],
      },
    },
  },
  {
    id: "annotate",
    buttonName: "Annotate",
    name: "Inline Comments & Annotations",
    description:
      "Generate line by line comment to explain complex functions with relative ease. \
    These annotations make code sharing especially more efficient for developers",
    onClick: () => vscode.postMessage({ command: "annotate", text: '""' }),
  },
  {
    id: "revise",
    buttonName: "Revise",
    name: "Variable Naming Revisions",
    description:
      "Streamline your variable names with clear and concise names following a casing scheme of your choice.",
    onClick: (casing_scheme: string | undefined = undefined) =>
      vscode.postMessage({
        command: "revise",
        text: casing_scheme
          ? JSON.stringify({ additional_context: casing_scheme })
          : '""',
      }),
    secondSection: {
      defaultOption: "lower",
      sectionTitle: "Casing Scheme",
      hasGroupedOptions: false,
      buttonTitle: "Choose Casing Scheme",
      options: ["camel", "snake", "lower", "upper", "pascal"],
    },
  },
  {
    id: "analyze",
    buttonName: "Analyze",
    name: "Space & Runtime Complexity",
    description:
      "Understand your code efficiency and optimize code execution times by analyzing runtime complexity.",
    onClick: () => vscode.postMessage({ command: "analyze", text: '""' }),
  },
];

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  color: `${theme.palette.primary.contrastText}`,
  border: `2px solid ${theme.palette.primary.main}`,
  backgroundColor: "transparent",
  "&:not(:last-child)": { borderBottom: 0 },
  "&:before": { display: "none" },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary

    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "transparent",
  color: `${theme.palette.primary.contrastText}`,
  border: `1px solid ${theme.palette.primary.main}`,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: `${theme.palette.primary.contrastText}`,
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  color: `${theme.palette.primary.contrastText}`,
  padding: theme.spacing(2),
  backgroundColor: "transparent",
  borderTop: `2px solid ${theme.palette.primary.main}`,
}));

const DocumentationOptionAlternativeSection = ({
  section: {
    sectionTitle,
    buttonTitle,
    hasGroupedOptions,
    options,
    defaultOption,
  },
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
          {hasGroupedOptions ? (
            <StyledSelect
              native
              fullWidth
              variant="outlined"
              onBlur={handleBlur}
              onFocus={handleFocus}
              onChange={handleOptionChange}
              labelId="documentation-alternative-section-label"
              value={sectionSelectedOption || defaultOption || ""}
              id="documentation-alternative-section-native-select"
            >
              <option aria-label="None" value="" />
              {Object.keys(options).map((groupName) => (
                <optgroup key={groupName} label={groupName}>
                  {(options as any)[groupName].map((groupElement: any) => (
                    <option
                      key={`${groupName}-${groupElement}`}
                      value={groupElement}
                    >
                      {groupElement}
                    </option>
                  ))}
                </optgroup>
              ))}
            </StyledSelect>
          ) : (
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
          )}
        </FormControl>
      </Box>
    </Box>
  );
};

const DocumentationAccordion = ({
  loading,
}: {
  loading: { [option_id: string]: boolean };
}) => {
  const [expanded, setExpanded] = useState<string[] | false>(() =>
    documentationOptionsMetaData.map(({ id }) => id)
  );

  // Define different styles for your component
  const desktopStyles: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  };

  const mobileStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };

  // Initialize with the appropriate styles based on the viewport width
  const [responsiveDivStyles, setResponsiveDivStyles] = useState<CSSProperties>(
    window.innerWidth <= 500 ? mobileStyles : desktopStyles
  );

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

  const [selectedOptions, setSelectedOptions] = useState(() => {
    let optionMap: { [option_id: string]: string } = {};
    documentationOptionsMetaData.map(({ id }) => {
      optionMap[id] = "";
    });

    return optionMap;
  });

  const onChangeSelectedOption = (id: string) => (new_option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: new_option }));
  };

  const handleAccordionStateChange =
    (panel: string) => (_: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(() => {
        if (typeof expanded === "boolean") {
          return newExpanded ? [panel] : false;
        } else {
          if (expanded.includes(panel)) {
            return newExpanded
              ? expanded
              : expanded.filter((id) => id != panel);
          } else {
            return newExpanded ? expanded.concat(panel) : expanded;
          }
        }
      });
    };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  return (
    <div>
      {documentationOptionsMetaData.map(
        ({ name, buttonName, description, id, secondSection, onClick }) => (
          <Accordion
            key={id}
            expanded={
              typeof expanded === "boolean" ? expanded : expanded.includes(id)
            }
            onChange={handleAccordionStateChange(id)}
          >
            <AccordionSummary
              aria-controls="documentation-accordian-content"
              id="documentation-accordian-header"
              expandIcon={
                <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />
              }
            >
              <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{description}</Typography>

              <br />
              <br />
              <div style={responsiveDivStyles}>
                {secondSection && (
                  <DocumentationOptionAlternativeSection
                    {...{
                      section: secondSection,
                      onChangeSelectedOption: onChangeSelectedOption(id),
                      sectionSelectedOption: selectedOptions[id],
                    }}
                  />
                )}
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
                      {...{
                        loading: loading[id],
                        onClick: () =>
                          onClick(selectedOptions[id] || undefined),
                        variant: "outlined",
                      }}
                      fullWidth
                    >
                      {buttonName}
                    </StyledLoadingButton>
                  </Box>
                </Box>
              </div>
              <br />
            </AccordionDetails>
          </Accordion>
        )
      )}
    </div>
  );
};

const DocOptions = () => {
  const onGenerateDoc = () => {
    vscode.postMessage({
      command: "generate_pdf",
      text: "",
    });
  };

  const [loadingMD, setLoadingMD] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loading, setLoading] = useState(() => {
    const idMap: { [id: string]: boolean } = {};

    for (const element of documentationOptionsMetaData) {
      idMap[element.id] = false;
    }

    return idMap;
  });

  const setLoadingForId = (id: string, flag: boolean) => {
    setLoading((prev) => ({ ...prev, [id]: flag }));
  };

  const loadingWrapper = async (
    fn: Function,
    args: any[],
    option_id: string,
    error_msg: string
  ) => {
    try {
      setLoadingForId(option_id, true);
      const content = await fn(...args);
      setLoadingForId(option_id, false);
      return { status: true, content };
    } catch (error) {
      setLoadingForId(option_id, false);
      return { status: false, error_msg };
    }
  }

  const loadingWrapperPDF = async (fn: Function, args: any[], error_msg: string) => {
    try {
      setLoadingPDF(true)
      const content = await fn(...args)
      setLoadingPDF(false)
      return { status: true, content }
    } catch (error) {
      setLoadingPDF(false)
      return { status: false, error_msg }
    }
  }

  const getPDFMetadataOutput = async (fileInfo: string, language?: string) => {
    return await loadingWrapperPDF(fetchPDFMetaData, [fileInfo, language],
      'Failed to get PDF metadata...\n Please try again!')
  };

  const getDefinitionOutput = async (
    inputCode: string,
    option_id: string,
    language?: string,
    framework?: string
  ) => {
    return await loadingWrapper(
      fetchDefinition,
      [inputCode, language, framework],
      option_id,
      "Failed to create definitions...\n Please try again!"
    );
  };

  const getRevisionOutput = async (
    inputCode: string,
    option_id: string,
    language?: string,
    caseType?: string
  ) => {
    return await loadingWrapper(
      fetchRevision,
      [inputCode, language, caseType],
      option_id,
      "Failed to create variable revisions...\n Please try again!"
    );
  };

  const getAnnotationOutput = async (
    inputCode: string,
    option_id: string,
    language?: string
  ) => {
    return await loadingWrapper(
      fetchAnnotation,
      [inputCode, language],
      option_id,
      "Failed to annotate code snippet...\n Please try again!"
    );
  };

  const getAnalysisOutput = async (
    inputCode: string,
    option_id: string,
    language?: string
  ) => {
    return await loadingWrapper(
      fetchAnalysis,
      [inputCode, language],
      option_id,
      "Failed to analyze code snippet...\n Please try again!"
    );
  };

  const performOperations = async ({
    command,
    language,
    response: { content, range },
    additional_context,
  }: any) => {
    let result: any;
    switch (command) {
      case 'generate_pdf':
        result = await getPDFMetadataOutput(content, language)
        if (result.status && result.content.status) {
          vscode.postMessage({
            command: 'download',
            text: JSON.stringify({ content: result.content.content })
          })
        } else {
          vscode.postMessage({
            command: 'error',
            text: !result.status ? result.error_msg : result.content.error_msg,
          })
        }
        break;

      case 'define':
        result = await getDefinitionOutput(content, command, language, additional_context);
        if (result.status && result.content.status) {
          vscode.postMessage({
            command: "update",
            text: JSON.stringify({ range, content: result.content.content }),
          });
        } else {
          vscode.postMessage({
            command: "error",
            text: !result.status ? result.error_msg : result.content.error_msg,
          });
        }
        break;

      case "analyze":
        result = await getAnalysisOutput(content, command, language);
        if (result.status && result.content.status) {
          Object.keys(result.content.complexity).forEach((functionName) => {
            const { space, runtime } = result.content.complexity[functionName];
            vscode.postMessage({
              command: "notify",
              text: `Complexity of fn \`${functionName}\`:\n\t RUNTIME: ${runtime}, SPACE: ${space}`,
            });
          });
        } else {
          vscode.postMessage({
            command: "error",
            text: !result.status ? result.error_msg : result.content.error_msg,
          });
        }
        break;

      case "revise":
        result = await getRevisionOutput(
          content,
          command,
          language,
          additional_context
        );
        if (result.status && result.content.status) {
          vscode.postMessage({
            command: "update",
            text: JSON.stringify({ range, content: result.content.content }),
          });
        } else {
          vscode.postMessage({
            command: "error",
            text: !result.status ? result.error_msg : result.content.error_msg,
          });
        }
        break;

      case "annotate":
        result = await getAnnotationOutput(content, command, language);
        if (result.status && result.content.status) {
          vscode.postMessage({
            command: "update",
            text: JSON.stringify({ range, content: result.content.content }),
          });
        } else {
          vscode.postMessage({
            command: "error",
            text: !result.status ? result.error_msg : result.content.error_msg,
          });
        }
        break;

      case "generate":
        vscode.postMessage({
          command: "notify",
          text: "This feature is COMING SOON 📕📕📕",
        });
        return true;

      default:
        return false;
    }
  };

  useEffect(() => {
    const handleMessageEvent = async (event: MessageEvent) => {
      if (!event.data) {
        vscode.postMessage({
          command: "error",
          text: "Oops... an error occured! Please try again.",
        });
        return true;
      }
      try {
        performOperations(JSON.parse(event.data));
      } catch (error) { }
    };

    window.addEventListener("message", handleMessageEvent);
    return () => window.removeEventListener("message", handleMessageEvent);
  }, []);

  return (
    <main
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
    >
      <br />
      <div style={{ display: "flex", borderRadius: "15px" }}>
        <Box sx={{ width: "100%" }}>
          <DocumentationAccordion {...{ loading }} />
        </Box>
      </div>

      <br />
      <Box
        sx={{
          flexDirection: "column",
          borderRadius: "15px",
          marginTop: "2px",
          width: "90%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            color: "#feefb7",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledTypography variant="h6" fontWeight="bold">
            External Documentation Generation
          </StyledTypography>

          <StyledTypography sx={{ textAlign: "justify" }}>
            We provide a means for you to create holistic text based documents
            that explain your files and modules. This is the quickest way to
            accurately summarize your commits in order for your managers to get
            up to speed with your contributions. You can generate your text
            documents in PDF or Markdown Format.
          </StyledTypography>
        </Box>

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
          <StyledLoadingButton
            {...{
              loading: loadingPDF,
              onClick: onGenerateDoc,
              variant: "outlined",
            }}
            fullWidth
          >
            Generate PDF
          </StyledLoadingButton>
        </Box>

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
          <StyledLoadingButton
            {...{
              loading: loadingMD,
              onClick: onGenerateDoc,
              variant: "outlined",
            }}
            fullWidth
          >
            Generate MD
          </StyledLoadingButton>
        </Box>
        <br />
        <br />
      </Box>
    </main>
  );
};

export default DocOptions;
