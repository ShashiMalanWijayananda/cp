import React, {useCallback, useEffect, useRef, useState} from 'react';

// MUI
import {Box, Button, Typography} from '@mui/material';

// components
import ShuffleText from './shuffle-text';
import PointerCoords from './pointer-coords';
import PointerCrossLines from './pointer-cross-lines';

// props
import {InstructionsModalProps} from '../../interfaces/props';
import {useNavigate} from "react-router-dom";

const objectivesList: string[] = [
    "TARGET - A vintage computer / FTP server holds secrets locked away since 1996, protected by a unique symbol code.",
    "INTEL - All decryption keys and critical data fragments are embedded within your immediate operational environment.",
    "STATERGY - Every piece of the puzzle you need to crack this code is hidden within your surroundings. Take your time.",
    "REWARD - Successful decryption will result in the immediate issuance of a badge of achievement. "
]

const playerControlList: string[] = [
    "W A S D - Controls Movement (W - Forward, A - Left, S - Back, D - Right)",
    "MOUSE - Look Around",
    "Left Click - Interact with objects",
    "ESC - Open Main menu / Exit menu",
    "TAB - Graphics Quality Settings",
    "Q - Close inspector screen"
]

const SceneMenu: React.FC<InstructionsModalProps> = ({ onClose, visible }) => {
    if (!visible) return null;
    const navigate = useNavigate();
    const handleClose = useCallback(() => {
        onClose();
        // const moveBackEvent = new CustomEvent('movePlayerBack', {
        //     detail: { distance: 2 }
        // });
        // window.dispatchEvent(moveBackEvent);

        const turnEvent = new CustomEvent('turnPlayerAround', {detail: {angle: -30}});
        window.dispatchEvent(turnEvent);
    }, [onClose]);

    // Show cursor and exit pointer lock when modal is visible
    useEffect(() => {
        if (visible) {
            // Exit pointer lock if active
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
            // Show cursor
            document.body.style.cursor = 'auto';
        } else {
            document.body.style.cursor = '';
        }
    }, [visible, onClose]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'q' || event.key === 'Q') {
                onClose();

                // const turnEvent = new CustomEvent('turnPlayerAround', { detail: { angle: -30 } });
                // window.dispatchEvent(turnEvent);
            }
        }

        if (visible) {
            window.addEventListener('keydown', handleKeyPress);
        }

        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [visible])

    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSceneMusicMuted, setIsSceneMusicMuted] = useState<boolean>(
        JSON.parse(sessionStorage.getItem('isSceneMusicMuted') || "false")
    );

    useEffect(() => {
        // Set loading to false after a delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Simulate terminal logs
    useEffect(() => {
        const messages = [
            "Initializing WebGL context...",
            "Loading shader programs [vertex/fragment]...",
            "Compiling PBR materials...",
            "Initializing physics engine...",
            "Loading mesh geometries...",
            "Setting up post-processing pipeline...",
            "Configuring shadow maps [2048x2048]...",
            "Initializing particle systems...",
            "Setting up ambient occlusion...",
            "Loading environment maps...",
            "Configuring bloom effect...",
            "Setting up HDR pipeline...",
            "Initializing raycaster...",
            "Setting up skeletal animations...",
            "Loading texture atlases...",
            "Configuring depth buffer...",
            "Setting up normal maps...",
            "Initializing GPU buffers...",
            "Loading skinned meshes...",
            "Setting up frustum culling..."
        ];

        const engineStats = [
            "FPS: 60 | Draw calls: 245",
            "Memory usage: 512MB | VRAM: 1.2GB",
            "Triangles: 2.5M | Vertices: 4.8M",
            "Active lights: 8 | Shadows: enabled",
            "Textures loaded: 64 | Buffers: 128"
        ];

        const addLog = () => {
            let minutes: any = new Date().getMinutes();
            if (minutes < 10) {
                minutes = "0" + minutes;
            }

            let seconds: any = new Date().getSeconds();
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            const timestamp = minutes + ":" + seconds;
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const randomStats = engineStats[Math.floor(Math.random() * engineStats.length)];
            const components = ['Renderer', 'Shader', 'Physics', 'Memory', 'Scene', 'Lighting', 'Material'];
            const randomComponent = components[Math.floor(Math.random() * components.length)];

            setLogs(prev => {
                const newLogs = [
                    ...prev,
                    `[${timestamp}] engine: ${randomMessage}`,
                    `[${timestamp}] ${randomComponent}_Manager: ${randomStats}`,
                ].slice(-50);
                return newLogs;
            });
        };

        // Initial logs
        addLog();
        addLog();
        addLog();

        // Continue adding logs
        const interval = setInterval(addLog, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box id="scene-manu-wrapper"
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100%',
                maxHeight: '100vh',
                backgroundColor: 'rgb(0, 15, 0)',
                backgroundImage: 'linear-gradient(rgba(0, 255, 155, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 155, 0.03) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                zIndex: 1000,
                color: '#00ff9b',
                fontFamily: 'monospace',
                padding: { xs: '8px', sm: '12px', md: '20px' },
                boxSizing: 'border-box',
                overflow: 'hidden',
                WebkitOverflowScrolling: 'touch',

                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 155, 0.1) 3px, transparent 4px),
                                    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 255, 155, 0.1) 3px, transparent 4px)`,
                    backgroundSize: '40px 40px',
                    animation: isLoading ? 'gridReveal 1s ease-out' : 'none',
                    pointerEvents: 'none',
                },
                '@keyframes gridReveal': {
                    '0%': {
                        transform: 'scale(2)',
                        opacity: 1,
                        backgroundSize: '80px 80px'
                    },
                    '100%': {
                        transform: 'scale(1)',
                        opacity: 0.3,
                        backgroundSize: '40px 40px'
                    }
                },
                '& > *': {
                    opacity: isLoading ? 0 : 1,
                    animation: isLoading ? 'none' : 'fadeIn 0.5s ease-out forwards',
                    transition: 'opacity 0.3s ease-out'
                },
                '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                },
            }}>

            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                height: '3vw',
                // border: '1px solid red'
            }}>
                <ShuffleText
                    text="OPERATION MANUAL / PLAYER GUIDELINE"
                    sx={{
                        color: '#00ff9b',
                        fontSize: '1.05vw',
                        fontFamily: 'Source Code Pro',
                        textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                        textTransform: 'uppercase'
                    }}
                    shuffleSpeed={160}
                    characters="OPERATION MANUAL / PLAYER GUIDELINE"
                />
                <Box>
                    <Button
                        onClick={() => {
                            sessionStorage.setItem('audioTriggerClicked', JSON.stringify(true));
                            if (sessionStorage.getItem('audioTriggerClicked')) {
                                if (isSceneMusicMuted) {
                                    setIsSceneMusicMuted(false);
                                    sessionStorage.setItem('isSceneMusicMuted', JSON.stringify(false));
                                }
                                else {
                                    setIsSceneMusicMuted(true);
                                    sessionStorage.setItem('isSceneMusicMuted', JSON.stringify(true));
                                }
                            }
                        }}
                        sx={{
                            backgroundColor: 'transparent',
                            color: '#00ff9b',
                            border: '1px solid rgba(0, 255, 155, .75)',
                            padding: '10px 30px',
                            cursor: 'pointer',
                            fontSize: '.78vw',
                            letterSpacing: '1.25px',
                            height: '2.7vw',
                            fontFamily: 'Source Code Pro',
                            textTransform: 'uppercase',
                            mr: 1.5,
                            textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                            width: 'auto',
                            pl: 2,
                            pr: 2,
                            transition: 'all .15s linear'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 155, 0.1)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 155, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                        }}>
                        Sound {isSceneMusicMuted ? "On" : "Off"}
                    </Button>
                    <Button
                        onClick={() => {
                            navigate("/menu", {replace: true})
                        }}
                        sx={{
                            backgroundColor: 'transparent',
                            color: '#00ff9b',
                            border: '1px solid rgba(0, 255, 155, .75)',
                            textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                            padding: '10px 30px',
                            cursor: 'pointer',
                            fontSize: '.78vw',
                            letterSpacing: '1.25px',
                            height: '2.7vw',
                            fontFamily: 'Source Code Pro',
                            textTransform: 'uppercase',
                            mr: 1.5,
                            width: 'auto',
                            pl: 2,
                            pr: 2,
                            transition: 'all .15s linear'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 155, 0.1)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 155, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                        }}>
                        MAIN MENU ➤
                    </Button>
                    <Button
                        onClick={handleClose}
                        sx={{
                            backgroundColor: 'transparent',
                            color: '#00ff9b',
                            border: '1px solid rgba(0, 255, 155, .75)',
                            textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                            padding: '10px 30px',
                            cursor: 'pointer',
                            fontSize: '.78vw',
                            letterSpacing: '1.25px',
                            height: '2.7vw',
                            fontFamily: 'Source Code Pro',
                            // pb: 1.75,
                            textTransform: 'uppercase',
                            width: 'auto',
                            pl: 2,
                            pr: 2,
                            transition: 'all .15s linear'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 255, 155, 0.1)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 155, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Back to Experience ➤
                    </Button>
                </Box>
            </Box>

            <Box sx={{
                position: 'relative',
                height: 'calc(100% - 4vw)',
                mt: 2,
                width: '100%',
            }}>
                {/* left  side */}
                <Box sx={{
                    position: 'absolute',
                    width: '60%',
                    height: '100%',
                    left: 0,
                    top: 0,
                    overflow: 'auto',
                    border: '1px solid rgba(0, 255, 155, .55)',
                    backgroundColor: 'rgba(0, 15, 0, 0.8)',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE and Edge
                    '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari, Opera
                }}>
                    {/* Mission Objectives Section */}
                    <Box sx={{
                        padding: '20px',
                        height: '45%',
                        overflow: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                    }}>
                        <Typography sx={{
                            color: '#00ff9b',
                            margin: '0 0 15px 0',
                            fontSize: '.9vw',
                            letterSpacing: '1px',
                            borderBottom: '1px solid rgba(0, 255, 155, .75)',
                            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                            paddingBottom: '12px',
                            textTransform: 'uppercase',
                            fontFamily: 'Source Code Pro',
                        }}>Objectives - Interactions</Typography>

                        <Box style={{ paddingTop: 1 }}>
                            {objectivesList.map((item, index) => (
                                <Box key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                    <Typography
                                        sx={{
                                            margin: '8px 0',
                                            fontFamily: 'Source Code Pro',
                                            fontSize: '.78vw',
                                            textShadow: '0 0 1px #00ff9b, 0 0 8px #00ff9b',
                                        }}>+ &nbsp;</Typography>
                                    <Typography
                                        sx={{
                                            margin: '8px 0',
                                            fontFamily: 'Source Code Pro',
                                            fontSize: '.78vw',
                                            textTransform: 'uppercase',
                                            textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                        }}>{item}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{
                        borderTop: '1px solid rgba(0, 255, 155, .55)',
                        padding: '20px',
                        height: '45%',
                        overflow: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                    }}>
                        <ShuffleText
                            text="PLAYER CONTROLS"
                            sx={{
                                color: '#00ff9b',
                                margin: '0 0 15px 0',
                                fontSize: '.9vw',
                                letterSpacing: '1px',
                                borderBottom: '1px solid rgba(0, 255, 155, .75)',
                                paddingBottom: '12px',
                                fontFamily: 'Source Code Pro',
                                textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                textTransform: 'upppercase'
                            }}
                            shuffleSpeed={150}
                            characters="PLAYER CONTROLS" />

                        <Box style={{ paddingTop: 1 }}>
                            {playerControlList.map((item, index) => (
                                <Typography
                                    key={index}
                                    sx={{
                                        margin: '8px 0',
                                        fontFamily: 'Source Code Pro',
                                        fontSize: '.78vw',
                                        textTransform: 'uppercase',
                                        textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                    }}>+&nbsp;&nbsp;{item}</Typography>

                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* right  side */}
                <Box sx={{
                    position: 'absolute',
                    width: '40%',
                    background: 'none',
                    height: '100%',
                    right: 0,
                    top: 0,
                    overflow: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                    border: '1px solid rgba(0, 255, 155, .55)',
                }}>
                    <Box sx={{
                        padding: '20px',
                        backgroundColor: 'rgba(0, 15, 0, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'calc(100% - 0px)',
                        overflow: 'hidden',
                        fontFamily: 'Source Code Pro',
                    }}>
                        <ShuffleText
                            text="SYSTEM MONITOR - LIVE FEED"
                            sx={{
                                color: '#00ff9b',
                                margin: '0 0 15px 0',
                                paddingBottom: '12px',
                                letterSpacing: '1px',
                                borderBottom: '1px solid rgba(0, 255, 155, .75)',
                                fontFamily: 'Source Code Pro',
                                textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                fontSize: '.9vw',
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
                                textShadow: '0 0 1px #00ff9b, 0 0 8px #00ff9b',
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
                                textTransform: 'uppercase',
                                textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                            }}>CURRENT TIME: {new Date().toLocaleTimeString()}</Typography>
                        </Box>

                        <Box sx={{
                            flex: 1,
                            overflowY: 'hidden',
                            fontSize: '15px',
                            backgroundColor: 'rgba(0, 15, 0, 0.7)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Box sx={{
                                flex: 1,
                                overflow: 'hidden',
                                position: 'relative',
                                '::-webkit-scrollbar': { display: 'none' },
                                '-ms-overflow-style': 'none',
                                'scrollbarWidth': 'none',
                            }}>
                                {logs.map((log, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            margin: '5px 0',
                                            animation: 'fadeIn 0.3s ease-in-out',
                                            color: index === logs.length - 1 ? '#00ff9b' : 'rgba(0, 255, 155, .6)',
                                            fontFamily: 'Source Code Pro',
                                            whiteSpace: 'pre-wrap',
                                            fontSize: '.78vw',
                                            textTransform: 'uppercase',
                                            textShadow: '0 0 2px #00ff9b, 0 0 8px #00ff9b',
                                        }}>{log}
                                    </Box>
                                ))}
                                <Box ref={logsEndRef} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <PointerCoords bottomMargin='3%' />
            <PointerCrossLines />
        </Box >
    );
};

export default SceneMenu;
