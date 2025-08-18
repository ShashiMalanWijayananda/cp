import React, { useCallback, useEffect, useState } from 'react';

// MUI
import { Modal, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// components
import ShuffleText from './shuffle-text';

// props
import { IframeModalProps } from '../../interfaces/props';

const IframeModal: React.FC<IframeModalProps> = ({ openIframe, onClose }: IframeModalProps) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleClose = useCallback(() => {
        onClose();
        // sessionStorage.setItem('anInteractiveModalIsOPened', JSON.stringify(false));
        // const moveBackEvent = new CustomEvent('movePlayerBack', {
        //     detail: { distance: 2 }
        // });
        // window.dispatchEvent(moveBackEvent);

        sessionStorage.setItem('anImageModalIsOPened', JSON.stringify(false));

        // const turnEvent = new CustomEvent('turnPlayerAround', { detail: { angle: -10 } });
        // window.dispatchEvent(turnEvent);
    }, [onClose]);

    // Add keyframes for animations
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
        if (openIframe) {
            sessionStorage.setItem('anImageModalIsOPened', JSON.stringify(true));
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [openIframe]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'q' || event.key === 'Q') {
                handleClose();
            }
        };

        if (openIframe) {
            window.addEventListener('keydown', handleKeyPress);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [openIframe, handleClose]);

    const iframeTitle = JSON.parse(sessionStorage.getItem('iframeTitle') || '"Interactive Content"');
    const iframeUrl = JSON.parse(sessionStorage.getItem('iframeUrl') || '"about:blank"');

    return (
        <>
            <Modal
                id="iframe-modal-wrapper"
                disableEscapeKeyDown
                open={!!openIframe}
                onClose={handleClose}
                aria-labelledby="iframe-modal-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)'
                    }
                }}
            >
                <Box sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    backgroundColor: '#000',
                    padding: 2,
                    borderRadius: 0,
                    width: '100vw',
                    height: '100vh',
                    color: '#00ff9b',
                    outline: 'none',
                    margin: 0,
                    boxSizing: 'border-box',
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
                }}
                >
                    {/* Header */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <Box sx={{ display: 'block', alignItems: 'center', gap: 0 }}>
                            <ShuffleText
                                text={iframeTitle}
                                sx={{
                                    color: '#00ff9b',
                                    fontSize: 22,
                                    fontFamily: 'Source Code Pro',
                                    textShadow: '2px 2px 4px rgba(0, 255, 155, .75)',
                                    textTransform: 'uppercase'
                                }}
                                shuffleSpeed={150}
                                characters={iframeTitle} />
                        </Box>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            size="small"
                            sx={{
                                color: '#00ff9b',
                                '&:hover': {
                                    color: '#fff',
                                    textShadow: '0 0 5px #fff'
                                },
                                ml: -12
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Main content grid */}
                    <Box sx={{
                        display: 'grid',
                        gap: 2,
                        flex: 1,
                        overflow: 'hidden',
                        height: '98%'
                    }}>
                        <Box
                            sx={{
                                border: '1px solid rgba(0, 255, 155, .4)',
                                // padding: '2px',
                                position: 'relative',
                                backgroundColor: 'rgba(0, 255, 0, 0.05)',
                                height: '97%',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                }
                            }}
                        >
                            <iframe
                                src={iframeUrl}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    opacity: isLoading ? 0 : 1,
                                    transition: 'opacity 0.5s ease-out'
                                }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                            />
                        </Box>
                    </Box>

                    {(() => {
                        const helperText = sessionStorage.getItem('helperText');
                        try {
                            const parsedText = helperText ? JSON.parse(helperText) : null;
                            return parsedText && (
                                <Typography sx={{
                                    position: 'absolute',
                                    bottom: '3.75%',
                                    transform: 'translateX(-50%)',
                                    left: '50%',
                                    fontSize: 12,
                                    fontFamily: 'Source Code Pro',
                                    textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                                    textTransform: 'uppercase',
                                    zindex: 1000
                                }}>{parsedText}</Typography>
                            );
                        } catch (e) {
                            return null;
                        }
                    })()}
                </Box>
            </Modal>
        </>
    );
};

export default IframeModal;