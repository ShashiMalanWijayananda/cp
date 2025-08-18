import React from 'react';
import { InteractiveCardMeshesProps } from '../../interfaces/props';
import InteractiveCardMesh from './interactive-card-mesh';

const InteractiveCardMeshes: React.FC<InteractiveCardMeshesProps> = ({
    setOpenCardSelection,
    setShowCardProximityText
}) => {
    return (
        <>
            <InteractiveCardMesh
                position={[-.38, .97, -2.7]}
                scale={[.35, .55, .35]}
                rotation={[0, 0, 0]}
                setOpenCardSelection={setOpenCardSelection}
                onNearby={setShowCardProximityText}
            />

            {/* <mesh position={[-.38, .97, -2.7]}
                scale={[.35, .55, .35]}
                rotation={[0, 0, 0]}>
                <boxGeometry />
                <meshBasicMaterial wireframe color="yellow" />
            </mesh> */}
        </>
    );
};

export default InteractiveCardMeshes;
