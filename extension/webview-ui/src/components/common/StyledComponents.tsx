import { styled } from "@mui/material/styles";
import {
  InputLabel,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.contrastText}`,
}));

export const StyledLabel = styled(InputLabel)(({ theme }) => ({
  color: `${theme.palette.primary.contrastText}`,
  fontWeight: "bold",
  borderRadius: "4px",
  padding: "2px 10px",
  // backgroundColor: "rgba(0,0,0,0)",
  backgroundColor: `${theme.palette.primary.light}`,



  "&.Mui-focused": {
    color: `${theme.palette.primary.contrastText}`,
    fontWeight: "bold",
  },
  "&.Mui-selected": {
    color: `${theme.palette.primary.contrastText}`,
    fontWeight: "bold",
  },
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  "&.MuiSvgIcon-root": {
    fill: `${theme.palette.primary.main}`,
  },
  "&.MuiOutlinedInput-root.Mui-focused": {
    border: `2px solid ${theme.palette.primary.main} !important`,
  },
  "&:active": {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  "& .MuiNativeSelect-iconOutlined": {
    fill: `${theme.palette.primary.main}`,
  },
  "&.MuiNativeSelect-select": {
    fontSize: 16,
    fill: `${theme.palette.primary.main}`,
    color: `${theme.palette.primary.main}`,
    borderColor: `${theme.palette.primary.main}`,

    "&:focus": {
      borderColor: `${theme.palette.primary.main}`,
    },

    "&:hover": {
      borderColor: `${theme.palette.primary.main}`,
    },
  },
  "&.MuiOutlinedInput-root": {
    fontSize: 16,
    fill: `${theme.palette.primary.main}`,
    color: `${theme.palette.primary.contrastText}`,
    borderColor: `${theme.palette.primary.main}`,
    border: `2px solid ${theme.palette.primary.main}`,

    "&:focus": {
      borderColor: `${theme.palette.primary.main}`,
    },

    "&:hover": {
      borderColor: `${theme.palette.primary.main}`,
    },
  },
}));

export const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
  fontSize: 16,
  color: `${theme.palette.primary.contrastText}`,
  display: "flex",
  width: "100%",
  height: "60px",
  fontWeight: "bold",
  borderRadius: "5px",
  alignItems: "center",
  justifyContent: "center",
  border: `2px solid ${theme.palette.primary.main}`,
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    color: `${theme.palette.primary.dark}`,
    fontWeight: "bold",
    borderColor: `${theme.palette.primary.main}`,
    backgroundColor: `${theme.palette.primary.main}`,
  },
  "& Mui-disabled": {
    borderColor: `${theme.palette.primary.main}`,
  },
  "& .MuiLoadingButton-root": {
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: "transparent",
  },
  "& .MuiLoadingButton-loading": {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  "& .MuiLoadingButton-loadingIndicator": {
    color: `${theme.palette.primary.main}`,
    fontWeight: "bold",
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& label.Mui-focused": {
    color: `${theme.palette.primary.main}`,
    fontWeight: "bold",
    padding: "2px 10px 2px 5px",
  },

  "& .MuiInput-underline:after": {
    borderBottomColor: `${theme.palette.primary.main}`,
  },
  "& .MuiOutlinedInput-root": {
    color: `${theme.palette.primary.contrastText}`,

    "& fieldset": {
      color: `${theme.palette.primary.contrastText}`,
      borderColor: `${theme.palette.primary.main}`,
    },
    "&:hover fieldset": {
      color: `${theme.palette.primary.contrastText}`,
      borderColor: `${theme.palette.primary.main}`,
    },
    "&.Mui-focused fieldset": {
      color: `${theme.palette.primary.contrastText}`,
      borderColor: `${theme.palette.primary.main}`,
    },
  },
}));

export const StyledSlider = styled(Slider)(({ theme }) => ({
  "& .MuiSlider-rail": {
    backgroundColor: `${theme.palette.primary.light}`,
    border: `1px solid ${theme.palette.primary.light}`,
  },
  "& .MuiSlider-track": {
    backgroundColor: `${theme.palette.primary.main}`,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  "& .MuiSlider-thumb": {
    "&:hover": {
      backgroundColor: `${theme.palette.primary.main}`,
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 15,
    fontWeight: "bold",
    background: "unset",
    padding: 0,
    width: 25,
    height: 25,
    color: "#3D3D3D",
    borderRadius: "50% 50% 50% 0",
    backgroundColor: `${theme.palette.primary.main}`,
    border: "solid 1px #3D3D3D",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
  "& .MuiSlider-mark": {
    width: 2.5,
    height: 8,
    borderRadius: ".5px",
  },
  "& .MuiSlider-markLabel": {
    color: `${theme.palette.primary.contrastText}`,
  },
}));
