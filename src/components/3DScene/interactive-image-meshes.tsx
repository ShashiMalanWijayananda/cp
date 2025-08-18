import React from "react";

// components
import InteractiveMesh from "./interactive-mesh";

// props
import { InteractiveImageMeshesProps } from "../../interfaces/props";

const InteractiveImageMeshes: React.FC<InteractiveImageMeshesProps> = ({ setOpen, setShowProximityText }) => {
    return (
        <>
            {/* Baker Plunger Type Dial Gauge */}
            <InteractiveMesh
                position={[-3.35, 1.325, 5.8]}
                scale={[1, .6, .9]}
                rotation={[0, 0, 0]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Baker Plunger Type Dial Gauge"
                assetFileName="Capture5.webp" />

            {/* Welding Blowpipe */}
            <InteractiveMesh
                position={[-3.35, 1.4, 4.93]}
                scale={[1, .45, .65]}
                rotation={[0, 0, 0]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Welding Blowpipe Guide"
                assetFileName="Capture7.webp" />

            <InteractiveMesh
                position={[-3.35, .88, 4.94]}
                scale={[1, .5, .65]}
                rotation={[0, 0, 0]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="External Micrometer Guide"
                assetFileName="Capture6.webp" />

            {/* large bp image */}
            <InteractiveMesh
                position={[-3.35, 1.8, 2.18]}
                scale={[1, 1.5, 2.78]}
                rotation={[0, 0, 0]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Submarine Blueprint 001"
                assetFileName="Capture4.webp" />

            {/* welder knowledge image */}
            <InteractiveMesh
                position={[-3.35, 1.72, 4.18]}
                scale={[1, .75, .5]}
                rotation={[0, 0, 0]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Welder Knowledge Guide"
                assetFileName="Capture8.webp" />

            {/* Edge Preparations */}
            <InteractiveMesh
                position={[-3.35, 1.9, -.7]}
                scale={[1, .75, .5]}
                rotation={[0, 0, 0]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Edge Preparations Guide"
                assetFileName="Capture18.webp" />

            {/* calender */}
            <InteractiveMesh
                position={[-3.35, 1.9, -1.66]}
                scale={[1, .75, .5]}
                rotation={[0, 0, 0]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Calendar - 1994 September"
                assetFileName="Capture11.webp" />

            {/* front wall */}
            {/* Safety Precautions */}
            <InteractiveMesh
                position={[-1.7, 2.25, -3.1]}
                scale={[.4, .6, .5]}
                rotation={[0, 0, 0.04]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Safety Precautions Guide"
                assetFileName="Capture16.webp" />

            {/* Power Of Silence Poster */}
            <InteractiveMesh
                position={[-.7, 2.15, -3.1]}
                scale={[.6, .75, .5]}
                rotation={[0, 0, 0]} setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Power Of Silence [Poster]"
                assetFileName="Capture17.webp" />

            {/* map board */}
            <InteractiveMesh
                position={[-3, 1.95, -3.2]}
                rotation={[0, .68, 0]}
                scale={[.75, .8, 1]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Strategy Board"
                assetFileName="Capture15.webp" />

            {/* right wall assets */}
            {/* large bp image */}
            <InteractiveMesh
                position={[6.07, 2.75, -0.38]}
                scale={[.2, 1.6, 2.78]}
                rotation={[0, 0, 0]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Submarine Blueprint - 002"
                assetFileName="Capture3.webp" />

            <InteractiveMesh
                position={[6.07, 1.45, 4.53]}
                scale={[.2, .76, .51]}
                rotation={[0, 0, 0]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Maintenance Chart"
                assetFileName="Capture12.webp" />

            <InteractiveMesh
                position={[6.07, 1.65, 5.25]}
                scale={[.2, .46, .51]}
                rotation={[0, 0, 0]}
                setOpen={setOpen}
                onNearby={setShowProximityText}
                assetName="Maintenance Checklist"
                assetFileName="Capture13.webp" />
        </>
    )
}

export default InteractiveImageMeshes