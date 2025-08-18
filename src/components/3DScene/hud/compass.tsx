import React from 'react';
import { Box, Typography } from '@mui/material';
import { useThree } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';

const Compass: React.FC = () => {
    const [rotation, setRotation] = React.useState(0);
    const { camera } = useThree();

    useFrame(() => {
        const degrees = (camera.rotation.y * (180 / Math.PI)) % 360;
        setRotation(degrees < 0 ? degrees + 360 : degrees);
    });

    const compassWidth = 400;
    const directions = [
        { label: 'N', angle: 0 },
        { label: 'NE', angle: 45 },
        { label: 'E', angle: 90 },
        { label: 'SE', angle: 135 },
        { label: 'S', angle: 180 },
        { label: 'SW', angle: 225 },
        { label: 'W', angle: 270 },
        { label: 'NW', angle: 315 }
    ];

    return (
        <Box sx={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: compassWidth,
            height: 30,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '1px solid rgba(255,135,55,0.3)',
            zIndex: 2,
        }} >
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    transform: `translateX(${(rotation / 360) * compassWidth}px)`,
                }}
            >
                {directions.map((dir, index) => (
                    <Typography
                        key={index}
                        sx={{
                            color: dir.label === 'N' ? '#ff8737' : 'orangered',
                            fontSize: dir.label.length === 1 ? 20 : 16,
                            fontFamily: 'Source Code Pro',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            fontWeight: dir.label.length === 1 ? 'bold' : 'normal',
                            width: compassWidth / 8,
                            textAlign: 'center',
                            flexShrink: 0,
                        }}
                    >
                        {dir.label}
                    </Typography>
                ))}
                <Typography sx={{
                    color: '#ff8737',
                    fontSize: 20,
                    fontFamily: 'Source Code Pro',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    fontWeight: 'bold',
                    width: compassWidth / 8,
                    textAlign: 'center',
                    flexShrink: 0,
                }} >
                    N
                </Typography>
            </Box>
            {/* Center marker */}
            <Box
                sx={{
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid orangered',
                    top: -4,
                }}
            />
        </Box>
    );
};

export default Compass;
