import { CSSProperties, ReactNode, useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import { StyledLoadingButton } from './common/Button';

import { vscode } from "../utilities/vscode";
import { styled } from '@mui/material/styles';
import { fetchExplanation } from "../api/services";

import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import { FormControl, SelectChangeEvent } from "@mui/material";
import { StyledLabel, StyledSelect } from "./common/Select";


const complexityMarks = [{
  value: 1,
  label: 'Brief',
}, {
  value: 2,
  label: '',
}, {
  value: 3,
  label: 'Functional',
}, {
  value: 4,
  label: '',
}, {
  value: 5,
  label: 'Elaborate',
}];

const explainSectionMetaData = {
  defaultOption: 'English',
  sectionTitle: 'Language',
  buttonTitle: 'Pick Language',
  options: ['Arabic', 'English', 'German', 'Hindi', 'Italian',
    'Japanese', 'Latin', 'Mandarin', 'Portuguese', 'Russian', 'Spanish', 'Urdu'],
}

// Define different styles for your component
const desktopStyles: CSSProperties = {
  display: 'flex',
  width: '92%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};

const mobileStyles: CSSProperties = {
  display: 'flex',
  width: '92%',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
};

const StyledSlider = styled(Slider)({
  '& .MuiSlider-rail': {
    backgroundColor: '#988941', border: '1px solid #988941',
  },
  '& .MuiSlider-track': {
    backgroundColor: '#feefb7', border: '1px solid #feefb7',
  },
  '& .MuiSlider-thumb': {
    '&:hover': {
      backgroundColor: '#feefb7',
      border: '1px solid #feefb7',
      boxShadow: '0 0 0 10px rgba(254, 239, 183, 0.25)',
    },

    backgroundColor: '#dccd95',
    border: '1px solid #dccd95',
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 15,
    fontWeight: 'bold',
    background: 'unset',
    padding: 0,
    width: 25,
    height: 25,
    color: '#3D3D3D',
    borderRadius: '50% 50% 50% 0',
    backgroundColor: 'rgb(254, 239, 183)',
    border: 'solid 1px #3D3D3D',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#dccd95',
    width: 2.5,
    height: 8,
    borderRadius: '.5px'
  },
  '& .MuiSlider-markLabel': {
    color: '#feefb7',
  },
})


const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#feefb7',
    fontWeight: 'bold',
    padding: '2px 10px 2px 5px',
    backgroundColor: 'rgb(30, 31, 28)',
  },

  '& .MuiInput-underline:after': {
    borderBottomColor: '#feefb7',
  },
  '& .MuiOutlinedInput-root': {
    color: '#feefb7',

    '& fieldset': {
      color: '#feefb7',
      borderColor: '#feefb7',
    },
    '&:hover fieldset': {
      color: '#feefb7',
      borderColor: '#feefb7',
    },
    '&.Mui-focused fieldset': {
      color: '#feefb7',
      borderColor: '#feefb7',
    },
  },
})

