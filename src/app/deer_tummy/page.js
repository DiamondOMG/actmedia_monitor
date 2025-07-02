"use client";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  // Mock data (ใช้แค่ 8 card แรก)
  const mockData = [
    {
      title: "Total",
      displays: 45,
      tvBoxes: 45,
      online: 42,
      offline1h: 2,
      offline1day: 1,
    },
    {
      title: "TV Endgon",
      displays: 12,
      tvBoxes: 12,
      online: 11,
      offline1h: 1,
      offline1day: 0,
    },
    {
      title: "KioskPowerBank",
      displays: 8,
      tvBoxes: 8,
      online: 8,
      offline1h: 0,
      offline1day: 0,
    },
    {
      title: "Pillar",
      displays: 6,
      tvBoxes: 6,
      online: 5,
      offline1h: 1,
      offline1day: 0,
    },
    {
      title: "Kiosk",
      displays: 10,
      tvBoxes: 10,
      online: 9,
      offline1h: 0,
      offline1day: 1,
    },
    {
      title: "TV Walkway",
      displays: 7,
      tvBoxes: 7,
      online: 7,
      offline1h: 0,
      offline1day: 0,
    },
    {
      title: "VideoWall",
      displays: 2,
      tvBoxes: 2,
      online: 2,
      offline1h: 0,
      offline1day: 0,
    },
    // {
    //   title: "Spare",
    //   displays: 0,
    //   tvBoxes: 0,
    //   online: 0,
    //   offline1h: 0,
    //   offline1day: 0,
    // },
  ];

  const cardStyle = {
    background: "#2d2d2d",
    borderRadius: 8,
    padding: 16,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 0,
  };

  return (
    <>
      {/* Pixel Debug Box */}
      <div
        style={{
          position: "fixed",
          top: 8,
          right: 8,
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          fontSize: 12,
          padding: "4px 10px",
          borderRadius: 6,
          zIndex: 9999,
          fontFamily: "monospace",
        }}
      >
        {screenSize.width} x {screenSize.height}
      </div>
      <div
        style={{
          background: "#1a1a1a",
          minHeight: "100vh",
          padding: 24,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 24,
            marginBottom: 16,
          }}
        >
          Dear Tummy - Network status{" "}
          <span
            style={{ color: "#ffc107", fontWeight: "normal", fontSize: 16 }}
          >
            (Last updated 02/07/2025 09:13:30)
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {mockData.slice(0, 8).map((section, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ fontWeight: "bold", fontSize: 18 }}>
                {section.title}
              </div>
              <div style={{ color: "#9e9e9e", fontSize: 14 }}>Displays</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {section.displays}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <div
                  style={{
                    flex: 1,
                    background: "#26a69a",
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {section.online}
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "#ff9800",
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {section.offline1h}
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "#f44336",
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {section.offline1day}
                </div>
              </div>
              <div style={{ color: "#9e9e9e", fontSize: 14 }}>TV boxes</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {section.tvBoxes}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <div
                  style={{
                    flex: 1,
                    background: "#26a69a",
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {section.online}
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "#ff9800",
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {section.offline1h}
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "#f44336",
                    borderRadius: 4,
                    textAlign: "center",
                  }}
                >
                  {section.offline1day}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
