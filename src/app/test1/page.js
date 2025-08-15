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
      macaddress: "06BC2025124A",
      position_x: "7.5%",
      position_y: "62%",
    },
    {
      name: "screen",
      macaddress: "06BC2025124F",
      position_x: "7%",
      position_y: "56.2%",
    },
    {
      name: "screen",
      macaddress: "06BC20251271",
      position_x: "6.6%",
      position_y: "50%",
    },
    {
      name: "screen",
      macaddress: "FC23CD43BF9F",
      position_x: "4.5%",
      position_y: "66%",
    },
    {
      name: "screen",
      macaddress: "06BC2025131A",
      position_x: "32%",
      position_y: "37%",
    },
    {
      name: "screen",
      macaddress: "06BC202512B1",
      position_x: "36%",
      position_y: "35.5%",
    },
    {
      name: "screen",
      macaddress: "06BC2025127B",
      position_x: "39%",
      position_y: "42%",
    },
    {
      name: "screen",
      macaddress: "06BC20251252",
      position_x: "43%",
      position_y: "42%",
    },
    {
      name: "screen",
      macaddress: "06BC20251234",
      position_x: "45.5%",
      position_y: "33%",
    },
    {
      name: "screen",
      macaddress: "06BC20251244",
      position_x: "49.5%",
      position_y: "32%",
    },
    {
      name: "screen",
      macaddress: "06BC202512E3",
      position_x: "50.5%",
      position_y: "25%",
    },
    {
      name: "screen",
      macaddress: "06BC202514FB",
      position_x: "54%",
      position_y: "62%",
    },
    {
      name: "screen",
      macaddress: "06BC20251333",
      position_x: "46%",
      position_y: "64%",
    },
    {
      name: "screen",
      macaddress: "06BC202513B3",
      position_x: "39.5%",
      position_y: "66%",
    },
    {
      name: "screen",
      macaddress: "06BC20251478",
      position_x: "32.5%",
      position_y: "67.5%",
    },
    {
      name: "screen",
      macaddress: "06BC202514A4",
      position_x: "56%",
      position_y: "79%",
    },
    {
      name: "screen",
      macaddress: "06BC2025150C",
      position_x: "61%",
      position_y: "79%",
    },
    {
      name: "screen",
      macaddress: "06BC20251465",
      position_x: "70%",
      position_y: "68%",
    },
    {
      name: "screen",
      macaddress: "06BC2025147F",
      position_x: "74%",
      position_y: "68%",
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
            status: apiItem ? apiItem.status : "No Macaddress", // Default status หากไม่พบ macaddress
          };
        });

        setItems(updatedItems);
      } catch (error) {
        console.error("Error fetching API data:", error);
        // หาก API ล้มเหลว ให้ตั้งค่า status เป็น offline
        setItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            status: "Failed to fetch",
          }))
        );
      }
    };

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
          backgroundImage: "url('top_full1.jpg')",
          backgroundPosition: "center",
          backgroundSize: "contain", // เปลี่ยนจาก "cover" เป็น "contain" เพื่อแสดงภาพทั้งหมด
          backgroundRepeat: "no-repeat", // ป้องกันการซ้ำของภาพ
          width: "961px", // ปรับให้เต็มความกว้างของ container
          height: "541px", // คงความสูงไว้ หรือปรับตามต้องการ
          position: "relative",
        }}
      >
        {/* {items.map((item, index) => (
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
        ))} */}
      </Box>
    </ThemeProvider>
  );
}
