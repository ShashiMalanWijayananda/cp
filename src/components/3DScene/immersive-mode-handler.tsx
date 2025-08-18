import React from "react";

// componnsts
import ShuffleText from "./shuffle-text";

const ImmersiveModeHandler: React.FC = () => {
    return (
        <>
            <ShuffleText
                text="Click on the screen to experience the immersive experience"
                sx={{
                    color: '#00ff9b',
                    fontSize: 13,
                    fontFamily: 'Source Code Pro',
                    // textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                    textTransform: 'uppercase',
                    position: 'fixed',
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '55%',
                    zIndex: 1
                }}
                shuffleSpeed={250}
                characters="Click in the canvas to enter the immersive experience" />
        </>
    )
}

export default ImmersiveModeHandler