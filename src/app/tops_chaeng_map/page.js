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
      macaddress: "1C5974871FB1",
      number: "1",
      position_x: "8%",
      position_y: "26%",
    },
    {
      name: "screen",
      macaddress: "06BC20251349",
      number: "2",
      position_x: "7.7%",
      position_y: "42.5%",
    },
    {
      name: "screen",
      macaddress: "06BC20251426",
      number: "3",
      position_x: "7.7%",
      position_y: "39%",
    },
    {
      name: "screen",
      macaddress: "06BC2025144F",
      number: "4",
      position_x: "7.7%",
      position_y: "35.2%",
    },
    {
      name: "screen",
      macaddress: "06BC20251562",
      number: "5",
      position_x: "7.7%",
      position_y: "31.5%",
    },
    {
      name: "screen",
      macaddress: "06BC2025157A",
      number: "6",
      position_x: "72%",
      position_y: "45%",
    },
    {
      name: "screen",
      macaddress: "06BC202514DF",
      number: "7",
      position_x: "61.2%",
      position_y: "45%",
    },
    {
      name: "screen",
      macaddress: "06BC202515AE",
      number: "8",
      position_x: "63.1%",
      position_y: "45%",
    },
    {
      name: "screen",
      macaddress: "06BC2025148F",
      number: "9",
      position_x: "23.8%",
      position_y: "44.3%",
    },
    {
      name: "screen",
      macaddress: "06BC202512AC",
      number: "10",
      position_x: "45%",
      position_y: "75%",
    },
    {
      name: "screen",
      macaddress: "06BC20251338",
      number: "11",
      position_x: "64.5%",
      position_y: "74%",
    },
    {
      name: "screen",
      macaddress: "06BC202512DF",
      number: "12",
      position_x: "58.4%",
      position_y: "38%",
    },
    {
      name: "screen",
      macaddress: "06BC20251519",
      number: "13",
      position_x: "60.7%",
      position_y: "38%",
    },
    {
      name: "screen",
      macaddress: "06BC2025121D",
      number: "14",
      position_x: "65%",
      position_y: "38%",
    },
    {
      name: "screen",
      macaddress: "06BC20251573",
      number: "15",
      position_x: "67.5%",
      position_y: "38%",
    },
    {
      name: "screen",
      macaddress: "06BC202515AA",
      number: "16",
      position_x: "74%",
      position_y: "38%",
    },
    {
      name: "screen",
      macaddress: "06BC2025137F",
      number: "17",
      position_x: "79.5%",
      position_y: "32%",
    },
    {
      name: "screen",
      macaddress: "06BC20251447",
      number: "18",
      position_x: "81.2%",
      position_y: "32%",
    },
  ]);

  const [counts, setCounts] = useState({
    online: 0,
    offline1Hour: 0,
    offline1Day: 0,
  });
  const [lastFetchTime, setLastFetchTime] = useState(null);

  useEffect(() => {
    const uniqueKey = "chaeng"; // ตั้ง key ไม่ให้ชนกันในแต่ละหน้า

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/tops_chaeng_map");
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
          backgroundImage: "url('Chaengwattana4.png')",
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
              top: item.position_y,
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
              transform: "translate(-50%, -50%)",
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
        <Box>
          <Typography
            sx={{
              color: "#000000ff",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "center",
              position: "absolute",
              left: "4%",
              bottom: "14.7%",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {counts.online}
          </Typography>
          <Typography
            sx={{
              color: "#000000ff",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "center",
              position: "absolute",
              left: "4%",
              bottom: "9.5%",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {counts.offline1Hour}
          </Typography>
          <Typography
            sx={{
              color: "#000000ff",
              fontSize: "12px",
              fontWeight: "bold",
              textAlign: "center",
              position: "absolute",
              left: "4%",
              bottom: "4.5%",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {counts.offline1Day}
          </Typography>
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
            Tops Chaengwattana
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
