"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function DeerTummyPage() {
  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: "16 / 9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
        p: { xs: 2, md: 4 },
        m: "auto",
        maxWidth: 900,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        Deer Tummy Page
      </Typography>
    </Box>
  );
}
