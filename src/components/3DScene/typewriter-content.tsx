import React, { useEffect, useState, useRef } from 'react';

// MUI
import { Typography } from '@mui/material';

// props
import { TypewriterContentProps } from '../../interfaces/props';

const TypewriterContent: React.FC<TypewriterContentProps> = ({ content, contentSize, visibilityDelay }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [visibility, setVisibility] = useState<boolean>(false);
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showIndicator, setShowIndicator] = useState<boolean>(true);


    useEffect(() => {
        const visiblityTimeout = setTimeout(() => {
            setVisibility(true);
        }, visibilityDelay);

        return () => {
            clearTimeout(visiblityTimeout);
        }
    }, [])

    useEffect(() => {
        if (visibility) {
            if (currentIndex < content.length) {
                const timer = setTimeout(() => {
                    setDisplayText((prev) => prev + content[currentIndex]);
                    setCurrentIndex((prev) => prev + 1);
                }, 70);

                if (audioRef.current) {
                    audioRef.current.volume = .75;
                    audioRef.current.play();
                }

                return () => clearTimeout(timer);
            } else {
                setShowIndicator(false);
                if (audioRef.current) {
                    audioRef.current.pause();
                }
            }
        }
    }, [currentIndex, content, visibility]);

    return (
        <>
            {visibility && (<>
                <Typography sx={{
                    fontFamily: 'Source Code Pro',
                    color: '#00ff9b',
                    textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                    fontSize: `${contentSize}vw`,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: 1.75,
                    '&::after': {
                        content: showIndicator ? '" ▎ "' : '""',
                        animation: 'blink 1s step-end infinite',
                        opacity: currentIndex < content.length ? 1 : 0,
                    },
                    '@keyframes blink': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0 },
                    },
                }}> {displayText}
                </Typography>

                <audio ref={audioRef} src="/keybaord.mp3" loop></audio>
            </>)}
        </>
    );
};

export default TypewriterContent;
