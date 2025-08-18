import React from "react";

// components
import ShuffleText from "./shuffle-text";

const blinkKeyframes = `
@keyframes blinkOpacity {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}
`;

const TapeRecorderHandle: React.FC = () => {
    React.useEffect(() => {
        // Inject keyframes once
        const style = document.createElement('style');
        style.innerHTML = blinkKeyframes;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <>
            <div
                id="tape-recorder-handle"
                style={{
                    display: 'none',
                    position: 'fixed',
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '75%',
                    zIndex: 2,
                }}>
                <span
                    style={{
                        animation: 'blinkOpacity 1.6s linear infinite',
                        display: 'inline-block'
                    }}
                >
                    <ShuffleText
                        text="Tape playing (Encrypted Message)"
                        sx={{
                            color: '#00ff9b',
                            fontSize: 18,
                            fontFamily: 'Source Code Pro',
                            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                            textTransform: 'uppercase'
                        }}
                        shuffleSpeed={100}
                        characters="Tape playing (Encrypted Message)" />
                </span>
            </div>
        </>
    )
}

export default TapeRecorderHandle