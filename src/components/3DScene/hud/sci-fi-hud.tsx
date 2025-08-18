import React, { useState, useEffect } from 'react';

// MUI
import { Typography, Box } from '@mui/material';

// components
import ShuffleText from '../shuffle-text';

// props
import { HUDPanelDetailProps } from '../../../interfaces/props';

const SciFiHUD: React.FC = () => {
  const [windSpeed, setWindSpeed] = useState(0);
  const [windDirection, setWindDirection] = useState('N');
  const [temperature, setTemperature] = useState<number>(22);

  const updateWind = () => {
    // Generate random wind speed between 0 and 30 knots
    const newSpeed = Math.floor(Math.random() * 20);
    setWindSpeed(newSpeed);

    // Generate random wind direction
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const newDirection = directions[Math.floor(Math.random() * directions.length)];
    setWindDirection(newDirection);
  };

  const updateTemperature = () => {
    const temperatureArr = [27, 28, 29, 30, 31, 32];
    setTemperature(temperatureArr[Math.floor(Math.random() * temperatureArr.length)]);
  };

  useEffect(() => {
    // Update initially
    updateWind();
    updateTemperature();

    // Update every 3 seconds
    const windInterval = setInterval(updateWind, 3000);
    const tempInterval = setInterval(updateTemperature, 20000);

    return () => {
      clearInterval(windInterval);
      clearInterval(tempInterval);
    }
  }, []);

  const panelDetails: HUDPanelDetailProps[] = [
    {
      title: "Weather",
      data: "[ Clear Night ]"
    },
    {
      title: "Wind Speed",
      data: `[ ${windSpeed} knots '${windDirection}' ]`
    },
    {
      title: "Temp.",
      data: `[ ${temperature} ℃ ]`
    },
    {
      title: "Flash Light",
      data: "[ Battery : 98.5% ]"
    },
  ]

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 7,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '97%',
      height: 60,
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '10px',
      fontFamily: 'Source Code Pro',
      fontSize: '14px',
      zIndex: 3,
    }}
    >
      {panelDetails.map((item, index) => (
        <Box key={index} className="hud-section left" style={{ animation: 'slideInLeft 1s ease-out' }}>
          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShuffleText
              text={item.title}
              sx={{
                color: '#00ff9b',
                fontSize: 11.55,
                fontFamily: 'Source Code Pro',
                textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
              shuffleSpeed={200}
              characters="!@#$%^&*()_+IJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+"
            />
          </Box>
          <Typography sx={{
            color: '#00ff9b',
            fontSize: 11.55,
            fontWeight: 550,
            fontFamily: 'Source Code Pro',
            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
            textTransform: 'uppercase',
            mt: -.5
          }}>{item.data}</Typography>
        </Box>
      ))}
      <style>
        {`
          @keyframes slideInLeft {
            from {
              transform: translateX(-50px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideInRight {
            from {
              transform: translateX(50px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes pulseGlow {
            0% {
              text-shadow: 0 0 5px cyan;
            }
            50% {
              text-shadow: 0 0 20px cyan, 0 0 30px cyan;
            }
            100% {
              text-shadow: 0 0 5px cyan;
            }
          }

          .hud-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .hud-section div {
            position: relative;
            margin-left : -4px;
          }

          .hud-section div::before {
            content: '•';
            color: #00ff9b;
            margin-right: 8px;
            animation: blink 1.5s infinite;
          }

          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }

          @keyframes pulse {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
          }
        `}
      </style>
    </Box>
  );
};

export default SciFiHUD;
