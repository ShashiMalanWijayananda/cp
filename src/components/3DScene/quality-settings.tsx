import React, { useState, useEffect } from 'react';

// context
import { useQualitySettings } from '../../context/QualitySettingsContext';

// props
import { qualityPresets } from '../../interfaces/quality-settings';

// MUI
import { Button } from '@mui/material';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';

// components
import ShuffleText from './shuffle-text';
import PointerCoords from './pointer-coords';
import PointerCrossLines from './pointer-cross-lines';

interface QualitySettingsProps {
    onClose: () => void;
}

const STORAGE_KEY = 'graphics-quality-preset';

const QualitySettings: React.FC<QualitySettingsProps> = ({ onClose }) => {
    sessionStorage.setItem('settingsModalIsOPened', JSON.stringify(true));

    const { setQualityPreset } = useQualitySettings();
    const [selectedPreset, setSelectedPreset] = useState<keyof typeof qualityPresets>(() => {
        const savedPreset = localStorage.getItem(STORAGE_KEY) as keyof typeof qualityPresets;
        return savedPreset && Object.keys(qualityPresets).includes(savedPreset) ? savedPreset : 'low';
    });

    useEffect(() => {
        // Exit fullscreen mode if active
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.error(err));
        }

        // Exit pointer lock if active
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }

        // Show the cursor
        document.body.style.cursor = 'default';

        // Cleanup function to reset cursor when modal closes
        return () => {
            document.body.style.cursor = 'none';
        };
    }, []);

    const handleQualityChange = (preset: keyof typeof qualityPresets) => {
        setSelectedPreset(preset);
        setQualityPreset(preset);
        // Save the selection to localStorage
        localStorage.setItem(STORAGE_KEY, preset);
    };

    return (
        <Box className="quality-settings-overlay">
            <Box className="quality-settings-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
                style={{
                    paddingTop: 30,
                    paddingBottom: 40
                }}>
                <ShuffleText
                    text="GRAPHICS CONFIGURATION"
                    sx={{
                        color: '#00ff9b',
                        fontSize: 16,
                        fontFamily: 'Source Code Pro',
                        textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                        textTransform: 'uppercase'
                    }}
                    shuffleSpeed={180}
                    characters="GRAPHICS CONFIGURATION"
                />
                <Box className="quality-options"
                    role="radiogroup"
                    aria-label="Quality Settings"
                    style={{ width: '30vw' }}
                >

                    {Object.keys(qualityPresets).map((preset) => (
                        <Button key={preset}
                            sx={{
                                textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                height: 45,
                                borderRadius: 0,
                            }}
                            className={`quality-button ${selectedPreset === preset ? 'selected' : ''}`}
                            onClick={() => handleQualityChange(preset as keyof typeof qualityPresets)}
                            role="radio"
                            aria-checked={selectedPreset === preset}
                            tabIndex={0}>
                            <Typography sx={{
                                fontSize: 13,
                                textAlign: 'center',
                                ml: '50%',
                                transform: 'translateX(-50%)',
                                fontFamily: 'Source Code Pro',
                            }}>{preset.charAt(0).toUpperCase() + preset.slice(1)}</Typography>
                        </Button>
                    ))}
                </Box>
                <Button className="close-button"
                    sx={{
                        textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                        fontSize: 13,
                        fontFamily: 'Source Code Pro',
                        borderRadius: 0,
                        width: '100%',

                    }}
                    onClick={() => {
                        sessionStorage.setItem('settingsModalIsOPened', JSON.stringify(false));

                        const moveBackEvent = new CustomEvent('movePlayerBack', {
                            detail: { distance: 2 }
                        });
                        window.dispatchEvent(moveBackEvent);

                        // const turnEvent = new CustomEvent('turnPlayerAround', { detail: { angle: 299 } });
                        // window.dispatchEvent(turnEvent);

                        onClose();
                    }}
                    tabIndex={0}
                >
                    <Typography sx={{
                        fontSize: 13,
                        textAlign: 'center',
                        fontFamily: 'Source Code Pro',
                        pl: 5,
                        pr: 5,
                        pt: 1.2,
                        pb: 1.2
                    }}>[ INITIALIZE ]</Typography>
                </Button>
            </Box>

            <style>{`
                .quality-settings-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 6;
                    font-family: "Courier New", monospace;
                    cursor: 'none !important'
                }
                
                .quality-settings-modal {
                    border-radius: 0px;
                    // width: 37vw;
                    padding-left: 40px;
                    padding-right: 40px;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    max-width: 1000px;
                    // padding: 4rem 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2.75rem;
                    background-color: rgba(0, 255, 153, 0.04);
                    border: 1px solid rgba(0, 255, 153, 0.2);
                    color: #00ff9b;
                    position: relative;
                }
                
                .quality-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    width: 100%;
                    max-width: 600px;
                    margin: 1rem 0;
                }
                
                .quality-button {
                    padding: 1rem;
                    background: transparent;
                    border: 1px solid rgba(0, 255, 155, .2);
                    color: #00ff9b;
                    font-family: "Courier New", monospace;
                    font-size: 16px;
                    letter-spacing: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 1px
                }
                
                .quality-button:hover {
                    background: rgba(0, 255, 0, 0.1);
                    text-shadow: 0 0 10px #00ff9b;
                }
                
                .quality-button.selected {
                    background: rgba(0, 255, 0, 0.15);
                    text-shadow: 0 0 10px #00FF00;
                }

                .quality-button.selected::before {
                    content: '>';
                    position: absolute;
                    left: 10px;
                }

                .quality-button.selected::after {
                    content: '<';
                    position: absolute;
                    right: 10px;
                }
                
                .close-button {
                    // padding: 1rem 3rem;
                    background: transparent;
                    border: 1px solid rgba(0, 255, 155, .35);
                    color: #00ff9b;
                    font-family: "Courier New", monospace;
                    font-size: 16px;
                    letter-spacing: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 0px;
                }
                
                .quality-button:focus-visible {
                    outline: 2px solid #00ff9b;
                    outline-offset: 2px;
                    background: rgba(0, 255, 0, 0.1);
                }
                
                .close-button:focus-visible {
                    outline: 2px solid #00ff9b;
                    outline-offset: 2px;
                    background: rgba(0, 255, 0, 0.1);
                }
                
                .close-button:hover {
                    background: rgba(0, 255, 0, 0.1);
                    text-shadow: 0 0 10px #00FF00;
                }
            `}</style>

            <PointerCoords />
            <PointerCrossLines />
        </Box>
    );
};

export default QualitySettings;
