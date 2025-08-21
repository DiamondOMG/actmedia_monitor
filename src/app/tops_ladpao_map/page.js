"use client";

import React, { useState, useEffect } from "react";
import { Box, ThemeProvider, createTheme, Typography } from "@mui/material";
import axios from "axios";
import { keyframes } from "@emotion/react";

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
      macaddress: "06BC202514EE",
      number: "1",
      position_x: "62%",
      position_y: "46%", // 100% - 62%
    },
    {
      name: "screen",
      macaddress: "06BC2025152F",
      number: "2",
      position_x: "64.5%",
      position_y: "23%", // 100% - 56.2%
    },
    {
      name: "screen",
      macaddress: "2002AF3C13C4",
      number: "3",
      position_x: "76%",
      position_y: "23%", // 100% - 50%
    },
    {
      name: "screen",
      macaddress: "06BC202514D4",
      number: "4",
      position_x: "87%",
      position_y: "46%", // 100% - 66%
    },
    {
      name: "screen",
      macaddress: "6021C0CB28F8",
      number: "5",
      position_x: "87%",
      position_y: "71%", // 100% - 37%
    },
    {
      name: "screen",
      macaddress: "06BC2025120B",
      number: "6",
      position_x: "76%",
      position_y: "71%", // 100% - 35.5%
    },
  ]);

  const [counts, setCounts] = useState({
    online: 0,
    offline1Hour: 0,
    offline1Day: 0,
  });
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const blinkRed = keyframes`
    0% { box-shadow: 0 0 5px 2px rgba(255, 0, 0, 0.2); }
    50% { box-shadow: 0 0 15px 6px rgba(255, 0, 0, 0.9); }
    100% { box-shadow: 0 0 5px 2px rgba(255, 0, 0, 0.2); }
  `;

  const blinkOrange = keyframes`
    0% { box-shadow: 0 0 5px 2px rgba(255, 165, 0, 0.2); }
    50% { box-shadow: 0 0 15px 6px rgba(255, 165, 0, 0.9); }
    100% { box-shadow: 0 0 5px 2px rgba(255, 165, 0, 0.2); }
  `;

  useEffect(() => {
    const uniqueKey = "ladpao"; // ตั้ง key ไม่ให้ชนกันในแต่ละหน้า

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/tops_ladpao_map");
        const apiData = response.data;
        const fetchTime = new Date();

        const updatedItems = items.map((item) => {
          const apiItem = apiData.find(
            (apiItem) => apiItem.id === item.macaddress
          );
          return {
            ...item,
            status: apiItem ? apiItem.status : "No Macaddress",
          };
        });

        const onlineCount = updatedItems.filter(
          (item) => item.status === "Box-Online"
        ).length;
        const offline1HourCount = updatedItems.filter(
          (item) => item.status === "Box-Offline (1+ hour)"
        ).length;
        const offline1DayCount = updatedItems.filter(
          (item) => item.status === "Box-Offline (1+ day)"
        ).length;

        // set state
        setItems(updatedItems);
        setCounts({
          online: onlineCount,
          offline1Hour: offline1HourCount,
          offline1Day: offline1DayCount,
        });
        setLastFetchTime(fetchTime);

        // เก็บทุกอย่างรวมกันใน key เดียว
        localStorage.setItem(
          uniqueKey,
          JSON.stringify({
            items: updatedItems,
            counts: {
              online: onlineCount,
              offline1Hour: offline1HourCount,
              offline1Day: offline1DayCount,
            },
            lastFetchTime: fetchTime.toISOString(),
          })
        );
      } catch (error) {
        console.error("Error fetching API data:", error);

        // fallback: ดึงจาก localStorage
        const cached = localStorage.getItem(uniqueKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setItems(parsed.items || []);
            setCounts(
              parsed.counts || { online: 0, offline1Hour: 0, offline1Day: 0 }
            );
            setLastFetchTime(
              parsed.lastFetchTime ? new Date(parsed.lastFetchTime) : null
            );
          } catch (e) {
            console.error("Error parsing cached data:", e);
          }
        } else {
          // ถ้าไม่มี cache
          setItems((prev) =>
            prev.map((it) => ({ ...it, status: "Failed to fetch" }))
          );
          setCounts({ online: 0, offline1Hour: 0, offline1Day: 0 });
          setLastFetchTime(null);
        }
      }
    };

    fetchData();
    const fetchInterval = setInterval(fetchData, 10 * 60 * 1000);
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
          backgroundImage: "url('tops_ladpao.png')",
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
              animation:
                item.status === "Box-Offline (1+ day)"
                  ? `${blinkRed} 1s infinite`
                  : item.status === "Box-Offline (1+ hour)"
                  ? `${blinkOrange} 1s infinite`
                  : "none",
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
          <Typography fontSize={17} fontWeight="bold">
            Play Box
          </Typography>
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
            // เปลี่ยนทิศทางการจัดเรียงเป็นแนวตั้ง
            flexDirection: "column",
            // จัดให้อยู่ตรงกลางตามแนวตั้งและแนวนอน
            alignItems: "flex-start",
            position: "absolute",
            left: "1%",
            bottom: "80%",
            // ลบ gap ออก เพราะแต่ละอันจะขึ้นบรรทัดใหม่แล้ว
            // gap: "16px",
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
            Tops Ladpao
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
