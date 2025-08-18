import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { useThree, useFrame } from "@react-three/fiber";
import { InteractiveIframeMeshProps } from "../../interfaces/props";

const InteractiveIframeMesh: React.FC<InteractiveIframeMeshProps> = ({
    position,
    scale,
    rotation,
    iframeTitle,
    iframeUrl,
    setOpenIframe,
    onNearby,
    helperText
}) => {
    const { camera } = useThree();
    const meshRef = useRef<THREE.Mesh>(null!);
    const raycaster = new THREE.Raycaster();
    const proximityThreshold = 1;
    const interactionThreshold = 1.5;
    const [raycastEnabled, setRaycastEnabled] = useState(true);


    useEffect(() => {
        const checkPointerLock = () => {
            const pointerLockActive = document.pointerLockElement !== null;
            const exploreText = document.getElementById('explore-note');
            if (exploreText) exploreText.style.display = 'none';

            if (pointerLockActive) {
                setTimeout(() => {
                    setRaycastEnabled(true);
                    const exploreText = document.getElementById('explore-note');
                    if (exploreText) exploreText.style.display = '';
                }, 1000);
            } else {
                setRaycastEnabled(false);
            }
        };
        document.addEventListener('pointerlockchange', checkPointerLock);
        checkPointerLock();
        return () => {
            document.removeEventListener('pointerlockchange', checkPointerLock);
        };
    }, []);

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
            if (!raycastEnabled) return;
            if (checkInteraction()) {
                sessionStorage.setItem('iframeTitle', JSON.stringify(iframeTitle));
                sessionStorage.setItem('iframeUrl', JSON.stringify(iframeUrl));
                sessionStorage.setItem('helperText', JSON.stringify(helperText));
                document.exitPointerLock();
                requestAnimationFrame(() => {
                    setOpenIframe(true);
                });
            }
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [iframeTitle, iframeUrl, setOpenIframe, raycastEnabled]);

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

export default InteractiveIframeMesh;
