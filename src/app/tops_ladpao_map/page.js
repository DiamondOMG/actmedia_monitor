"use client";

import React, { useState, useEffect } from "react";
import { Box, ThemeProvider, createTheme, Typography } from "@mui/material";
import axios from "axios";
import { keyframes } from "@emotion/react";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzepwpESHIzuyG_5oKOFFsio9BmfN88Wa57EYHGy6RMEl3HYKZd8J8gO60Mu87NosdU5Q/exec";

const darkTheme = createTheme({
  palette: { mode: "dark", background: { default: "#000000" } },
  typography: { fontFamily: "'Roboto','Helvetica','Arial',sans-serif" },
});

export default function SimpleUI() {
  const [items, setItems] = useState([]); // จะถูกแทนด้วยข้อมูลจาก GAS เท่านั้น
  const [counts, setCounts] = useState({
    online: 0,
    offline1Hour: 0,
    offline1Day: 0,
  });
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const blinkRed = keyframes`
    0% { box-shadow: 0 0 5px 2px rgba(255,0,0,.2); }
    50% { box-shadow: 0 0 15px 6px rgba(255,0,0,.9); }
    100% { box-shadow: 0 0 5px 2px rgba(255,0,0,.2); }
  `;
  const blinkOrange = keyframes`
    0% { box-shadow: 0 0 5px 2px rgba(255,165,0,.2); }
    50% { box-shadow: 0 0 15px 6px rgba(255,165,0,.9); }
    100% { box-shadow: 0 0 5px 2px rgba(255,165,0,.2); }
  `;

  useEffect(() => {
    const uniqueKey = "ladpao";

    const fetchLayoutFirstThenStatus = async () => {
      try {
        // 1) ดึงแผนผังจาก GAS (อันนี้ต้องเสร็จก่อน)
        const { data: layout } = await axios.get(GAS_URL, {
          timeout: 30000,
          withCredentials: false,
        });
        const layoutItems = (Array.isArray(layout) ? layout : []).map((it) => ({
          name: it.name ?? "screen",
          macaddress: it.macaddress ?? "",
          number: String(it.number ?? ""),
          // GAS ให้ 0..1 -> แปลงเป็นเปอร์เซ็นต์ string สำหรับ CSS
          position_x:
            typeof it.position_x === "number"
              ? `${it.position_x * 100}%`
              : "0%",
          position_y:
            typeof it.position_y === "number"
              ? `${it.position_y * 100}%`
              : "0%",
          status: "Loading...",
        }));
        setItems(layoutItems); // ตั้งตำแหน่งก่อน

        // 2) แล้วค่อยดึงสถานะมาแมพทีหลัง
        const { data: statusList } = await axios.get("/api/tops_ladpao_map", {
          timeout: 15000,
        });
        const updatedItems = layoutItems.map((item) => {
          const found = Array.isArray(statusList)
            ? statusList.find((x) => x.id === item.macaddress)
            : null;
          return { ...item, status: found ? found.status : "No Macaddress" };
        });

        // นับสถานะ
        const online = updatedItems.filter(
          (x) => x.status === "Box-Online"
        ).length;
        const off1h = updatedItems.filter(
          (x) => x.status === "Box-Offline (1+ hour)"
        ).length;
        const off1d = updatedItems.filter(
          (x) => x.status === "Box-Offline (1+ day)"
        ).length;

        setItems(updatedItems);
        setCounts({ online, offline1Hour: off1h, offline1Day: off1d });
        const now = new Date();
        setLastFetchTime(now);

        // cache ทั้งก้อน
        localStorage.setItem(
          uniqueKey,
          JSON.stringify({
            items: updatedItems,
            counts: { online, offline1Hour: off1h, offline1Day: off1d },
            lastFetchTime: now.toISOString(),
          })
        );
      } catch (err) {
        console.error("Fetch error:", err);
        // fallback จาก cache
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
            console.error("Cache parse error:", e);
          }
        } else {
          // ไม่มี cache: แสดง placeholder
          setItems((prev) =>
            prev.map((it) => ({ ...it, status: "Failed to fetch" }))
          );
          setCounts({ online: 0, offline1Hour: 0, offline1Day: 0 });
          setLastFetchTime(null);
        }
      }
    };

    // เรียกทันที และตั้งให้รีเฟรชทุก 10 นาที (เรียกแบบลำดับเดิม)
    fetchLayoutFirstThenStatus();
    const id = setInterval(fetchLayoutFirstThenStatus, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (date) =>
    date
      ? date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A";

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
              left: item.position_x, // e.g. "62%"
              bottom: item.position_y, // e.g. "46%"
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

        {/* Legend + counters */}
        <Box
          sx={{
            width: 100,
            height: 150,
            fontSize: 12,
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
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "green",
                position: "absolute",
                marginLeft: "25px",
              }}
            />
          </Box>
          <Box sx={{ height: 20 }} />
          <Box
            sx={{ display: "flex", alignItems: "center", position: "relative" }}
          >
            <Typography>{counts.offline1Hour}</Typography>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "orange",
                position: "absolute",
                marginLeft: "25px",
              }}
            />
          </Box>
          <Box sx={{ height: 20 }} />
          <Box
            sx={{ display: "flex", alignItems: "center", position: "relative" }}
          >
            <Typography>{counts.offline1Day}</Typography>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "red",
                position: "absolute",
                marginLeft: "25px",
              }}
            />
          </Box>
          <Box sx={{ height: 20 }} />
        </Box>

        {/* Tail list */}
        <Box
          sx={{
            width: 320,
            height: 150,
            position: "absolute",
            left: "12%",
            bottom: "1%",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(7, 1fr)",
            gap: "4px",
            alignItems: "center",
            justifyItems: "start",
            fontSize: ".7rem",
          }}
        >
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                gridColumn: `${Math.floor(index / 7) + 1}`,
                gridRow: `${(index % 7) + 1}`,
              }}
            >
              <Typography sx={{ fontSize: "inherit" }}>
                {item.number}. {item.macaddress.slice(-4)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Title + last fetch */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            position: "absolute",
            left: "1%",
            bottom: "80%",
          }}
        >
          <Typography
            sx={{
              color: "#000000ff",
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Tops Ladpao
          </Typography>
          <Typography
            sx={{
              color: "#000000ff",
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Last Fetch: {formatTime(lastFetchTime)}
          </Typography>
          <Typography
            sx={{
              color: "#000000ff",
              fontSize: 12,
              fontWeight: "bold",
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
