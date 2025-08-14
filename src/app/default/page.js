"use client";

import React from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#000000" },
  },
});

export default function SimpleUI() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          width: "961px",
          height: "541px",
        }}
      >
        {/* ใส่เนื้อหา UI ของคุณตรงนี้ */}
      </Box>
    </ThemeProvider>
  );
}
