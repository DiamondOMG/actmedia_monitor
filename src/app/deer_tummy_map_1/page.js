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
  const items = [
    { name: "screen",macaddress:"1", status: "online", position_x: "7.5%", position_y: "62%" },
    { name: "screen",macaddress:"2", status: "online", position_x: "7%", position_y: "56.2%" },
    { name: "screen",macaddress:"3", status: "online", position_x: "6.6%", position_y: "50%" },
    { name: "screen",macaddress:"3", status: "online", position_x: "6.6%", position_y: "50%" },
    // Add more objects as needed
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          backgroundImage: "url('v11.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",

          width: "961px",
          height: "541px",
          position: "relative",
        }}
      >
        {items.map((item, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              left: item.position_x,
              top: item.position_y,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: item.status === "online" ? "green" : "red",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </Box>
    </ThemeProvider>
  );
}
