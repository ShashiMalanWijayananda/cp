import React from "react";

// MUI
import { Box } from "@mui/material";

// components
import ShuffleText from "../shuffle-text";

const Location: React.FC = () => {
    return (
        <>
            <Box sx={{
                position: 'absolute',
                right: '1.55%',
                top: 25,
                zIndex: 2,
            }}>
                <ShuffleText
                    text="Welioya, Sri Lanka"
                    sx={{
                        color: '#00ff9b',
                        fontSize: 11.55,
                        fontFamily: 'Source Code Pro',
                        textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                        textTransform: 'uppercase'
                    }}
                    shuffleSpeed={250}
                    characters="Welioya, Sri Lanka" />
            </Box>
        </>
    )
}

export default Location