import React, { useEffect, useState } from "react";

// MUI
import { Box } from "@mui/material";
import { Typography } from "@mui/material";

// components
import ShuffleText from "../shuffle-text";

const Time: React.FC = () => {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const timer = setInterval(() => {
            const date = new Date();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            setTime(`${minutes}:${seconds}`);
        }, 1000);

        return () => {
            clearInterval(timer)
        };
    }, []);

    return (
        <>
            <Box sx={{
                position: 'absolute',
                right: '1.55%',
                transform: 'translateY(-50%)',
                top: '50%',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <ShuffleText
                    text="Local Time"
                    sx={{
                        color: '#00ff9b',
                        textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                        fontSize: 11.55,
                        fontFamily: 'Source Code Pro',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        width: 120,
                        textAlign: 'right'
                    }}
                    shuffleSpeed={200}
                    characters="Local Time"
                />
                <Typography sx={{
                    color: '#00ff9b',
                    textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                    fontSize: 11.55,
                    fontFamily: 'Source Code Pro',
                    textAlign: 'right',
                    mt: .65   
                }}>{`[ ${time} ]`}</Typography>
            </Box>
        </>
    )
}

export default Time