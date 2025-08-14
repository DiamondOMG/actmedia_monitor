"use client";

import React, { useState, useEffect } from "react";
import { Box, ThemeProvider, createTheme, Typography } from "@mui/material";
import axios from "axios";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#000000" },
  },
});

export default function SimpleUI() {
  const [items, setItems] = useState([
    {
      name: "screen",
      macaddress: "06BC202512E0",
      position_x: "4%",
      position_y: "55%",
    },
    {
      name: "screen",
      macaddress: "06BC20251283",
      position_x: "7.4%",
      position_y: "55%",
    },
    {
      name: "screen",
      macaddress: "06BC20251273",
      position_x: "11%",
      position_y: "55%",
    },
    {
      name: "screen",
      macaddress: "06BC202514B4",
      position_x: "30%",
      position_y: "50%",
    },
    {
      name: "screen",
      macaddress: "06BC202514E5",
      position_x: "30%",
      position_y: "43%",
    },
    {
      name: "screen",
      macaddress: "BCFD0CA12D64",
      position_x: "69%",
      position_y: "47%",
    },
    {
      name: "screen",
      macaddress: "BCFD0CF7DA90",
      position_x: "94%",
      position_y: "47%",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/deer_tummy_map");
        const apiData = response.data;

        // Map status จาก API ไปยัง items โดยจับคู่ macaddress กับ id
        const updatedItems = items.map((item) => {
          const apiItem = apiData.find(
            (apiItem) => apiItem.id === item.macaddress
          );
          return {
            ...item,
            status: apiItem ? apiItem.status : "Box-Offline (1+ day)", // Default status หากไม่พบ macaddress
          };
        });

        setItems(updatedItems);
      } catch (error) {
        console.error("Error fetching API data:", error);
        // หาก API ล้มเหลว ให้ตั้งค่า status เป็น offline
        setItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            status: "Box-Offline (1+ day)",
          }))
        );
      }
    };

    // เรียก fetchData ครั้งแรกทันที
    fetchData();

    // ตั้ง interval เพื่อเรียก fetchData ทุก 10 นาที (600,000 ms)
    const intervalId = setInterval(fetchData, 10 * 60 * 1000);

    // Cleanup interval เมื่อ component unmount
    return () => clearInterval(intervalId);
  }, []);

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
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor:
                item.status === "Box-Online"
                  ? "green"
                  : item.status === "Box-Offline (1+ hour)"
                  ? "orange"
                  : item.status === "Box-Offline (1+ day)"
                  ? "red"
                  : "blue",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "10px",
                fontWeight: "bold",
                textAlign: "center",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
              }}
            >
              {item.macaddress.slice(-4)}
            </Typography>
          </Box>
        ))}
      </Box>
    </ThemeProvider>
  );
}
