"use client";

import React from "react";
import { Box, ThemeProvider, createTheme, Typography } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#000000" },
  },
});

export default function SimpleUI() {
  const items = [
    { name: "screen", macaddress: "000000000020", status: "online", position_x: "4%", position_y: "55%" },
    { name: "screen", macaddress: "000000000021", status: "online", position_x: "7.4%", position_y: "55%" },
    { name: "screen", macaddress: "000000000022", status: "online", position_x: "11%", position_y: "55%" },
    { name: "screen", macaddress: "000000000023", status: "online", position_x: "30%", position_y: "50%" },
    { name: "screen", macaddress: "000000000024", status: "online", position_x: "30%", position_y: "43%" },
    { name: "screen", macaddress: "000000000025", status: "online", position_x: "69%", position_y: "47%" },
    { name: "screen", macaddress: "000000000026", status: "online", position_x: "94%", position_y: "47%" },

    
    // Add more objects as needed
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          backgroundImage: "url('v22.png')",
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
              width: "30px", // เพิ่มขนาดวงกลมเพื่อให้มีที่ว่างสำหรับข้อความ
              height: "30px",
              borderRadius: "50%",
              backgroundColor: item.status === "online" ? "green" : "red",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "10px", // ขนาดตัวอักษรที่เหมาะสมกับวงกลม
                fontWeight: "bold",
                textAlign: "center",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // เพิ่มเงาเพื่อให้ตัวอักษรชัดเจน
              }}
            >
              {item.macaddress.slice(-4)} {/* ดึง 4 ตัวสุดท้ายของ macaddress */}
            </Typography>
          </Box>
        ))}
      </Box>
    </ThemeProvider>
  );
}