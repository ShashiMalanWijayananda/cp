import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { useThree, useFrame } from "@react-three/fiber";
import {InteractiveMeshProps} from "../../interfaces/props";


const InteractiveMesh: React.FC<InteractiveMeshProps> = ({
    position,
    scale,
    rotation,
    setOpen,
    assetName,
    onNearby,
    assetFileName
}) => {
    const { camera } = useThree();
    const meshRef = useRef<THREE.Mesh>(null!);
    const raycaster = new THREE.Raycaster();
    const proximityThreshold = 2;
    const interactionThreshold = 2.5;
    const [raycastEnabled, setRaycastEnabled] = useState(true);
    const [interactionsEnabled, setInteractionsEnabled] = useState(true);

    // Listen for sessionStorage key changes and custom events
    useEffect(() => {
        let customTimeout: any;
        const checkModalAndPointerLock = () => {
            const pointerLockActive = document.pointerLockElement !== null;
            const exploreText = document.getElementById('explore-note');
            if (exploreText) {
                exploreText.style.display = 'none';
                exploreText.style.opacity = '0';
            }
            if (pointerLockActive) {
                customTimeout = setTimeout(() => {
                    setRaycastEnabled(true);
                    const exploreText = document.getElementById('explore-note');
                    if (exploreText) {
                        exploreText.style.display = '';
                        exploreText.style.opacity = '0';
                    }
                }, 1000);
            } else {
                setRaycastEnabled(false);
            }
        };

        // Handle custom events for menu modal
        const handleDisableRaycasting = () => {
            setRaycastEnabled(false);
            setInteractionsEnabled(false);
            if (onNearby) onNearby(false);
            document.body.style.cursor = 'auto';
        };

        const handleEnableRaycasting = () => {
            setRaycastEnabled(true);
        };

        const handleDisableInteractions = () => {
            setInteractionsEnabled(false);
        };

        const handleEnableInteractions = () => {
            setInteractionsEnabled(true);
        };

        document.addEventListener('pointerlockchange', checkModalAndPointerLock);
        window.addEventListener('disableRaycasting', handleDisableRaycasting);
        window.addEventListener('enableRaycasting', handleEnableRaycasting);
        window.addEventListener('disableInteractions', handleDisableInteractions);
        window.addEventListener('enableInteractions', handleEnableInteractions);

        // Check on mount
        checkModalAndPointerLock();

        return () => {
            clearTimeout(customTimeout);
            document.removeEventListener('pointerlockchange', checkModalAndPointerLock);
            window.removeEventListener('disableRaycasting', handleDisableRaycasting);
            window.removeEventListener('enableRaycasting', handleEnableRaycasting);
            window.removeEventListener('disableInteractions', handleDisableInteractions);
            window.removeEventListener('enableInteractions', handleEnableInteractions);
        };
    }, [onNearby]);

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
        if (!meshRef.current || !raycastEnabled) return;
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
            if (!raycastEnabled || !interactionsEnabled) return;
            if (checkInteraction()) {
                sessionStorage.setItem('modalMessage', JSON.stringify(assetName));
                sessionStorage.setItem('modalFileName', JSON.stringify(assetFileName));
                setOpen(true);
            }
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [assetName, assetFileName, setOpen, raycastEnabled, interactionsEnabled]);

    useEffect(() => {
        return () => {
            document.body.style.cursor = 'default';
            if (onNearby) onNearby(false);
        };
    }, [onNearby]);

    return (
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
    );
};

export default InteractiveMesh;
