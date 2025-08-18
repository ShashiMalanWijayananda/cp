import React, { useEffect, useState } from 'react';

// components
import ShuffleText from './shuffle-text';
import PointerCrossLines from './pointer-cross-lines';

// MUI
import { Typography } from '@mui/material';
import { Box } from '@mui/material';

const RetroLoadingScreen: React.FC<{ onLoadingComplete: () => void, progress: number }> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INITIALIZING TEXTURES');
  const [xCords, setXCords] = useState<number>(0);
  const [yCords, setYCords] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(1);

  useEffect(() => {
    window.addEventListener('mousemove', (e: any) => {
      setXCords(e.clientX);
      setYCords(e.clientY);
    });
  }, [location])

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev % 8) + 1);
    }, 1500);

    return () => clearInterval(imageInterval);
  }, []);

  useEffect(() => {
    const loadingMessages = [
      'INITIALIZING TEXTURES',
      'LOADING TACTICAL DATA',
      'CALIBRATING COORDINATES',
      'PREPARING YOUR EXPERINCE',
      'LOADING ENVIRONMENT',
      'CONFIGURING SCEEN LIGHTS',
      'ACTIVATING HUD ELEMENTS'
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Only increment if not done
        if (!JSON.parse(sessionStorage.getItem('isAllMaterialsApplied') || "false")) {
          // Cap at 99 until ready
          const newProgress = Math.min(prev + Math.random() * 4, 99);
          return newProgress;
        } else {
          // If ready, set to 100
          return 100;
        }
      });
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onLoadingComplete]);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        onLoadingComplete();
      }, 1000);
    }
  }, [progress, onLoadingComplete]);

  return (
    <>
      <Box id="retro-loading-wrapper"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        backgroundImage: 'radial-gradient(rgba(0, 30, 30, 0.3) 50%, transparent 100%)',
        color: '#00ff9b',
        fontFamily: '"Courier New", monospace',
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <Box style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
          pointerEvents: 'none',
        }} />
        {/* loading images */}
        <Box sx={{
          textAlign: 'center',
          mb: 3,
          display: 'flex',
          justifyContent: "center",
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }
        }}>
          <img
            style={{
              width: '45%',
              filter: 'saturate(0%) sepia(30%) saturate(1000%) hue-rotate(80deg)',
              transition: 'all 1s ease-in-out'
            }}
            src={`/loading-images/${String(currentImageIndex).padStart(2, '0')}.webp`}
            alt=""
          />
        </Box>
        <ShuffleText
          text="[ Loading ]"
          sx={{
            color: '#00ff9b',
            fontSize: 20,
            fontFamily: 'Source Code Pro',
            fontWeight: 500,
            letterSpacing: 3,
            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
            textTransform: 'uppercase',
            mb: 4
          }}
          shuffleSpeed={150}
          characters="PQRSTUVWXYZ1234567890!@#$%^&*()_+"
        />
        <Box style={{
          width: '80%',
          maxWidth: '600px',
          background: 'rgba(0, 255, 155, 0.1)',
          padding: '20px',
          border: '2px solid #00ff9b',
          textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
        }}>
          <Box style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 14
          }}>
            <span>PROGRESS: {loadingText}</span>
            <span>{Math.min(100, Math.floor(progress))}%</span>
          </Box>
          <Box style={{
            width: '100%',
            height: '30px',
            border: '1px solid #00ff9b',
            padding: '2px',
            background: 'rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            <Box style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00ff9b 0%, #00ffcc 100%)',
              textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
              transition: 'width 0.2s ease-out'
            }} />
            <Box style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(0, 0, 0, 0.1) 4px, rgba(0, 0, 0, 0.1) 8px)'
            }} />
          </Box>
        </Box>

        <Box sx={{
          mt: 3
        }}>
          <Typography sx={{
            fontFamily: 'Source Code Pro',
            textTransform: 'uppercase',
            fontSize: 11,
            color: '#00ff9b',
            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
          }}>
            [ Loading may take upto 2-3 minutes depending on your internet connection ]
          </Typography>
        </Box>

        <>
          <Typography sx={{
            position: 'absolute',
            right: '1.55%',
            top: '3%',
            transform: 'translateY(-50%)',
            color: '#00ff9b',
            fontSize: 15,
            fontFamily: 'Source Code Pro',
            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
            textTransform: 'uppercase'
          }}>{Math.round(xCords * 1.25)}</Typography>


          <Typography sx={{
            position: 'absolute',
            left: '1.55%',
            top: '3%',
            transform: 'translateY(-50%)',
            color: '#00ff9b',
            fontSize: 15,
            fontFamily: 'Source Code Pro',
            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
            textTransform: 'uppercase'
          }}>{Math.round(yCords * 1.25)}</Typography>

          <Typography sx={{
            position: 'absolute',
            left: '1.55%',
            bottom: '1%',
            transform: 'translateY(-50%)',
            color: '#00ff9b',
            fontSize: 15,
            fontFamily: 'Source Code Pro',
            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
            textTransform: 'uppercase'
          }}>{xCords}</Typography>

          <Typography sx={{
            position: 'absolute',
            right: '1.55%',
            bottom: '1%',
            transform: 'translateY(-50%)',
            color: '#00ff9b',
            fontSize: 15,
            fontFamily: 'Source Code Pro',
            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
            textTransform: 'uppercase'
          }}>{yCords}</Typography>
        </>
      </Box>

      <PointerCrossLines />
    </>
  );
};

export default RetroLoadingScreen;
