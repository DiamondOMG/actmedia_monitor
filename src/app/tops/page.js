// /chart2/page.js
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  ThemeProvider,
  createTheme,
  Stack,
  CircularProgress,
} from "@mui/material";

// Custom theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2c2c2c" },
    secondary: { main: "#1e88e5" },
    background: { default: "#121212", paper: "#1e1e1e" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    // ปรับขนาดตัวอักษรให้เล็กลงสำหรับจอ 962x541
    h2: { fontSize: "2rem" }, // ลดจาก default
    h5: { fontSize: "1.2rem" },
    body2: { fontSize: "0.75rem" },
  },
});

// Transform API data function (ไม่เปลี่ยนแปลง)
const transformApiData = (apiData) => {
  if (!apiData || apiData.length === 0) return [];
  const sections = [
    {
      title: "Kiosks",
      stores: apiData[0]["Store"] || 0,
      displays: apiData[0]["Displays"] || 0,
      displayStatus: {
        online: apiData[0]["Displays-Online"] || 0,
        offlineHour: apiData[0]["Displays-Offline (1+ hour)"] || 0,
        offlineDay: apiData[0]["Displays-Offline (1+ day)"] || 0,
      },
      tvBoxes: apiData[0]["Kiosk"] || 0,
      tvBoxStatus: {
        online: apiData[0]["Online"] || 0,
        offlineHour: apiData[0]["Offline (1+ hour)"] || 0,
        offlineDay: apiData[0]["Offline (1+ day)"] || 0,
      },
    },
  ];
  return sections;
};

// StatusCard Component (ปรับขนาดและระยะห่าง)
const StatusCard = ({ label, value, statusData }) => {
  const { online, offlineHour, offlineDay } = statusData || {};
  return (
    <Box sx={{ mb: 1 }}>
      {" "}
      {/* ลด margin-bottom */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          bgcolor: "rgba(0,0,0,0.4)",
          p: 1, // ลด padding
          borderRadius: 1,
          textAlign: "center",
        }}
      >
        <Typography variant="h2" component="div" sx={{ fontWeight: "light" }}>
          {value}
        </Typography>
      </Paper>
      {statusData && (
        <Stack direction="row" spacing={0} sx={{ mt: 0.5 }}>
          <Box
            sx={{
              bgcolor: "#008080",
              flex: 1,
              p: 0.5, // ลด padding
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "white" }}>
              Online
            </Typography>
            <Typography variant="h5" sx={{ color: "white" }}>
              {online}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "#FF6347",
              flex: 1,
              p: 0.5,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "white" }}>
              Offline
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              (1+ hr)
            </Typography>
            <Typography variant="h5" sx={{ color: "white" }}>
              {offlineHour || 0}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: "#DC143C",
              flex: 1,
              p: 0.5,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "white" }}>
              Offline (1+ day)
            </Typography>

            <Typography variant="h5" sx={{ color: "white" }}>
              {offlineDay || 0}
            </Typography>
          </Box>
        </Stack>
      )}
    </Box>
  );
};

// StatusSection Component (ปรับระยะห่าง)
const StatusSection = ({ data }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 1.5, // ลด padding
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.05)",
        height: "100%",
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {data.title}
      </Typography>
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
        const response = await fetch(`/api/tops`);
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
            width: 962, // กำหนดความกว้างตายตัว
            height: 541, // กำหนดความสูงตายตัว
            color: "text.primary",
            overflow: "hidden", // ป้องกันการเลื่อน
          }}
        >
          <AppBar position="static" color="primary" elevation={0}>
            <Toolbar sx={{ minHeight: 32, px: 2, justifyContent: "center" }}>
              <Typography
                variant="h6"
                sx={{ fontSize: "1.1rem", fontWeight: 500 }}
              >
                Tops Thailand
              </Typography>
            </Toolbar>
          </AppBar>

          <Container
            disableGutters // ลบ gutter เพื่อใช้พื้นที่เต็ม
            sx={{ width: 962, height: 493, mt: 1, mb: 1 }} // ปรับความสูงให้เต็มหลังหัก AppBar
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
              <Grid container spacing={1} justifyContent="center">
                {dashboardData.map((section, index) => (
                  <Grid item lg={3} key={index}>
                    <StatusSection data={section} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
