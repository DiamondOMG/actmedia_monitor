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
    { name: "screen", macaddress: "000000000001", status: "online", position_x: "7.5%", position_y: "62%" },
    { name: "screen", macaddress: "000000000002", status: "online", position_x: "7%", position_y: "56.2%" },
    { name: "screen", macaddress: "000000000003", status: "online", position_x: "6.6%", position_y: "50%" },
    { name: "screen", macaddress: "000000000004", status: "online", position_x: "4.5%", position_y: "66%" },
    { name: "screen", macaddress: "000000000005", status: "online", position_x: "32%", position_y: "37%" },
    { name: "screen", macaddress: "000000000006", status: "online", position_x: "36%", position_y: "35.5%" },
    { name: "screen", macaddress: "000000000007", status: "online", position_x: "39%", position_y: "42%" },
    { name: "screen", macaddress: "000000000008", status: "online", position_x: "43%", position_y: "42%" },
    { name: "screen", macaddress: "000000000009", status: "online", position_x: "45.5%", position_y: "33%" },
    { name: "screen", macaddress: "000000000010", status: "online", position_x: "49.5%", position_y: "32%" },
    { name: "screen", macaddress: "000000000011", status: "online", position_x: "50.5%", position_y: "25%" },
    { name: "screen", macaddress: "000000000012", status: "online", position_x: "54%", position_y: "62%" },
    { name: "screen", macaddress: "000000000013", status: "online", position_x: "46%", position_y: "64%" },
    { name: "screen", macaddress: "000000000014", status: "online", position_x: "39.5%", position_y: "66%" },
    { name: "screen", macaddress: "000000000015", status: "online", position_x: "32.5%", position_y: "67.5%" },
    { name: "screen", macaddress: "000000000016", status: "online", position_x: "56%", position_y: "79%" },
    { name: "screen", macaddress: "000000000017", status: "online", position_x: "61%", position_y: "79%" },
    { name: "screen", macaddress: "000000000018", status: "online", position_x: "70%", position_y: "68%" },
    { name: "screen", macaddress: "000000000018", status: "online", position_x: "74%", position_y: "68%" },
    
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