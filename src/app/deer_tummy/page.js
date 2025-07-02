"use client";
import React from "react";
import { Typography, Box, Card } from "@mui/material";
import { exampleData } from "@/lib/makeData";

// Box ย่อยสำหรับแสดงตัวเลข (Online, Offline)
const SmallStatBox = ({ value, color }) => (
  <Box
    sx={{
      bgcolor: color,
      borderRadius: 1,
      width: "100%",
      textAlign: "center",
      color: "#fff",
      py: 0.5, // Reduced height
      fontWeight: "bold",
    }}
  >
    <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
      {value}
    </Typography>{" "}
    {/* Reduced font size */}
  </Box>
);

// Section: Displays / TV boxes
const Section = ({ label, value, online, offline1h, offline1d }) => (
  <Box mb={1}>
    <Typography
      variant="subtitle2"
      fontWeight="bold"
      color="#fff"
      sx={{ fontSize: "0.8rem" }}
    >
      {label}
    </Typography>
    <Box
      sx={{
        bgcolor: "#1f1f1f",
        borderRadius: 1,
        my: 0.5,
        textAlign: "center",
        py: 0.5,
      }}
    >
      <Typography variant="h6" color="#fff" sx={{ fontSize: "1.2rem" }}>
        {value}
      </Typography>
    </Box>
    <Box display="flex" gap={0.5}>
      <SmallStatBox value={online} color="#008080" />
      <SmallStatBox value={offline1h} color="#ff6347" />
      <SmallStatBox value={offline1d} color="#dc143c" />
    </Box>
  </Box>
);

// การ์ดหลักแต่ละอัน
const FullCard = ({ data }) => (
  <Card
    sx={{
      bgcolor: "#2c2c2c",
      color: "white",
      borderRadius: 2,
      width: "100%",
      height: "100%",
      p: 1, // Reduced padding
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography variant="h6" fontWeight="bold" mb={1} sx={{ fontSize: "1rem" }}>
      {data.Name}
    </Typography>
    <Section
      label="Displays"
      value={data.Displays}
      online={data["Displays-Online"]}
      offline1h={data["Displays-Offline (1+ hour)"]}
      offline1d={data["Displays-Offline (1+ day)"]}
    />
    <Section
      label="TV boxes"
      value={data.Box}
      online={data["Box-Online"]}
      offline1h={data["Box-Offline (1+ hour)"]}
      offline1d={data["Box-Offline (1+ day)"]}
    />
  </Card>
);

// หน้าหลัก
export default function DeerTummyPage() {
  const total = exampleData.find((x) => x.Name === "Total");
  const others = exampleData.filter((x) => x.Name !== "Total");

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex-column",
        background: "rgba(0, 0, 0, 0.99)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          width: "100%",
          height: "5vh",
          bgcolor: "#2c2c2c",
          fontSize: "1rem", // Reduced font size
          color: "#fff",
          padding: 0.5, // Reduced padding
        }}
      >
        DeerTummy
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: "95vh",
          display: "flex",
        }}
      >
        {/* ซ้าย: Total */}
        <Box
          sx={{
            width: "30%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 1, // Reduced margin
          }}
        >
          <Box width="100%" height="50%">
            <FullCard data={total} />
          </Box>
        </Box>

        {/* ขวา: 6 การ์ด */}
        <Box
          sx={{
            width: "70%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: 1, // Reduced gap
            p: 1, // Reduced padding
          }}
        >
          {others.map((item, idx) => (
            <FullCard key={idx} data={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
