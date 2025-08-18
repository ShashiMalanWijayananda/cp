import React from 'react';
import { Box, Typography } from '@mui/material';
import { useCompassStore } from './compass-rotation';

const CompassHUD: React.FC = () => {
    const rotation = useCompassStore((state) => state.rotation);
    const compassWidth = 400;

    const baseDirections = [
        { label: 'N', angle: 0 },
        { label: 'NE', angle: 45 },
        { label: 'E', angle: 90 },
        { label: 'SE', angle: 135 },
        { label: 'S', angle: 180 },
        { label: 'SW', angle: 225 },
        { label: 'W', angle: 270 },
        { label: 'NW', angle: 315 }
    ];

    const directions = [
        ...baseDirections.map(d => ({ ...d, angle: d.angle - 360 })),
        ...baseDirections,
        ...baseDirections.map(d => ({ ...d, angle: d.angle + 360 })),
        ...baseDirections.map(d => ({ ...d, angle: d.angle + 720 }))
    ];

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                width: compassWidth,
                height: 30,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                paddingTop: 1.55,
                zIndex: 2,
            }}>
            <Box
                sx={{
                    position: 'absolute',
                    width: '400%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    transform: `translateX(${((-rotation / 360) * compassWidth) + compassWidth}px)`, // Center the current set
                    transition: 'transform 0.1s ease-out',
                }}
            >
                {directions.map((dir) => (
                    <Typography
                        key={`${dir.label}-${dir.angle}`}
                        sx={{
                            color: dir.label === 'N' ? '#00ff9b' : '#00ff9b',
                            fontSize: dir.label.length === 1 ? 13 : 13,
                            fontFamily: 'Source Code Pro',
                            fontWeight: dir.label.length === 1 ? '600' : '380',
                            width: compassWidth / 8,
                            textAlign: 'center',
                            flexShrink: 0,
                            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                        }}
                    >
                        {dir.label}
                    </Typography>
                ))}
            </Box>
            {/* Center marker */}
            <Box
                sx={{
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '6px solid #00ff9b',
                    top: 0,
                }}
            />
        </Box>
    );
};

export default CompassHUD;
