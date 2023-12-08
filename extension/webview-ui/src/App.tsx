import { SyntheticEvent, useEffect, useState } from "react";
import { vscode } from "./utilities/vscode";

// IMPORT COMPONENTS
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import DocOptions from "./components/DocumentationOptions";
import CodeExplanationOptions from "./components/CodeExplanationOptions";

import { green, purple } from '@mui/material/colors';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';

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

const Dark = createTheme({
  palette: {
    primary: {
      main: green[900]
    },
    secondary: {
      main: green[400]
    }
  }
})

const Puss = createTheme({
  palette: {
    primary: {
      main: purple[900]
    },
    secondary: {
      main: purple[400]
    }
  }
})

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    centered
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 80,
    width: '100%',
    backgroundColor: '#feefb7',
  },
});

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple wrapped {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: theme.typography.pxToRem(16),
  marginRight: theme.spacing(1),
  color: 'rgba(152, 137, 65, 0.6)',
  '&.Mui-selected': {
    color: '#feefb7',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

function DocOptionPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (<div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 1 }}>
        <Typography>
          {children}
        </Typography>
      </Box>
    )}
  </div>);
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const App = () => {
  const [value, setValue] = useState(0);
  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    vscode.postMessage({
      command: "notify",
      text: "ScribeAI has been successfully initialized!",
    });
  }, []);

  return (
    <ThemeProvider theme={Puss}>
      <Box sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}>
        <Box>
          <StyledTabs value={value} onChange={handleChange} aria-label="documentation option tabs">
            <StyledTab label="Editor Documentation Options" {...a11yProps(0)} />
            <StyledTab label="Code Explanations" {...a11yProps(1)} />
          </StyledTabs>
        </Box>
        <DocOptionPanel value={value} index={0}>
          <DocOptions />
        </DocOptionPanel>
        <DocOptionPanel value={value} index={1}>
          <CodeExplanationOptions />
        </DocOptionPanel>
      </Box>
    </ThemeProvider>
  );
}

export default App;
