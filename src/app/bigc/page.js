// /chart2/page.js
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
  Stack,
  CircularProgress,
} from "@mui/material";

// Custom theme - ปรับฟอนต์ให้เหมาะสมกับขนาดหน้าจอ
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2c2c2c" },
    secondary: { main: "#1e88e5" },
    background: { default: "#121212", paper: "#1e1e1e" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h2: { fontSize: "2.5rem", fontWeight: 400, lineHeight: 1 }, // ปรับขนาดตัวเลขหลัก
    h5: { fontSize: "1rem", fontWeight: 500 }, // ปรับขนาดตัวเลขใน status bar
    h6: { fontSize: "1.1rem", fontWeight: 400 }, // ขนาดหัวข้อหลัก
    body1: { fontSize: "0.85rem" },
    body2: { fontSize: "0.7rem", lineHeight: 1.2 }, // ขนาดข้อความย่อยมากๆเลย
  },
});

// Helper function to transform API data (unchanged)
const transformApiData = (apiData) => {
  if (!apiData || apiData.length === 0) return [];
  const sections = [
    {
      title: "TV signage",
      stores: apiData[0]["Store"] || 0,
      displays: apiData[0]["Displays"] || 0,
      displayStatus: {
        online: apiData[0]["Displays-Online"] || 0,
        offlineHour: apiData[0]["Displays-Offline (1+ hour)"] || 0,
        offlineDay: apiData[0]["Displays-Offline (1+ day)"] || 0,
      },
      tvBoxes: apiData[0]["TV"] || 0,
      tvBoxStatus: {
        online: apiData[0]["Online"] || 0,
        offlineHour: apiData[0]["Offline (1+ hour)"] || 0,
        offlineDay: apiData[0]["Offline (1+ day)"] || 0,
      },
    },
    {
      title: "Category signage",
      stores: apiData[2]["Store"] || 0,
      displays: apiData[2]["Displays"] || 0,
      displayStatus: {
        online: apiData[2]["Displays-Online"] || 0,
        offlineHour: apiData[2]["Displays-Offline (1+ hour)"] || 0,
        offlineDay: apiData[2]["Displays-Offline (1+ day)"] || 0,
      },
      tvBoxes: apiData[2]["Signage"] || 0,
      tvBoxStatus: {
        online: apiData[2]["Online"] || 0,
        offlineHour: apiData[2]["Offline (1+ hour)"] || 0,
        offlineDay: apiData[2]["Offline (1+ day)"] || 0,
      },
    },
    {
      title: "Kiosks",
      stores: apiData[1]["Store"] || 0,
      displays: apiData[1]["Displays"] || 0,
      displayStatus: {
        online: apiData[1]["Displays-Online"] || 0,
        offlineHour: apiData[1]["Displays-Offline (1+ hour)"] || 0,
        offlineDay: apiData[1]["Displays-Offline (1+ day)"] || 0,
      },
      tvBoxes: apiData[1]["Kiosk"] || 0,
      tvBoxStatus: {
        online: apiData[1]["Online"] || 0,
        offlineHour: apiData[1]["Offline (1+ hour)"] || 0,
        offlineDay: apiData[1]["Offline (1+ day)"] || 0,
      },
    },
    {
      title: "Big C - Total",
      stores: apiData[4]["Total Store"] || 0,
      displays: apiData[4]["Displays"] || 0,
      displayStatus: {
        online: apiData[4]["Displays-Online"] || 0,
        offlineHour: apiData[4]["Displays-Offline (1+ hour)"] || 0,
        offlineDay: apiData[4]["Displays-Offline (1+ day)"] || 0,
      },
      tvBoxes: apiData[4]["TV boxes"] || 0,
      tvBoxStatus: {
        online: apiData[4]["TV boxes-Online"] || 0,
        offlineHour: apiData[4]["TV boxes-Offline (1+ hour)"] || 0,
        offlineDay: apiData[4]["TV boxes-Offline (1+ day)"] || 0,
      },
    },
  ];
  return sections;
};