const ExplainLanguageSelection = ({ section, onChangeSelectedOption, sectionSelectedOption }: any) => {

  const [showOptionTitle, setShowOptionTitle] = useState(!sectionSelectedOption);

  const handleFocus = () => setShowOptionTitle(false);
  const handleBlur = () => {
    if (!sectionSelectedOption) { setShowOptionTitle(true) }
    else { setShowOptionTitle(false) }
  };

  const { defaultOption, options, sectionTitle, buttonTitle } = section;
  const handleOptionChange = (event: SelectChangeEvent<unknown>, _: ReactNode) => {
    const { target: { value } } = event;
    setShowOptionTitle(false);
    onChangeSelectedOption(value as string);
  };

  useEffect(() => {
    if (sectionSelectedOption || defaultOption) {
      setShowOptionTitle(false);
    }
  }, [])

  return (
    <Box sx={{
      display: 'flex', width: '100%',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <Box {...{
        sx: { display: 'flex', width: '92%' }
      }}>
        <FormControl sx={{ width: '100%' }}>
          <StyledLabel id="documentation-alternative-section-label"
            htmlFor="documentation-alternative-section-native-select">{
              showOptionTitle ? buttonTitle : sectionTitle
            }</StyledLabel>{
            <StyledSelect
              native fullWidth
              variant="outlined"
              onBlur={handleBlur}
              onFocus={handleFocus}
              onChange={handleOptionChange}
              id="documentation-alternative-section-native-select"
              value={sectionSelectedOption || defaultOption || ''}
              labelId="documentation-alternative-section-name-label">
              {(options as string[]).map((option) => (
                <option
                  key={option}
                  value={option}>
                  {option}
                </option>
              ))}
            </StyledSelect>
          }</FormControl>
      </Box>
    </Box>
  )
}


const CodeExplain = () => {
  const [text, setText] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [options, setOptions] = useState({ complexity: 2 });
  const [selectedOption, setSelectedOption] = useState('')
  const [responsiveDivStyles, setResponsiveDivStyles] = useState<CSSProperties>(
    window.innerWidth <= 500 ? mobileStyles : desktopStyles);


  const onChangeComplexity = (_: any, complexity: number | number[]) =>
    setOptions({ ...options, complexity: complexity as number });

  const onClick = () => {
    vscode.postMessage({
      command: 'explain', text: selectedOption
        ? JSON.stringify({ additional_context: selectedOption.toLowerCase() }) : '""'
    })
  }

  const loadingWrapper = async (fn: Function, args: any[], error_msg: string) => {
    try {
      setWaiting(true)
      const res = await fn(...args)
      setWaiting(false)
      return { status: true, content: res }
    } catch (error) {
      setWaiting(false)
      return { status: false, error_msg }
    }
  }

  const onChangeSelectedOption = (new_option: string) => {
    setSelectedOption(new_option)
  }

  const getExplanationOutput = async (inputCode: string, complexity: number, language?: string, responseLanguage?: string) => {
    return await loadingWrapper(fetchExplanation, [inputCode, complexity, language, responseLanguage],
      'Failed to generate an explanation...\n Please try again!')
  };


  // Add an event listener to update styles on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 500) { setResponsiveDivStyles(mobileStyles) }
      else { setResponsiveDivStyles(desktopStyles) }
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => { window.removeEventListener('resize', handleResize) };
  }, [desktopStyles, mobileStyles]);


  useEffect(() => {
    const handleMessageEvent = async (event: MessageEvent) => {
      if (!event.data) {
        vscode.postMessage({
          command: 'error',
          text: 'Oops... an error occured! Please try again.',
        })
        return true;
      }

      const { command, language, additional_context, response: { content, range: _ } } = JSON.parse(event.data);

      switch (command) {
        case 'explain':
          const result = await getExplanationOutput(content, options.complexity, language, additional_context)
          if (result.status && result.content.status) { setText(result.content.content) }
          else { vscode.postMessage({ command: 'notify', text: !result.status ? result.error_msg : result.content.error_msg }) }
          return true;

        default: return false
      }
    }

    window.addEventListener('message', handleMessageEvent)
    return () => window.removeEventListener('message', handleMessageEvent)
  }, [options.complexity])

  return (
    <main style={{
      display: 'flex', width: '100%',
      height: '100%', alignItems: 'center'
    }}>
      <h3 style={{ fontWeight: 'bold', color: '#feefb7' }}>
        Set Explanation Granularity:
      </h3>

      <div style={{
        width: '100%', display: 'flex', alignContent: 'center',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Box sx={{ width: '80%' }}>
          <StyledSlider {...{
            marks: complexityMarks,
            step: 1, min: 1, max: 5,
            valueLabelDisplay: 'auto',
            value: options.complexity,
            defaultValue: options.complexity,
            onChangeCommitted: onChangeComplexity,
            "aria-label": "Code Explanation Complexity",
          }} />
        </Box>
      </div>

      <br />
      <div style={responsiveDivStyles}>
        {<ExplainLanguageSelection {...{
          section: explainSectionMetaData,
          onChangeSelectedOption: onChangeSelectedOption,
          sectionSelectedOption: selectedOption,

        }} />}
        <br />
        <Box {...{
          sx: {
            display: 'flex', width: '100%',
            alignItems: 'center', justifyContent: 'center'
          }
        }}>
          <Box {...{
            sx: {
              display: 'flex', width: '92%',
              alignItems: 'center', justifyContent: 'center'
            }
          }}>
            <StyledLoadingButton {...{ onClick, variant: 'outlined', loading: waiting }} fullWidth>
              Explain
            </StyledLoadingButton>
          </Box>
        </Box>
      </div>


      <br />
      <VSCodeDivider />

      <br />
      <Box {...{
        component: 'form',
        autoComplete: 'off',
        sx: { width: '90%', color: '#feefb7' },
      }} noValidate >
        <StyledTextField {...{
          value: text,
          maxRows: 26,
          label: "Explanation Output",
          InputProps: { readOnly: true },
          id: "styled-explanation-text-area",
          placeholder: "\nHighlight code snippets from your editor to see the generated function explanations!\n",
          defaultValue: "\nHighlight code snippets from your editor to see the generated function explanations!\n",
        }} multiline fullWidth focused autoFocus />
      </Box>
    </main>
  );
};

export default CodeExplain;
