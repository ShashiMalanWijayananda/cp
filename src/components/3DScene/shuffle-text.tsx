import React, { useEffect, useState } from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface ShuffleTextProps extends Omit<TypographyProps, 'children'> {
    text: string;
    shuffleSpeed?: number;
    characters?: string;
}

const ShuffleText: React.FC<ShuffleTextProps> = ({ 
    text, 
    shuffleSpeed = 70,
    characters = 'ABCDEFGH@#$%^&*()UVWXYZ1234567890!@#$%^&*()_+',
    ...typographyProps 
}) => {
    const [displayText, setDisplayText] = useState(text);

    const shuffleString = (str: string) => {
        return str
            .split('')
            .map(char => 
                char === ' ' ? ' ' : characters[Math.floor(Math.random() * characters.length)]
            )
            .join('');
    };

    useEffect(() => {
        let shuffleInterval: number;
        let animationTimeout: number;
        let isAnimating = false;

        const shuffleStep = (iteration: number) => {
            if (iteration >= 10) {
                setDisplayText(text); // Return to original text
                isAnimating = false;
                return;
            }

            setDisplayText(shuffleString(text));
            animationTimeout = window.setTimeout(() => {
                shuffleStep(iteration + 1);
            }, shuffleSpeed);
        };

        const startShuffling = () => {
            if (isAnimating) return;
            isAnimating = true;
            shuffleStep(0);
        };

        // Start the main interval that triggers shuffling every 5 seconds
        shuffleInterval = window.setInterval(() => {
            startShuffling();
        }, 8000);

        // Initial shuffle
        startShuffling();

        // Initial shuffle
        startShuffling();

        return () => {
            window.clearInterval(shuffleInterval);
            window.clearTimeout(animationTimeout);
        };
    }, [text, shuffleSpeed, characters]);

    return (
        <Typography {...typographyProps}>
            {displayText}
        </Typography>
    );
};

export default ShuffleText;
