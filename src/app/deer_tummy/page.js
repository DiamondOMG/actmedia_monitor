"use client";
import { useEffect, useState } from "react";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function DeerTummyPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    window.DigitalSignageTriggerCallback = function (data) {
      setData(data);
    };
  }, []);
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
        Deer Tummy Page : {data}
      </Typography>
    </Box>
  );
}
