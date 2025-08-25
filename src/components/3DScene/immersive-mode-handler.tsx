import React, { useEffect } from "react";

// components
import ShuffleText from "./shuffle-text";

const ImmersiveModeHandler: React.FC = () => {
    useEffect(() => {
        // Immediately disable interactions when the handler mounts
        window.dispatchEvent(new CustomEvent('disableRaycasting'));
        window.dispatchEvent(new CustomEvent('disableInteractions'));

        // Clear any existing timeouts
        if (window.lastInteractionTimeout) {
            clearTimeout(window.lastInteractionTimeout);
        }

        const handlePointerLock = () => {
            // Always disable first to ensure clean state
            window.dispatchEvent(new CustomEvent('disableRaycasting'));
            window.dispatchEvent(new CustomEvent('disableInteractions'));

            if (document.pointerLockElement) {
                // Clear any existing timeouts
                if (window.lastInteractionTimeout) {
                    clearTimeout(window.lastInteractionTimeout);
                }

                // Set a new timeout for enabling interactions
                // window.lastInteractionTimeout = setTimeout(() => {
                //     // Double check we're still in pointer lock and no modals are open
                //     if (document.pointerLockElement &&
                //         !JSON.parse(sessionStorage.getItem('settingsModalIsOPened') || 'false')) {
                //         window.dispatchEvent(new CustomEvent('enableRaycasting'));
                //         window.dispatchEvent(new CustomEvent('enableInteractions'));
                //         sessionStorage.setItem('interactionState', 'enabled');
                //     }
                // }, 2000);
                window.lastInteractionTimeout = window.setTimeout(() => {
                    if (document.pointerLockElement &&
                        !JSON.parse(sessionStorage.getItem('settingsModalIsOPened') || 'false')) {
                        window.dispatchEvent(new CustomEvent('enableRaycasting'));
                        window.dispatchEvent(new CustomEvent('enableInteractions'));
                        sessionStorage.setItem('interactionState', 'enabled');
                    }
                }, 2000);
            }
        };

        document.addEventListener('pointerlockchange', handlePointerLock);
        return () => {
            document.removeEventListener('pointerlockchange', handlePointerLock);
            if (window.lastInteractionTimeout) {
                clearTimeout(window.lastInteractionTimeout);
            }
        };
    }, []);

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
