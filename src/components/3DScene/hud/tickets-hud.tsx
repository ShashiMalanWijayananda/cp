import React, { useEffect } from "react";

// MUI
import { Box } from "@mui/material";

// components
import ShuffleText from "../shuffle-text";

const TicketsHUD: React.FC = () => {
    // for the socket.io integration - Shehan
    useEffect(() => {

    }, [])

    return (
        <>
            <Box sx={{
                position: 'absolute',
                left: '1.55%',
                top: 25,
                zIndex: 2,
            }}>
                <ShuffleText
                    text="Buy Tickets [ Press H ]"
                    sx={{
                        color: '#00ff9b',
                        fontSize: 11.55,
                        fontFamily: 'Source Code Pro',
                        textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                    }}
                    shuffleSpeed={200}
                    characters="Queue Waiting Time"
                />
            </Box>
        </>
    )
}

export default TicketsHUD