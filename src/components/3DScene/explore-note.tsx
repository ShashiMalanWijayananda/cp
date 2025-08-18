import React from "react";

// components
import ShuffleText from "./shuffle-text";

// props
import { ExploreNoteProps } from "../../interfaces/props";

// stylesheet
const shuffleTextStyles = {
    color: '#00ff9b',
    fontSize: 13,
    fontFamily: 'Source Code Pro',
    textTransform: 'uppercase',
    position: 'fixed',
    bottom: '33%',
    left: '50%',
    transform: 'translateX(-50%)',
    bgcolor: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(6px)',
    fontWeight: 500,
    padding: '14px 18px',
    borderRadius: '6px',
    pointerEvents: 'none',
    zIndex: 1,
    textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
}

const getHelperText = (type: string) => {
    switch (type) {
        case "image":
            return "Click to explore";

        case "book":
            return "Click to explore";

        case "audio":
            return "Click to turn on radio";

        case "iframe":
            return "Click to explore";

        case "card":
            return "Click to interact";

        default:
            return "Click to interact";
    }
}

const ExploreNote: React.FC<ExploreNoteProps> = ({ type }) => {
    const helperText = getHelperText(type);

    return (
        <>
            <div id="explore-note">
                <ShuffleText
                    text={helperText as string}
                    sx={shuffleTextStyles}
                    shuffleSpeed={100}
                    characters={helperText as string}
                />
            </div>
        </>
    );
}

export default ExploreNote