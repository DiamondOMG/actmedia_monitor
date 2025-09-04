"use client";

import React, { useState, useEffect } from "react";
import { Box, ThemeProvider, createTheme, Typography } from "@mui/material";
import axios from "axios";
import { keyframes } from "@emotion/react";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzepwpESHIzuyG_5oKOFFsio9BmfN88Wa57EYHGy6RMEl3HYKZd8J8gO60Mu87NosdU5Q/exec?sheet=Tops%20Chaeng";

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
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({
    online: 0,
    offline1Hour: 0,
    offline1Day: 0,
  });
  const [lastFetchTime, setLastFetchTime] = useState(null);
  // เพิ่มด้านบนของ component หลัก
  const [pos, setPos] = useState(null);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const yTop = ((e.clientY - rect.top) / rect.height) * 100;
    const clamp = (v) => Math.max(0, Math.min(100, v));
    setPos({
      x: clamp(x).toFixed(2),
      yTop: clamp(yTop).toFixed(2),
      yBottom: (100 - clamp(yTop)).toFixed(2),
    });
  };

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
    const uniqueKey = "chaeng";

    const fetchData = async () => {
      try {
        // 1) Fetch layout from GAS first
        const { data: layout } = await axios.get(GAS_URL, {
          timeout: 30000,
          withCredentials: false,
        });
        const layoutItems = (Array.isArray(layout) ? layout : []).map((it) => ({
          name: it.name ?? "screen",
          macaddress: it.macaddress ?? "",
          number: String(it.number ?? ""),
          position_x:
            typeof it.position_x === "number"
              ? `${it.position_x * 100}%`
              : "0%",
          position_y:
            typeof it.position_y === "number"
              ? `${it.position_y * 100}%`
              : "0%",
          status: "No Macaddress",
        }));
        setItems(layoutItems);

        // 2) Fetch status and map to items
        const response = await axios.get("/api/tops_chaeng_map");
        const apiData = response.data;
        const fetchTime = new Date();

        const updatedItems = layoutItems.map((item) => {
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

        // Cache the data
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

        // fallback: retrieve from localStorage
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
          // If no cache
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

  // Format time to 12-hour format
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
        onMouseMove={onMove}
        onMouseLeave={() => setPos(null)}
        sx={{
          backgroundImage: "url('Chaengwattana6.png')",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          width: "961px",
          height: "541px",
          position: "relative",
        }}
      >
        {pos && (
          <Box
            sx={{
              position: "absolute",
              left: 8,
              top: 8,
              px: 1,
              py: 0.5,
              bgcolor: "rgba(0,0,0,0.6)",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#fff", fontFamily: "monospace" }}
            >
              x: {pos.x}% | y(bottom): {pos.yBottom}%
            </Typography>
          </Box>
        )}
        {items.map((item, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              left: item.position_x,
              bottom: item.position_y,
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
              transform: "translate(-50%, 50%)",
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
            sx={{ display: "flex", alignItems: "center", position: "relative" }}
          >
            <Typography>{counts.online}</Typography>
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "green",
                position: "absolute",
                marginLeft: "25px",
              }}
            />
          </Box>
          <Box sx={{ height: "20px" }} />
          <Box
            sx={{ display: "flex", alignItems: "center", position: "relative" }}
          >
            <Typography>{counts.offline1Hour}</Typography>
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "orange",
                position: "absolute",
                marginLeft: "25px",
              }}
            />
          </Box>
          <Box sx={{ height: "20px" }} />
          <Box
            sx={{ display: "flex", alignItems: "center", position: "relative" }}
          >
            <Typography>{counts.offline1Day}</Typography>
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "red",
                position: "absolute",
                marginLeft: "25px",
              }}
            />
          </Box>
          <Box sx={{ height: "20px" }} />
        </Box>
        <Box
          sx={{
            width: "320px",
            height: "100px",
            position: "absolute",
            left: "12%",
            bottom: "1%",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(7, 1fr)",
            gap: "4px",
            alignItems: "center",
            justifyItems: "start",
            fontSize: "0.7rem",
          }}
        >
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                gridColumn: `${Math.floor(index / 5) + 1}`,
                gridRow: `${(index % 5) + 1}`,
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
