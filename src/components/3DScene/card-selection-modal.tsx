import React, { useState, useEffect, useCallback } from 'react';

import { CardSelectionModalProps } from '../../interfaces/props';

// MUI
import { Modal, Box, Button } from '@mui/material';

// components
import ShuffleText from './shuffle-text';
import {IAConcert, IAPIResponse} from "../../interfaces/data.interfaces";
import {useLogin} from "../../context/login.context";
import {ADD_CONCERT_ARCHIVE, GET_PUZZLE_RESOLVER} from "../../graphql/queries";
import {useMutation, useQuery} from "@apollo/client";
import TypewriterContent from "./typewriter-content";
import PointerCrossLines from "./pointer-cross-lines";
import PointerCoords from "./pointer-coords";

// Correct sequence for the cards
const CORRECT_SEQUENCE = [3, 2, 1, 5, 4];
const SEQUENCE_LENGTH = 5;

const cardList = Array.from({ length: 25 }, (_, i) => ({
    number: i + 1,
    image: `Icon-${String(i + 1).padStart(2, '0')}.png`
}));

const CardSelectionModal: React.FC<CardSelectionModalProps> = ({ open, onClose }) => {
    const [selectedSequence, setSelectedSequence] = useState<number[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [wasFullscreen, setWasFullscreen] = useState(false);
    const [cardOrder, setCardOrder] = useState(cardList);
    const [complete, setComplete] = useState<boolean>(false);
    const {user} = useLogin();
    const [puzzlesResult, setPuzzleResult] = useState<boolean>(false);

    const [addConcert, {data: addedResponse, loading: loading, error: addError}] = useMutation(ADD_CONCERT_ARCHIVE);

    const {data: puzzleResponse, loading: puzzleLoading, error: puzzleError, refetch} = useQuery(GET_PUZZLE_RESOLVER, {
        variables: {contact: user?.contact},
        skip: !user?.contact,
        fetchPolicy: 'network-only'
    });

    React.useEffect(() => {
        const response = puzzleResponse?.validatePuzzleResolved as IAPIResponse;
        if (response?.code === "CODE-900") {
            const concerts: IAConcert[] = response?.data;
            const isPuzzleResult = concerts?.filter((concert)=> concert.type ==="puzzle")?.length > 0
            setPuzzleResult(isPuzzleResult)
        }
    }, [puzzleResponse])

    React.useEffect(() => {
        const response = addedResponse?.addToArchiveConcert as IAPIResponse;
        if (response?.code === "CODE-3003") {
            refetch();
        }
    }, [addedResponse])


    // Define keyframes style
    React.useEffect(() => {
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
            @keyframes scanline {
                0% {
                    transform: translateY(-100%);
                }
                100% {
                    transform: translateY(100%);
                }
            }
            @keyframes staticNoise {
                0% { transform: translateX(-1px) }
                25% { transform: translateX(1px) }
                50% { transform: translateX(-0.5px) }
                75% { transform: translateX(0.5px) }
                100% { transform: translateX(-1px) }
            }
            @keyframes imageReveal {
                0% {
                    opacity: 0;
                    filter: saturate(0%) sepia(30%) saturate(1000%) hue-rotate(80deg) contrast(1.2) brightness(1.1) blur(10px);
                    transform: scale(0.95);
                }
                50% {
                    opacity: 0.7;
                    filter: saturate(0%) sepia(30%) saturate(1000%) hue-rotate(80deg) contrast(1.2) brightness(1.1) blur(5px);
                    transform: scale(1.02);
                }
                100% {
                    opacity: 1;
                    filter: saturate(0%) sepia(30%) saturate(1000%) hue-rotate(80deg) contrast(1.2) brightness(1.1) blur(0);
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
        return () => style.remove();
    }, []);

    // Initialize or shuffle cards
    useEffect(() => {
        if (open) {
            sessionStorage.setItem('anImageModalIsOPened', JSON.stringify(true));
            shuffleCards();
        }
    }, [open]);

    // Fix: Only clear error after shuffle, not immediately
    const shuffleCards = useCallback((clearError = true) => {
        const shuffled = [...cardList];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setCardOrder(shuffled);
        setSelectedSequence([]);
        if (clearError) setErrorMessage('');
    }, [cardList]);

    // Track fullscreen state and handle pointer lock when modal opens
    useEffect(() => {
        if (open) {
            const doc = document as any;
            setWasFullscreen(
                !!(doc.fullscreenElement ||
                    doc.webkitFullscreenElement ||
                    doc.mozFullScreenElement ||
                    doc.msFullscreenElement)
            );

            // Exit pointer lock to show cursor
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }

            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleModalClose = useCallback(() => {
        requestAnimationFrame(async () => {
            try {
                // window.dispatchEvent(new CustomEvent('movePlayerBack', {
                //     detail: { distance: 1 }
                // }));

                setTimeout(async () => {
                    if (wasFullscreen) {
                        await document.documentElement.requestFullscreen().catch(console.error);
                    }
                    const canvas = document.querySelector('canvas');
                    if (canvas) {
                        canvas.requestPointerLock();
                    }
                }, 100);
            } catch (err) {
                console.error('Error restoring controls:', err);
            } finally {
                sessionStorage.setItem('anImageModalIsOPened', JSON.stringify(false));

                // const turnEvent = new CustomEvent('turnPlayerAround', { detail: { angle: 270 } });
                // window.dispatchEvent(turnEvent);

                onClose();
            }
        });
    }, [wasFullscreen, onClose]);

    // Handle keyboard events
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'q' || event.key === 'Q') {
                handleModalClose();
                sessionStorage.setItem('anImageModalIsOPened', JSON.stringify(false));
                const turnEvent = new CustomEvent('turnPlayerAround', { detail: { angle: -50 } });
                window.dispatchEvent(turnEvent);
            }
        };

        if (open) {
            window.addEventListener('keydown', handleKeyPress);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [open, handleModalClose]);

    return (
        <Modal
            open={open}
            onClose={handleModalClose}
            disableEscapeKeyDown={true}
            aria-labelledby="card-selection-modal"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <Box id="card-selection-modal"
                sx={{
                    position: 'relative',
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#000',
                    // p: { xs: 2, sm: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    outline: 'none',
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(32, 255, 77, .05) 25%, rgba(32, 255, 77, .05) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .05) 75%, rgba(32, 255, 77, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 255, 77, .05) 25%, rgba(32, 255, 77, .05) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .05) 75%, rgba(32, 255, 77, .05) 76%, transparent 77%, transparent)',
                    backgroundSize: '50px 50px',
                    overflow: 'auto',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE and Edge
                    '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari, Opera
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
                    },
                }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    padding: '1rem',
                }}>
                    <ShuffleText
                        text="[Master Vault] Select Image Sequence to Unlock"
                        sx={{
                            color: '#00ff9b',
                            fontSize: '1.05vw',
                            fontWeight: 500,
                            fontFamily: 'Source Code Pro',
                            textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                            textTransform: 'uppercase'
                        }}
                        shuffleSpeed={150}
                        characters="[Master Vault] Select Image Sequence to Unlock"
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {!complete && (
                            <>
                                <Button
                                    onClick={() => { shuffleCards() }}
                                    sx={{
                                        color: '#00ff9b',
                                        border: '1px solid rgba(0, 255, 155, 0.65)',
                                        fontFamily: 'Source Code Pro',
                                        letterSpacing: '1px',
                                        p: 2,
                                        pl: 3,
                                        pr: 3,
                                        textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                                        height: '2.7vw',
                                        fontSize: '.78vw',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 255, 155, 0.1)',
                                            boxShadow: '0 0 15px rgba(0, 255, 155, 0.3)'
                                        }
                                    }}
                                >
                                    reset
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (selectedSequence.length !== SEQUENCE_LENGTH) {
                                            setErrorMessage(`SELECT EXACTLY ${SEQUENCE_LENGTH} CARDS IN ORDER`);
                                            return;
                                        }
                                        const isCorrect = selectedSequence.every((num, idx) => num === CORRECT_SEQUENCE[idx]);
                                        if (isCorrect) {
                                            const resolver: IAConcert = {
                                                name: `${user?.firstName} ${user?.lastName}`,
                                                nic: `${user?.nic ?? ""}`,
                                                concert: "yogeshwari",
                                                contactNumber: `${user?.contact}`,
                                                userId: `${user?.id}`,
                                                type: "puzzle"
                                            }
                                            addConcert({variables: {concert: resolver}})
                                                .then((result) => {
                                                    console.log('Success:', result.data);
                                                })
                                                .catch((error) => {
                                                    console.error('Error:', error);
                                                });
                                            setComplete(true);
                                            setTimeout(() => {

                                                // const turnEvent = new CustomEvent('turnPlayerAround', { detail: { angle: 270 } });
                                                // window.dispatchEvent(turnEvent);

                                                onClose();
                                            }, 1000 * 25);
                                        } else {
                                            setErrorMessage('INCORRECT IMAGE SEQUENCE');
                                            setTimeout(() => {
                                                setErrorMessage('');
                                            }, 1000 * 2);

                                            setTimeout(() => {
                                                shuffleCards(false);
                                            }, 500);
                                        }
                                    }}
                                    sx={{
                                        color: '#00ff9b',
                                        border: '1px solid rgba(0, 255, 155, 0.65)',
                                        fontFamily: 'Source Code Pro',
                                        letterSpacing: '1px',
                                        p: 2,
                                        pl: 3,
                                        pr: 3,
                                        height: '2.7vw',
                                        fontSize: '.78vw',
                                        textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 255, 155, 0.1)',
                                            boxShadow: '0 0 15px rgba(0, 255, 155, 0.3)'
                                        }
                                    }}
                                >
                                    confirm
                                </Button>
                            </>
                        )}
                        <Button onClick={() => {
                            sessionStorage.setItem('anImageModalIsOPened', JSON.stringify(false));

                            const turnEvent = new CustomEvent('turnPlayerAround', { detail: { angle: -50 } });
                            window.dispatchEvent(turnEvent);

                            onClose();
                        }}
                            sx={{
                                color: '#00ff9b',
                                border: '1px solid rgba(0, 255, 155, 0.65)',
                                fontFamily: 'Source Code Pro',
                                letterSpacing: '1px',
                                p: 2,
                                pl: 3,
                                pr: 3,
                                height: '2.7vw',
                                fontSize: '.78vw',
                                textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 255, 155, 0.1)',
                                    boxShadow: '0 0 15px rgba(0, 255, 155, 0.3)'
                                },
                                // pointerEvents: 'none'
                            }}>
                            Close [PRESS Q]
                        </Button>
                    </Box>
                </Box>

                <Box sx={{
                    width: '100%',
                    height: 'calc(100% - 110px)',
                    backgroundColor: 'none',
                    position: 'relative',
                    mt: -3,
                    overflow: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}>
                    <Box sx={{ display: '' }}>
                        {errorMessage && (
                            <ShuffleText
                                text={errorMessage}
                                sx={{
                                    color: 'orangered',
                                    fontSize: 18,
                                    fontFamily: 'Source Code Pro',
                                    textShadow: '0 0 4px orangered, 0 0 8px orangered',
                                    textTransform: 'uppercase',
                                    textAlign: 'center',
                                    mb: 5
                                }}
                                shuffleSpeed={100}
                                characters={errorMessage} />
                        )}

                {!puzzlesResult ? (
                            <>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    mb: 4,
                                    justifyContent: 'center',
                                    borderRadius: '4px'
                                }}>
                                    {selectedSequence.map((num, idx) => {
                                        const card = cardList.find(c => c.number === num);
                                        return (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    border: '1px solid #00ff9b',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'rgba(0, 255, 155, 0.1)',
                                                    position: 'relative',
                                                    '&::after': {
                                                        content: `"${idx + 1}"`,
                                                        position: 'absolute',
                                                        top: '-25px',
                                                        color: '#00ff9b',
                                                        fontSize: '0.9rem',
                                                        fontFamily: 'Source Code Pro'
                                                    }
                                                }}
                                            >
                                                {card && (
                                                    <img
                                                        src={`/cards/${card.image}`}
                                                        style={{
                                                            width: '80%',
                                                            height: '80%',
                                                            objectFit: 'contain',
                                                            filter: 'brightness(0) saturate(100%) invert(70%) sepia(100%) saturate(1000%) hue-rotate(80deg) brightness(1.5)',
                                                            mixBlendMode: 'screen',
                                                        }}
                                                        alt={`Card ${card.number}`}
                                                    />
                                                )}
                                            </Box>
                                        );
                                    })}
                                    {Array.from({ length: SEQUENCE_LENGTH - selectedSequence.length }).map((_, idx) => (
                                        <Box
                                            key={`empty-${idx}`}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                border: '1px dashed rgba(0, 255, 155, 0.65)',
                                                position: 'relative',
                                                '&::after': {
                                                    content: `"${selectedSequence.length + idx + 1}"`,
                                                    position: 'absolute',
                                                    top: '-25px',
                                                    color: 'rgba(0, 255, 155, 0.3)',
                                                    fontSize: '0.9rem',
                                                    fontFamily: 'monospace'
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>

                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: { xs: 2, sm: 3 },
                                    width: '38vw',
                                    margin: '0 auto',
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    borderRadius: '8px',
                                    animation: 'gridReveal 1s ease-out'
                                }}>
                                    {cardOrder.map((item, i) => (
                                        <Box
                                            key={i}
                                            onClick={() => {
                                                if (selectedSequence.includes(item.number)) {
                                                    setErrorMessage('CARD ALREADY SELECTED');
                                                    return;
                                                }
                                                if (selectedSequence.length >= SEQUENCE_LENGTH) {
                                                    setErrorMessage(`MAXIMUM ${SEQUENCE_LENGTH} CARDS ALLOWED`);
                                                    return;
                                                }
                                                setSelectedSequence(prev => [...prev, item.number]);
                                                setErrorMessage('');
                                            }}
                                            sx={{
                                                aspectRatio: 1,
                                                backgroundColor: selectedSequence.includes(item.number) ? 'rgba(0, 255, 155, 0.2)' : 'rgba(0, 0, 0, 0.8)',
                                                border: '1px solid rgba(0, 255, 155, .4)',
                                                cursor: 'none',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                overflow: 'hidden', // for CRT overlay
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 255, 155, 0.1)',
                                                    boxShadow: '0 0 20px rgba(0, 255, 155, 0.4)',
                                                    zIndex: 1
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    pointerEvents: 'none',
                                                    background: `repeating-linear-gradient(
                                        to bottom,
                                        rgba(0,0,0,0.12) 0px,
                                        rgba(0,0,0,0.12) 1px,
                                        transparent 2px,
                                        transparent 4px
                                    )`,
                                                    opacity: 0.45,
                                                    zIndex: 2,
                                                },
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    pointerEvents: 'none',
                                                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.25) 100%)',
                                                    zIndex: 3,
                                                },
                                                boxShadow: '0 0 16px 2px #00ff9b44, 0 0 0 2px #00ff9b22',
                                            }}
                                        >
                                            <img
                                                src={`/cards/${item.image}`}
                                                style={{
                                                    width: '65%',
                                                    // height: '60%',
                                                    objectFit: 'contain',
                                                    filter: 'brightness(0) saturate(100%) invert(70%) sepia(100%) saturate(1000%) hue-rotate(80deg) brightness(1.5) drop-shadow(0 0 6px #00ff9b88) blur(0.2px)',
                                                    mixBlendMode: 'screen',
                                                    zIndex: 4,
                                                }}
                                                alt={`Card ${item.number}`}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box sx={{
                                    position: 'absolute',
                                    transform: 'translate(-50%, -50%)',
                                    top: '50%',
                                    left: '50%',
                                    zIndex: 2,
                                }}>
                                    <Box sx={{
                                        mt: 4,
                                        textAlign: 'center',
                                    }}>
                                        <img style={{
                                            width: '20%',
                                            filter: 'saturate(0%) sepia(30%) saturate(1000%) hue-rotate(80deg) contrast(1.2) brightness(1.1)',
                                            animation: 'imageReveal 1.5s ease-in-out',
                                            boxShadow: '0 0 15px rgba(0, 255, 155, 0.3)',
                                            border: '1px solid rgba(0, 255, 155, 0.2)',
                                            opacity: 1
                                        }} src="/badges/code-breaker-badge_low.webp" alt="" />
                                    </Box>

                                    <Box sx={{ mt: 4 }}>
                                        <TypewriterContent
                                            visibilityDelay={1000}
                                            // vw - size format
                                            contentSize='1.5'
                                            content="[ MISSION SUCCESS ]" />
                                    </Box>

                                    <Box sx={{ mt: 3 }}>
                                        <TypewriterContent
                                            visibilityDelay={3000}
                                            // vw - size format
                                            contentSize='1'
                                            content="You've done the almost impossible! Your outstanding intelligence and dedication have truly shone through." />
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <TypewriterContent
                                            visibilityDelay={11500}
                                            // vw - size format
                                            contentSize='1'
                                            content="For this incredible feat, you are awarded the Badge of the Master Codebreaker. Wear and share this badge with immense pride !" />
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>

                    <PointerCoords />
                    <PointerCrossLines />
                </Box>
            </Box>
        </Modal >
    );
};

export default CardSelectionModal;
