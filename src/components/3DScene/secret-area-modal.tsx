import React, { useEffect, useState, useCallback, useRef } from 'react';

// MUI
import { Modal, Box, Typography } from '@mui/material';

// components
import ShuffleText from './shuffle-text';
import PointerCoords from './pointer-coords';
import PointerCrossLines from './pointer-cross-lines';

// props
import { SecretAreaModalProps } from '../../interfaces/props';

const SecretAreaModal: React.FC<SecretAreaModalProps> = ({ open, onClose, assetName, assetFileName }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [scanLine, setScanLine] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const timeoutRef = useRef<number | undefined>(undefined);

    // Cleanup function
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes gridReveal {
                0% {
                    transform: scale(2);
                    opacity: 1;
                    background-size: 80px 80px;
                }
                100% {
                    transform: scale(1);
                    opacity: 0.3;
                    background-size: 40px 40px;
                }
            }
        `;
        document.head.appendChild(style);
        return () => style.remove();
    }, []);

    // Initial loading effect
    useEffect(() => {
        if (open) {
            sessionStorage.setItem('anImageModalIsOPened', JSON.stringify(true));
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [open]);

    // Function to generate random terminal logs
    const generateLog = useCallback(() => {
        const logTypes = [
            "C:\\IMAGES> INITIALIZING THUMBNAIL CACHE...",
            "C:\\IMAGES> SCANNING FILE ALLOCATION TABLE [FAT16]",
            "C:\\IMAGES> LOADING JPEG DECODER [v1.2]",
            "C:\\IMAGES> READING PHOTO CD INDEX.SYS",
            "C:\\IMAGES> DECOMPRESSING GIF87a FORMAT...",
            "C:\\IMAGES> ACCESSING SCANNER DRIVER [HP ScanJet IIc]",
            "C:\\IMAGES> MOUNTING FLOPPY DISK [IMG_1995]",
            "C:\\IMAGES> RENDERING 256-COLOR PALETTE...",
            "C:\\IMAGES> VERIFYING BMP HEADER [320x200, 8-bit]",
            "C:\\IMAGES> LOADING IRFANVIEW PLUGIN [v0.95]",
            "C:\\IMAGES> EXTRACTING ICON RESOURCES...",
            "C:\\IMAGES> WRITING TO THUMBS.DB",
            "C:\\IMAGES> CONVERTING PICTURE TO WALLPAPER.BMP",
            "C:\\IMAGES> INITIALIZING TWAIN SCAN INTERFACE...",
            "C:\\IMAGES> DOWNLOADING FROM DIGICAM [EST. TIME: 8m12s]",
            "C:\\IMAGES> COMPRESSING TO ZIP DISK [IOMEGA]",
            "C:\\IMAGES> DETECTING CORRUPTED PIXELS...",
            "C:\\IMAGES> APPLYING DITHERING FILTER...",
            "C:\\IMAGES> SAVING AS PCX FORMAT [COMPUSERVE]",
            "C:\\IMAGES> PRINTING TO PHOTO PAPER [HP DeskJet 550C]",
            "C:\\IMAGES> UPDATING IMAGE CATALOG [1995_PHOTOS.IDX]"
        ];
        const randomLog = logTypes[Math.floor(Math.random() * logTypes.length)];
        let minutes: any = new Date().getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        let seconds: any = new Date().getSeconds();
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        const timestamp = minutes + ":" + seconds;
        return `[${timestamp}] ${randomLog}`;
    }, []);

    // Add new log periodically
    useEffect(() => {
        if (!open) return;

        const logInterval = setInterval(() => {
            setLogs(prevLogs => {
                const newLogs = [...prevLogs, generateLog()];
                return newLogs.slice(-26); // Keep only last 15 logs
            });
        }, 2000);

        return () => clearInterval(logInterval);
    }, [open, generateLog]);

    // Exit fullscreen and pointer lock when modal opens
    useEffect(() => {
        if (open) {
            // Exit fullscreen and pointer lock with proper type handling
            const exitFullscreenAndPointerLock = async () => {
                try {
                    // Exit pointer lock if active
                    if (document.pointerLockElement) {
                        document.exitPointerLock();
                    }

                    // Cast document to any to access browser-specific properties
                    const doc = document as any;

                    if (document.fullscreenElement ||
                        doc.webkitFullscreenElement ||
                        doc.mozFullScreenElement ||
                        doc.msFullscreenElement) {

                        if (document.exitFullscreen) {
                            await document.exitFullscreen();
                        } else if (doc.webkitExitFullscreen) {
                            await doc.webkitExitFullscreen();
                        } else if (doc.mozCancelFullScreen) {
                            await doc.mozCancelFullScreen();
                        } else if (doc.msExitFullscreen) {
                            await doc.msExitFullscreen();
                        }

                        console.log('Successfully exited fullscreen');
                    }
                } catch (err) {
                    console.log('Error exiting fullscreen/pointer lock:', err);
                }
            };

            // Small delay to ensure the modal is properly rendered first
            setTimeout(exitFullscreenAndPointerLock, 100);
        }
    }, [open]);

    // Handle Q key and ESC key to close modal
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'q' || event.key === 'Q') {
                // Disable interactions first
                window.dispatchEvent(new CustomEvent('disableRaycasting'));
                window.dispatchEvent(new CustomEvent('disableInteractions'));
                
                onClose();
                // moving back - player
                const moveBackEvent = new CustomEvent('movePlayerBack', {
                    detail: { distance: 2 }
                });
                window.dispatchEvent(moveBackEvent);

                sessionStorage.setItem('anImageModalIsOPened', JSON.stringify(false));
                sessionStorage.setItem('modalMessage', JSON.stringify("n/a"));
                sessionStorage.setItem('modalFileName', JSON.stringify("n/a"));

                // Re-enable interactions after a delay
                setTimeout(() => {
                    if (document.pointerLockElement) {
                        window.dispatchEvent(new CustomEvent('enableRaycasting'));
                        window.dispatchEvent(new CustomEvent('enableInteractions'));
                    }
                }, 2000);
            }
        };

        if (open) {
            window.addEventListener('keydown', handleKeyPress);
        }

        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onClose, open]);

    // Handle image loading animation
    useEffect(() => {
        if (open) {
            setImageLoading(true);
            setScanLine(0);

            const scanInterval = setInterval(() => {
                setScanLine(prev => {
                    if (prev >= 20) {
                        clearInterval(scanInterval);
                        setImageLoading(false);
                        return 20;
                    }
                    return prev + 1;
                });
            }, 200);

            return () => clearInterval(scanInterval);
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            disableEscapeKeyDown
            aria-labelledby="secret-area-modal"
            aria-describedby="secret-area-description">
            <Box id="secret-area-modal"
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    backgroundColor: '#000',
                    padding: 2,
                    borderRadius: 0,
                    width: '100vw',
                    height: '100%',
                    color: '#0f0',
                    outline: 'none',
                    margin: 0,
                    boxSizing: 'border-box',
                    cursor: 'default',
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(32, 255, 77, .05) 25%, rgba(32, 255, 77, .05) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .05) 75%, rgba(32, 255, 77, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 255, 77, .05) 25%, rgba(32, 255, 77, .05) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .05) 75%, rgba(32, 255, 77, .05) 76%, transparent 77%, transparent)',
                    backgroundSize: '50px 50px',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 155, 0.1) 3px, transparent 4px),
                                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 255, 155, 0.1) 3px, transparent 4px)`,
                        backgroundSize: '40px 40px',
                        animation: isLoading ? 'gridReveal 1s ease-out' : 'none',
                        pointerEvents: 'none',
                    },
                    '& > *': {
                        opacity: isLoading ? 0 : 1,
                        animation: isLoading ? 'none' : 'fadeIn 0.5s ease-out forwards',
                        transition: 'opacity 0.3s ease-out'
                    }
                }}>
                <Box sx={{
                    position: 'relative',
                    border: '1px solid rgba(0, 255, 155, .6)',
                    height: 'calc(100% - 0px)',
                    padding: '20px',
                    margin: '0',
                    boxShadow: '0 0 10px rgba(0, 255, 0, 0.3), inset 0 0 10px rgba(0, 255, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        border: '1px solid rgba(0, 255, 155, .0)',
                        pointerEvents: 'none'
                    }
                }}>
                    <Typography sx={{
                        color: '#00ff9b',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        position: 'absolute',
                        top: -10,
                        left: 20,
                        backgroundColor: '#000',
                        padding: '0 10px',
                        textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                    }}>
                        CLASSIFIED SOURCE
                    </Typography>

                    <ShuffleText
                        text={assetName}
                        sx={{
                            color: '#00ff9b',
                            fontSize: '1.05vw',
                            fontFamily: 'monospace',
                            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            borderBottom: '1px solid rgba(0, 255, 155, .4)',
                            pt: '10px',
                            pb: '20px',
                            mb: '20px'
                        }}
                        shuffleSpeed={200}
                        characters={assetName}
                    />
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            width: '66%',
                            height: '100%',
                            left: '0',
                            top: 0,
                        }}>
                            <Box sx={{
                                border: '1px solid rgba(0, 255, 155, .4)',
                                padding: '10px',
                                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                height: 'calc(100% - 0px)'
                            }}>
                                {/* Active scan line */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: `${(scanLine / 20) * 100}%`,
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    backgroundColor: 'rgba(0, 255, 155, 0.8)',
                                    boxShadow: '0 0 8px rgba(0, 255, 155, 0.8)',
                                    transition: 'top 0.2s ease-out',
                                    pointerEvents: 'none',
                                    zIndex: 3
                                }} />
                                <img style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    filter: 'brightness(0.65) sepia(0.95) hue-rotate(120deg)',
                                    opacity: 0,
                                    animation: imageLoading ? 'none' : 'fadeIn 0.5s ease-in-out forwards',
                                    clipPath: imageLoading ?
                                        `polygon(0 0, 100% 0, 100% ${(scanLine / 20) * 100}%, 0 ${(scanLine / 20) * 100}%)` :
                                        'none',
                                    transition: 'clip-path 0.2s ease-out'
                                }} src={`/textures/${assetFileName}`}
                                    alt="Classified Image" />
                            </Box>
                        </Box>

                        <Box sx={{
                            position: 'absolute',
                            width: '34%',
                            height: '100%',
                            left: '66%',
                            top: 0
                        }}>
                            <Box sx={{
                                border: '1px solid rgba(0, 255, 155, .55)',
                                borderLeft: 'none',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                fontFamily: 'Source Code Pro',
                                height: 'calc(100% - 0px)',
                                backgroundColor: 'rgba(0, 255, 0, 0.05)',
                            }}>
                                <ShuffleText
                                    text="SYSTEM MONITOR - LIVE FEED"
                                    sx={{
                                        color: '#00ff9b',
                                        margin: '0 0 15px 0',
                                        fontSize: '.9vw',
                                        letterSpacing: '1px',
                                        borderBottom: '1px solid rgba(0, 255, 155, .75)',
                                        paddingBottom: '20px',
                                        fontFamily: 'Source Code Pro',
                                        textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                    }}
                                    shuffleSpeed={150}
                                    characters="SYSTEM MONITOR - LIVE FEED" />

                                <Box sx={{
                                    marginBottom: '20px',
                                    fontSize: '15px',
                                }}>
                                    <Typography sx={{
                                        fontFamily: 'Source Code Pro',
                                        fontSize: '.78vw',
                                        mt: 1,
                                        color: '#00ff9b',
                                        textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                    }}>STATUS: SERVERS - ACTIVE</Typography>

                                    <Typography sx={{
                                        fontFamily: 'Source Code Pro',
                                        fontSize: '.78vw',
                                        mt: 1,
                                        color: '#00ff9b',
                                        textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                    }}>CLEARANCE: LEVEL 4</Typography>

                                    <Typography sx={{
                                        fontFamily: 'Source Code Pro',
                                        fontSize: '.78vw',
                                        mt: 1,
                                        color: '#00ff9b',
                                        textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                    }}>CURRENT TIME: {new Date().toLocaleTimeString()}</Typography>
                                </Box>
                                <Box sx={{
                                    flex: 1,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '::-webkit-scrollbar': { display: 'none' },
                                    '-ms-overflow-style': 'none',
                                    'scrollbarWidth': 'none',
                                    height: '10px'
                                }}>
                                    {logs.map((log, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                margin: '5px 0',
                                                animation: 'fadeIn 0.3s ease-in-out',
                                                fontFamily: 'Source Code Pro',
                                                textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                                whiteSpace: 'pre-wrap',
                                                fontSize: '.76vw',
                                                color: '#00ff9b',
                                                textTransform: 'uppercase'
                                            }}>
                                            {log}
                                        </Box>
                                    ))}
                                    <Box ref={logsEndRef} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box className="modal-action-trigger"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent click from reaching through
                        
                        // Disable interactions first
                        window.dispatchEvent(new CustomEvent('disableRaycasting'));
                        window.dispatchEvent(new CustomEvent('disableInteractions'));
                        
                        onClose();
                        
                        sessionStorage.setItem('anImageModalIsOPened', JSON.stringify(false));
                        sessionStorage.setItem('modalMessage', JSON.stringify("n/a"));
                        sessionStorage.setItem('modalFileName', JSON.stringify("n/a"));

                        // Re-enable interactions after a delay
                        setTimeout(() => {
                            if (document.pointerLockElement) {
                                window.dispatchEvent(new CustomEvent('enableRaycasting'));
                                window.dispatchEvent(new CustomEvent('enableInteractions'));
                            }
                        }, 2000);
                    }}
                    sx={{
                        position: 'absolute',
                        top: 30,
                        right: 30,
                        backgroundColor: 'transparent',
                        color: '#00ff9b',
                        border: '1px solid rgba(0, 255, 155, .75)',
                        textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                        padding: '10px 30px',
                        fontSize: '.78vw',
                        letterSpacing: '1.25px',
                        fontFamily: 'Source Code Pro',
                        textTransform: 'uppercase',
                        mr: 1,
                        width: 'auto',
                        pl: 2,
                        pr: 2,
                        pt: 2,
                        pb: 2,
                        transition: 'all .15s linear',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 255, 155, 0.1)';
                        e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 155, 0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                    }}>
                    Close [PRESS Q]
                </Box>

                <PointerCoords bottomMargin='1.75%' />
                <PointerCrossLines />
            </Box>
        </Modal>
    );
};

export default SecretAreaModal;
