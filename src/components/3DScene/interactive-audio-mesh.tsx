import React, { useEffect, useRef } from "react";

// r3f
import { PositionalAudio } from "@react-three/drei";
import * as THREE from 'three';
import { useThree, useFrame } from "@react-three/fiber";

// props
import { InteractiveAudioMeshProps } from "../../interfaces/props";

const InteractiveAudioMesh: React.FC<InteractiveAudioMeshProps> = ({
    position,
    scale,
    rotation,
    audioName,
    audioFileName,
    onNearby,
}) => {
    const { camera } = useThree();
    const ref = useRef<THREE.PositionalAudio | null>(null);
    const meshRef = useRef<THREE.Mesh>(null!);
    const raycaster = new THREE.Raycaster();
    const proximityThreshold = 1;
    const interactionThreshold = 1.5;
    const audioPlayingRef = useRef(false);

    const checkRaycastAndDistance = (thresholdDistance: number) => {
        if (!meshRef.current) return false;
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        raycaster.set(camera.position, direction);
        const intersects = raycaster.intersectObject(meshRef.current);
        if (intersects.length > 0) {
            const distance = new THREE.Vector3()
                .subVectors(meshRef.current.position, camera.position)
                .length();
            return distance <= thresholdDistance;
        }
        return false;
    };

    const checkProximity = () => checkRaycastAndDistance(proximityThreshold);
    const checkInteraction = () => checkRaycastAndDistance(interactionThreshold);

    const lastNearby = useRef(false);
    useFrame(() => {
        if (!meshRef.current || audioPlayingRef.current) return;
        const isNearby = checkProximity();
        if (isNearby !== lastNearby.current) {
            onNearby?.(isNearby);
            lastNearby.current = isNearby;
        }
        const canInteract = checkInteraction();
        document.body.style.cursor = canInteract ? 'pointer' : 'default';
    });

    useEffect(() => {
        const handleClick = () => {
            if (audioPlayingRef.current) return;
            if (checkInteraction() && ref.current) {
                sessionStorage.setItem('audioName', JSON.stringify(audioName));
                sessionStorage.setItem('audioFileName', JSON.stringify(audioFileName));
                ref.current.stop();
                ref.current.play();

                // testing
                // window.addEventListener('turnOnThePlayer', handleRadioWheelMovement);
                const turnEvent = new CustomEvent('turnOnThePlayer');
                window.dispatchEvent(turnEvent);

                audioPlayingRef.current = true;
                const exploreText = document.getElementById('explore-note');
                if (exploreText) exploreText.style.display = 'none';

                const tapeRecorderHandle = document.getElementById('tape-recorder-handle');
                if (tapeRecorderHandle) tapeRecorderHandle.style.display = 'block';
            }
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [audioName, audioFileName]);

    useEffect(() => {
        return () => {
            document.body.style.cursor = 'default';
            if (onNearby) onNearby(false);
        };
    }, [onNearby]);

    return (
        <>
            <mesh
                position={position}
                scale={scale}
                rotation={rotation}
                ref={meshRef}
            >
                <boxGeometry />
                <meshStandardMaterial
                    transparent
                    opacity={0}
                />
            </mesh>

            <PositionalAudio
                position={[-2.6, 1, -1.6]}
                ref={ref}
                url="/radio-note.mp3"
                distance={.15}
                loop={false}
                onEnded={() => {
                    audioPlayingRef.current = false;
                    const exploreText = document.getElementById('explore-note');
                    if (exploreText) exploreText.style.display = '';

                    const tapeRecorderHandle = document.getElementById('tape-recorder-handle');
                    if (tapeRecorderHandle) tapeRecorderHandle.style.display = 'none';
                }}
            />
        </>
    );
};

export default InteractiveAudioMesh;