// Status Card Component - ปรับให้ใช้พื้นที่เต็มที่
const StatusCard = ({ label, value, statusData }) => {
  const { online, offlineHour, offlineDay } = statusData || {};
  return (
    <Box sx={{ mb: 1.2 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 0.5, fontSize: "0.8rem" }}
      >
        {label}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          bgcolor: "rgba(0,0,0,0.6)",
          p: 1.2,
          borderRadius: 1,
          textAlign: "center",
          minHeight: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h2" component="div">
          {value}
        </Typography>
      </Paper>
      {statusData && (
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
          <Box
            sx={{
              bgcolor: "#008080",
              flex: 1,
              p: 0.8,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: "3px",
              minHeight: "52px",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "white", fontSize: "0.7rem", lineHeight: 1.1 }}
            >
              Online
            </Typography>
            <Typography variant="h5" sx={{ color: "white", mt: 0.3 }}>
              {online}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "#FF6347",
              flex: 1,
              p: 0.8,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: "3px",
              minHeight: "52px",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "white", fontSize: "0.65rem", lineHeight: 1.1 }}
            >
              Offline
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", fontSize: "0.65rem", lineHeight: 1.1 }}
            >
              (1+ hr)
            </Typography>
            <Typography variant="h5" sx={{ color: "white", mt: 0.2 }}>
              {offlineHour || 0}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "#DC143C",
              flex: 1,
              p: 0.8,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: "3px",
              minHeight: "52px",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "white", fontSize: "0.65rem", lineHeight: 1.1 }}
            >
              Offline
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", fontSize: "0.65rem", lineHeight: 1.1 }}
            >
              (1+ day)
            </Typography>
            <Typography variant="h5" sx={{ color: "white", mt: 0.2 }}>
              {offlineDay || 0}
            </Typography>
          </Box>
        </Stack>
      )}
    </Box>
  );
};

// Section Component - ปรับให้แสดงผลเต็มพื้นที่
const StatusSection = ({ data }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 1.2,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontSize: "1.1rem",
          fontWeight: 400,
          mb: 1.2,
          textAlign: "center",
        }}
      >
        {data.title}
      </Typography>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <StatusCard label="Stores" value={data.stores} />
        <StatusCard
          label="Displays"
          value={data.displays}
          statusData={data.displayStatus}
        />
        <StatusCard
          label="TV boxes"
          value={data.tvBoxes}
          statusData={data.tvBoxStatus}
        />
      </Box>
    </Paper>
  );
};

// Main Dashboard Component
export default function NetworkStatus() {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/bigc");
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        const transformedData = transformApiData(data);
        setDashboardData(transformedData);
        const now = new Date();
        const formattedDate = now.toLocaleDateString("en-GB");
        const formattedTime = now.toLocaleTimeString("en-GB");
        setLastUpdated(`${formattedDate} ${formattedTime}`);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          width: "100%",
          height: "100vh",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.default",
            width: "961px",
            height: "541px",
            color: "text.primary",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <AppBar position="static" color="primary" elevation={0}>
            <Toolbar sx={{ minHeight: 32, px: 2, justifyContent: "center" }}>
              <Typography
                variant="h6"
                sx={{ fontSize: "1.1rem", fontWeight: 500 }}
              >
                Big C Thailand
              </Typography>
            </Toolbar>
          </AppBar>

          <Box
            sx={{
              flexGrow: 1,
              p: 1,
              overflow: "hidden",
              height: "calc(100% - 48px)",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "error.dark",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">
                  Error loading dashboard data
                </Typography>
                <Typography variant="body1">{error}</Typography>
              </Box>
            ) : (
              <Grid
                container
                spacing={1}
                sx={{
                  height: "100%",
                  width: "100%",

                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)", // แบ่งเป็น 4 ส่วนเท่าๆ กัน
                }}
              >
                {dashboardData.map((section, index) => (
                  <Grid
                    item
                    key={index}
                    sx={{
                      height: "100%",
                    }}
                  >
                    <StatusSection data={section} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
