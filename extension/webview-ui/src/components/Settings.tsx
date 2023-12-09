import { vscode } from "../utilities/vscode";
import { CSSProperties, ReactNode, useEffect, useState } from "react";

import {
  Box,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

//@ts-ignore
const Settings = ({ selectedTheme, onClickThemeSelection }) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ display: "flex", width: "92%" }}>
        <FormControl>
          <FormLabel>Set Theme</FormLabel>
          <RadioGroup
            value={selectedTheme}
            onChange={(e) => onClickThemeSelection(e.target.value)}
          >
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            <FormControlLabel value="light" control={<Radio />} label="Light" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Settings;
