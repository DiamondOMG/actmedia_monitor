"use client";

import React, { useState, useEffect } from "react";
import { Box, ThemeProvider, createTheme, Typography } from "@mui/material";
import axios from "axios";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#000000" },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

export default function SimpleUI() {
  const [items, setItems] = useState([
    {
      name: "screen",
      macaddress: "06BC2025124A",
      number: "1",
      position_x: "3.5%",
      position_y: "45%", // 100% - 62%
    },
    {
      name: "screen",
      macaddress: "06BC2025124F",
      number: "2",
      position_x: "3.4%",
      position_y: "48%", // 100% - 56.2%
    },
    {
      name: "screen",
      macaddress: "06BC20251271",
      number: "3",
      position_x: "3.1%",
      position_y: "51%", // 100% - 50%
    },
    {
      name: "screen",
      macaddress: "FC23CD43BF9F",
      number: "4",
      position_x: "1.2%",
      position_y: "44%", // 100% - 66%
    },
    {
      name: "screen",
      macaddress: "06BC2025131A",
      number: "5",
      position_x: "12.1%",
      position_y: "53.2%", // 100% - 37%
    },
    {
      name: "screen",
      macaddress: "06BC202512B1",
      number: "6",
      position_x: "14.0%",
      position_y: "53.6%", // 100% - 35.5%
    },
    {
      name: "screen",
      macaddress: "06BC2025127B",
      number: "7",
      position_x: "16.8%",
      position_y: "54.5%", // 100% - 42%
    },
    {
      name: "screen",
      macaddress: "06BC20251252",
      number: "8",
      position_x: "18.5%",
      position_y: "55%", // 100% - 42%
    },
    {
      name: "screen",
      macaddress: "06BC20251234",
      number: "9",
      position_x: "21.5%",
      position_y: "56%", // 100% - 33%
    },
    {
      name: "screen",
      macaddress: "06BC20251244",
      number: "10",
      position_x: "23.2%",
      position_y: "56.6%", // 100% - 32%
    },
    {
      name: "screen",
      macaddress: "06BC202512E3",
      number: "11",
      position_x: "19.7%",
      position_y: "59.4%", // 100% - 25%
    },
    {
      name: "screen",
      macaddress: "06BC202514FB",
      number: "12",
      position_x: "21.2%",
      position_y: "45.5%", // 100% - 62%
    },
    {
      name: "screen",
      macaddress: "06BC20251333",
      number: "13",
      position_x: "18.4%",
      position_y: "45%", // 100% - 64%
    },
    {
      name: "screen",
      macaddress: "06BC202513B3",
      number: "14",
      position_x: "15.8%",
      position_y: "44.4%", // 100% - 66%
    },
    {
      name: "screen",
      macaddress: "06BC20251478",
      number: "15",
      position_x: "13.2%",
      position_y: "43.5%", // 100% - 67.5%
    },
    {
      name: "screen",
      macaddress: "06BC202514A4",
      number: "16",
      position_x: "22.5%",
      position_y: "40.5%", // 100% - 79%
    },
    {
      name: "screen",
      macaddress: "06BC2025150C",
      number: "17",
      position_x: "24.2%",
      position_y: "40.5%", // 100% - 79%
    },
    {
      name: "screen",
      macaddress: "06BC20251465",
      number: "18",
      position_x: "27.4%",
      position_y: "41.2%", // 100% - 68%
    },
    {
      name: "screen",
      macaddress: "06BC2025147F",
      number: "19",
      position_x: "29.1%",
      position_y: "41.2%", // 100% - 68%
    },
    {
      name: "screen",
      macaddress: "06BC202512E0",
      number: "20",
      position_x: "43%",
      position_y: "42%", // 100% - 55%
    },
    {
      name: "screen",
      macaddress: "06BC20251283",
      number: "21",
      position_x: "44.7%",
      position_y: "42%", // 100% - 55%
    },
    {
      name: "screen",
      macaddress: "06BC20251273",
      number: "22",
      position_x: "46.5%",
      position_y: "42%", // 100% - 55%
    },
    {
      name: "screen",
      macaddress: "06BC202514B4",
      number: "23",
      position_x: "51.7%",
      position_y: "43.7%", // 100% - 50%
    },
    {
      name: "screen",
      macaddress: "06BC202514E5",
      number: "24",
      position_x: "51.7%",
      position_y: "47%", // 100% - 43%
    },
    {
      name: "screen",
      macaddress: "BCFD0CA12D64",
      number: "25",
      position_x: "66%",
      position_y: "45.2%", // 100% - 47%
    },
    {
      name: "screen",
      macaddress: "BCFD0CF7DA90",
      number: "26",
      position_x: "75.2%",
      position_y: "45.2%", // 100% - 47%
    },
  ]);

  const [counts, setCounts] = useState({
    online: 0,
    offline1Hour: 0,
    offline1Day: 0,
  });
  const [lastFetchTime, setLastFetchTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/deer_tummy_map");
        const apiData = response.data;
        const fetchTime = new Date(); // ใช้เวลาที่ดึงข้อมูล

        // Map status จาก API ไปยัง items และนับจำนวนสถานะ
        const updatedItems = items.map((item) => {
          const apiItem = apiData.find(
            (apiItem) => apiItem.id === item.macaddress
          );
          return {
            ...item,
            status: apiItem ? apiItem.status : "No Macaddress",
          };
        });

        // นับจำนวนตามสถานะ
        const onlineCount = updatedItems.filter(
          (item) => item.status === "Box-Online"
        ).length;
        const offline1HourCount = updatedItems.filter(
          (item) => item.status === "Box-Offline (1+ hour)"
        ).length;
        const offline1DayCount = updatedItems.filter(
          (item) => item.status === "Box-Offline (1+ day)"
        ).length;

        setItems(updatedItems);
        setCounts({
          online: onlineCount,
          offline1Hour: offline1HourCount,
          offline1Day: offline1DayCount,
        });
        setLastFetchTime(fetchTime); // บันทึกเวลาที่ดึงข้อมูล
      } catch (error) {
        console.error("Error fetching API data:", error);
        setItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            status: "Failed to fetch",
          }))
        );
        setCounts({
          online: 0,
          offline1Hour: 0,
          offline1Day: 0,
        });
        setLastFetchTime(null);
      }
    };

    fetchData();

    // ตั้ง interval สำหรับ fetchData ทุก 10 นาที
    const fetchInterval = setInterval(fetchData, 10 * 60 * 1000);

    // Cleanup interval เมื่อ component unmount
    return () => clearInterval(fetchInterval);
  }, []);

  // แปลงเวลาเป็นรูปแบบ 12 ชั่วโมง
  const formatTime = (date) => {
    if (!date) return "N/A";
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          backgroundImage: "url('Deer_Tummy.png')",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
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
              bottom: item.position_y, // เปลี่ยนจาก top เป็น bottom
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor:
                item.status === "Box-Online"
                  ? "green"
                  : item.status === "Box-Offline (1+ hour)"
                  ? "orange"
                  : item.status === "Box-Offline (1+ day)"
                  ? "red"
                  : "blue",
              transform: "translate(-50%, 50%)", // ปรับ transform ให้จุดอยู่กึ่งกลาง
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "8px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {item.number}
            </Typography>
          </Box>
        ))}
        <Box
          sx={{
            width: "100px",
            height: "150px",
            fontSize: "12px",
            fontWeight: "bold",
            textAlign: "center",
            position: "absolute",
            left: "1%",
            bottom: "1%",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          <Typography fontSize={17} fontWeight="bold">Play Box</Typography>
          <Box
            sx={{
              position: "relative", // ทำให้เป็นกรอบอ้างอิง
              display: "flex", // ใช้ Flexbox
              alignItems: "center", // จัดให้อยู่กึ่งกลางแนวตั้ง
            }}
          >
            <Typography>{counts.online}</Typography>
            <Box
              sx={{
                // ไม่ต้องใช้ position: "absolute" แล้ว
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "green",
                position: "absolute",
                marginLeft: "25px", // เพิ่มระยะห่างจากเลข 5
              }}
            />
          </Box>
          <Typography fontSize={12}> ( Online )</Typography>
          <Box
            sx={{
              position: "relative", // ทำให้เป็นกรอบอ้างอิง
              display: "flex", // ใช้ Flexbox
              alignItems: "center", // จัดให้อยู่กึ่งกลางแนวตั้ง
            }}
          >
            <Typography>{counts.offline1Hour}</Typography>
            <Box
              sx={{
                // ไม่ต้องใช้ position: "absolute" แล้ว
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "orange",
                position: "absolute",
                marginLeft: "25px", // เพิ่มระยะห่างจากเลข 5
              }}
            />
          </Box>
          <Typography fontSize={12}>( Offline 1 h + )</Typography>
          <Box
            sx={{
              position: "relative", // ทำให้เป็นกรอบอ้างอิง
              display: "flex", // ใช้ Flexbox
              alignItems: "center", // จัดให้อยู่กึ่งกลางแนวตั้ง
            }}
          >
            <Typography>{counts.offline1Day}</Typography>
            <Box
              sx={{
                // ไม่ต้องใช้ position: "absolute" แล้ว
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "red",
                position: "absolute",
                marginLeft: "25px", // เพิ่มระยะห่างจากเลข 5
              }}
            />
          </Box>
          <Typography fontSize={12}>( Offline 1 d + )</Typography>
        </Box>
        <Box
          sx={{
            width: "320px",
            height: "150px",
            position: "absolute",
            left: "12%",
            bottom: "1%",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", // 4 columns
            gridTemplateRows: "repeat(7, 1fr)", // 7 rows
            gap: "4px", // Small gap between items
            alignItems: "center",
            justifyItems: "start",
            fontSize: "0.7rem", // Reduced font size
          }}
        >
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                gridColumn: `${Math.floor(index / 7) + 1}`, // Move to next column every 7 items
                gridRow: `${(index % 7) + 1}`, // Place in row 1-7
              }}
            >
              <Typography sx={{ fontSize: "inherit" }}>
                {item.number} = {item.macaddress.slice(-4)}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
            left: "30%",
            bottom: "90%",
            gap: "16px",
          }}
        >
          <Typography
            sx={{
              color: "#000000ff",
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Deer Tummy
          </Typography>
          <Typography
            sx={{
              color: "#000000ff",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Last Fetch: {formatTime(lastFetchTime)}
          </Typography>
          <Typography
            sx={{
              color: "#000000ff",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Refresh every 10 min
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
