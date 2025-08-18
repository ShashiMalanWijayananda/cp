import React from "react";

// components
import InteractiveAudioMesh from "./interactive-audio-mesh";

// props
import { InteractiveAudioMeshesProps } from "../../interfaces/props";

const InteractiveAudioMeshes: React.FC<InteractiveAudioMeshesProps> = ({ setShowAudioProximityText }) => {
    return (
        <>
            {/* Replace mesh in low-poly-view */}
            <InteractiveAudioMesh
                position={[-2.64, 1.12, -1.7]}
                scale={[.45, .45, .45]}
                rotation={[0, 0, 0]}
                audioName="Audio Trigger 1"
                audioFileName="audio1.mp3"
                onNearby={setShowAudioProximityText}
            />

            {/* Add more audio triggers here */}
        </>
    );
};

export default InteractiveAudioMeshes;
