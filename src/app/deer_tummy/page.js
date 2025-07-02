"use client";
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [screenSize, setScreenSize] = useState({ width: 1920, height: 1080 });
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });

      // Calculate scale factor based on screen size
      // Base size: 1920x1080
      const baseWidth = 1920;
      const baseHeight = 1080;
      
      const widthRatio = width / baseWidth;
      const heightRatio = height / baseHeight;
      
      // Use the smaller ratio to ensure everything fits
      const scale = Math.min(widthRatio, heightRatio, 1);
      setScaleFactor(scale);
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Mock data for 7 cards
  const mockData = {
    lastUpdated: '02/07/2025 09:13:30',
    sections: [
      {
        title: 'Total',
        displays: 45,
        tvBoxes: 45,
        online: 42,
        offline1h: 2,
        offline1day: 1
      },
      {
        title: 'TV Endgon',
        displays: 12,
        tvBoxes: 12,
        online: 11,
        offline1h: 1,
        offline1day: 0
      },
      {
        title: 'KioskPowerBank',
        displays: 8,
        tvBoxes: 8,
        online: 8,
        offline1h: 0,
        offline1day: 0
      },
      {
        title: 'Pillar',
        displays: 6,
        tvBoxes: 6,
        online: 5,
        offline1h: 1,
        offline1day: 0
      },
      {
        title: 'Kiosk',
        displays: 10,
        tvBoxes: 10,
        online: 9,
        offline1h: 0,
        offline1day: 1
      },
      {
        title: 'TV Walkway',
        displays: 7,
        tvBoxes: 7,
        online: 7,
        offline1h: 0,
        offline1day: 0
      },
      {
        title: 'VideoWall',
        displays: 2,
        tvBoxes: 2,
        online: 2,
        offline1h: 0,
        offline1day: 0
      }
    ]
  };

  const getResponsiveStyles = () => {
    const isMobile = screenSize.width < 768;
    const isTablet = screenSize.width >= 768 && screenSize.width < 1200;
    const isDesktop = screenSize.width >= 1200;

    return {
      container: {
        backgroundColor: '#1a1a1a',
        minHeight: '100vh',
        height: '100vh',
        padding: `${Math.max(12, 24 * scaleFactor)}px`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden'
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: `${Math.max(12, 24 * scaleFactor)}px`,
        flexShrink: 0
      },
      headerText: {
        color: 'white',
        fontSize: isMobile ? '16px' : isTablet ? '20px' : `${Math.max(18, 24 * scaleFactor)}px`,
        fontWeight: 'bold'
      },
      lastUpdated: {
        color: '#ffc107'
      },
      statusIndicator: {
        width: `${Math.max(12, 16 * scaleFactor)}px`,
        height: `${Math.max(12, 16 * scaleFactor)}px`,
        backgroundColor: '#ef5350',
        borderRadius: '2px',
        flexShrink: 0
      },
      gridContainer: {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gridTemplateRows: isMobile ? 'repeat(7, 1fr)' : isTablet ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
        gap: `${Math.max(8, 16 * scaleFactor)}px`,
        flex: 1,
        minHeight: 0
      },
      card: {
        backgroundColor: '#2d2d2d',
        borderRadius: `${Math.max(4, 8 * scaleFactor)}px`,
        padding: `${Math.max(8, 20 * scaleFactor)}px`,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden'
      },
      cardTitle: {
        fontSize: isMobile ? '14px' : isTablet ? '16px' : `${Math.max(14, 18 * scaleFactor)}px`,
        fontWeight: 'bold',
        marginBottom: `${Math.max(8, 16 * scaleFactor)}px`,
        color: 'white',
        flexShrink: 0
      },
      sectionLabel: {
        color: '#9e9e9e',
        fontSize: isMobile ? '10px' : isTablet ? '12px' : `${Math.max(10, 14 * scaleFactor)}px`,
        marginBottom: `${Math.max(4, 8 * scaleFactor)}px`,
        flexShrink: 0
      },
      numberDisplay: {
        backgroundColor: '#404040',
        borderRadius: `${Math.max(2, 4 * scaleFactor)}px`,
        padding: `${Math.max(8, 16 * scaleFactor)}px`,
        textAlign: 'center',
        marginBottom: `${Math.max(6, 12 * scaleFactor)}px`,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      numberText: {
        fontSize: isMobile ? '20px' : isTablet ? '28px' : `${Math.max(20, 36 * scaleFactor)}px`,
        fontWeight: 'bold',
        color: 'white',
        margin: 0
      },
      statusRow: {
        display: 'flex',
        gap: `${Math.max(2, 4 * scaleFactor)}px`,
        marginBottom: `${Math.max(8, 16 * scaleFactor)}px`,
        flexShrink: 0
      },
      statusBox: {
        padding: `${Math.max(4, 8 * scaleFactor)}px`,
        borderRadius: `${Math.max(2, 4 * scaleFactor)}px`,
        flex: 1,
        textAlign: 'center',
        fontSize: isMobile ? '10px' : isTablet ? '12px' : `${Math.max(10, 14 * scaleFactor)}px`,
        fontWeight: 'bold',
        color: 'white',
        minHeight: `${Math.max(20, 32 * scaleFactor)}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      online: {
        backgroundColor: '#26a69a'
      },
      offline1h: {
        backgroundColor: '#ff9800'
      },
      offline1day: {
        backgroundColor: '#f44336'
      }
    };
  };

  const styles = getResponsiveStyles();
  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1200;

  const StatusCard = ({ section, cardIndex }) => {
    let cardStyle = styles.card;

    // Special positioning for desktop layout
    if (!isMobile && !isTablet) {
      if (cardIndex === 4) {
        cardStyle = { ...styles.card, gridColumn: '2 / 3', gridRow: '2 / 3' };
      } else if (cardIndex === 5) {
        cardStyle = { ...styles.card, gridColumn: '3 / 4', gridRow: '2 / 3' };
      } else if (cardIndex === 6) {
        cardStyle = { ...styles.card, gridColumn: '4 / 5', gridRow: '2 / 3' };
      }
    }

    return (
      <div style={cardStyle}>
        <div style={styles.cardTitle}>{section.title}</div>
        
        {/* Displays */}
        <div style={styles.sectionLabel}>Displays</div>
        <div style={styles.numberDisplay}>
          <div style={styles.numberText}>{section.displays}</div>
        </div>
        
        {/* Status indicators for Displays */}
        <div style={styles.statusRow}>
          <div style={{ ...styles.statusBox, ...styles.online }}>
            {section.online}
          </div>
          <div style={{ ...styles.statusBox, ...styles.offline1h }}>
            {section.offline1h}
          </div>
          <div style={{ ...styles.statusBox, ...styles.offline1day }}>
            {section.offline1day}
          </div>
        </div>

        {/* TV boxes */}
        <div style={styles.sectionLabel}>TV boxes</div>
        <div style={styles.numberDisplay}>
          <div style={styles.numberText}>{section.tvBoxes}</div>
        </div>
        
        {/* Status indicators for TV boxes */}
        <div style={styles.statusRow}>
          <div style={{ ...styles.statusBox, ...styles.online }}>
            {section.online}
          </div>
          <div style={{ ...styles.statusBox, ...styles.offline1h }}>
            {section.offline1h}
          </div>
          <div style={{ ...styles.statusBox, ...styles.offline1day }}>
            {section.offline1day}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerText}>
          Dear Tummy - Network status{' '}
          <span style={styles.lastUpdated}>
            (Last updated {mockData.lastUpdated})
          </span>
        </div>
        <div style={styles.statusIndicator}></div>
      </div>

      {/* Dashboard Grid */}
      <div style={styles.gridContainer}>
        {mockData.sections.map((section, index) => (
          <StatusCard key={index} section={section} cardIndex={index} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;