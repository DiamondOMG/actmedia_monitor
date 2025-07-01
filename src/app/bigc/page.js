"use client";
import React from "react";
import {Typography, Box }from "@mui/material";

export default function DeerTummyPage() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        Big C Page  
      </Typography>
    </Box>
  );
}
