import React, { useEffect, useRef } from "react";

// r3f
import { PositionalAudio } from "@react-three/drei";
import * as THREE from 'three';

const ScenePositionalAudio: React.FC = () => {
    const ref = useRef<THREE.PositionalAudio | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const isAudioTriggerClicked = JSON.parse(sessionStorage.getItem('audioTriggerClicked') || 'false');
            const isSceneMusicMuted = JSON.parse(sessionStorage.getItem('isSceneMusicMuted') || 'true');
            const volume = isSceneMusicMuted ? 0 : 1
            if (isAudioTriggerClicked) {
                if (ref.current) {
                    ref.current.setVolume(volume);
                    ref.current.play();
                }
            }

        }, 500);

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <>
            <PositionalAudio
                position={[1.25, 0, 6]}
                ref={ref}
                url="/bg.mp3"
                distance={.65}
                loop
           />

           {/* <mesh position={[1.25, 0, 6]}>
            <boxGeometry />
            <meshBasicMaterial wireframe color="yellow" />
           </mesh> */}
        </>
    )
}

export default ScenePositionalAudio