import { SyntheticEvent, useEffect, useState } from "react";
import { vscode } from "./utilities/vscode";

// IMPORT COMPONENTS
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import DocOptions from "./components/DocumentationOptions";
import CodeExplanationOptions from "./components/CodeExplanationOptions";
import Settings from "./components/Settings";

import { styled, ThemeProvider, createTheme } from "@mui/material/styles";

// IMPORT STYLESHEET
import "./App.css";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

interface StyledTabProps {
  label: string;
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const themes = {
  light: {
    theme: createTheme({
      palette: {
        primary: {
          main: "#2196f3",
          dark: "#fff",
          contrastText: "#000",
        },
      },
    }),
    tabColors: { color: "#2196f3", unfocusColor: "#1769aa", backgroundColor: "#fff" },
  },
  dark: {
    theme: createTheme({
      palette: {
        primary: {
          main: "#66bb6a",
          dark: "#3D3D3D",
          contrastText: "#fff"
        },
      },
    }),
    tabColors: { color: "#66bb6a", unfocusColor: "#1b5e20", backgroundColor: "#000" },
  },
};

function DocOptionPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const App = () => {
  const [value, setValue] = useState(0);
  const [customTheme, setTheme] = useState<keyof typeof themes>("dark");
  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    vscode.postMessage({
      command: "notify",
      text: "ScribeAI has been successfully initialized!",
    });
  }, []);

  //@ts-ignore
  const onChangeTheme = (key: string) => setTheme(key)

  const StyledTabs = styled((props: StyledTabsProps) => (
    <Tabs
      {...props}
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
      centered
    />
  ))({
    "& .MuiTabs-indicator": {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    "& .MuiTabs-indicatorSpan": {
      maxWidth: 80,
      width: "100%",
      backgroundColor: themes[customTheme].tabColors.color,
    },
  });

  const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple wrapped {...props} />
  ))(({ theme }) => ({
    textTransform: "none",
    fontWeight: "bold",
    fontSize: theme.typography.pxToRem(16),
    marginRight: theme.spacing(1),
    color: themes[customTheme].tabColors.unfocusColor,
    "&.Mui-selected": {
      color: themes[customTheme].tabColors.color,
    },
  }));

  return (
    <ThemeProvider theme={themes[customTheme].theme}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          backgroundColor: themes[customTheme].tabColors.backgroundColor,
        }}
      >
        <Box>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="documentation option tabs"
          >
            <StyledTab label="Doc Options" {...a11yProps(0)} />
            <StyledTab label="Code Explan" {...a11yProps(1)} />
            <StyledTab label="Settings" {...a11yProps(2)} />
          </StyledTabs>
        </Box>
        <DocOptionPanel value={value} index={0}>
          <DocOptions />
        </DocOptionPanel>
        <DocOptionPanel value={value} index={1}>
          <CodeExplanationOptions />
        </DocOptionPanel>
        <DocOptionPanel value={value} index={2}>
          <Settings selectedTheme={customTheme} onClickThemeSelection={onChangeTheme} />
        </DocOptionPanel>
      </Box>
    </ThemeProvider>
  );
};

export default App;
