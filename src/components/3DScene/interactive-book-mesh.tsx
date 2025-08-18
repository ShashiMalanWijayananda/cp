import React, { useEffect, useRef, useState } from "react";

// r3f
import * as THREE from 'three';
import { useThree, useFrame } from "@react-three/fiber";

// props
import { InteractiveBookMeshProps } from "../../interfaces/props";

const InteractiveBookMesh: React.FC<InteractiveBookMeshProps> = ({
    position,
    scale,
    rotation,
    setOpenBook,
    bookName,
    assetFileName,
    isbnNumber,
    overview,
    author,
    onNearby,
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

    // Use useFrame for continuous proximity/interact checks
    // Only call onNearby when proximity changes
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
                sessionStorage.setItem('bookName', JSON.stringify(bookName));
                sessionStorage.setItem('assetFileName', JSON.stringify(assetFileName));
                sessionStorage.setItem('isbnNumber', JSON.stringify(isbnNumber));
                sessionStorage.setItem('overview', JSON.stringify(overview));
                sessionStorage.setItem('author', JSON.stringify(author));
                setOpenBook(true);
            }
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [bookName, assetFileName, isbnNumber, overview, author, setOpenBook, raycastEnabled]);

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
            <meshStandardMaterial transparent opacity={0} />
        </mesh>
    );
};

export default InteractiveBookMesh;