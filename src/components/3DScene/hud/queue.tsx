import React, { useEffect } from "react";

// MUI
import { Typography } from "@mui/material";
import { Box } from "@mui/material";

// components
import ShuffleText from "../shuffle-text";

type Queue = {
    index?: number;
}
const Queue: React.FC<Queue> = ({index}) => {
    // for the socket.io integration - Shehan
    useEffect(() => {

    }, [])

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                left: '1.55%',
                position: 'absolute',
                transform: 'translateY(-50%)',
                top: '50%',
                zIndex: 2,
            }}>
                <ShuffleText
                    text="Queue Position"
                    sx={{
                        color: '#00ff9b',
                        fontSize: 11.55,
                        fontFamily: 'Source Code Pro',
                        textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        width: 120
                    }}
                    shuffleSpeed={200}
                    characters="Queue Waiting Time"
                />
                <Typography sx={{
                    color: '#00ff9b',
                    fontSize: 11.55,
                    fontFamily: 'Source Code Pro',
                    textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    mt: .65
                }}>
                    [ {index ?? 0} ]
                </Typography>
            </Box>
        </>
    )
}

export default Queue
