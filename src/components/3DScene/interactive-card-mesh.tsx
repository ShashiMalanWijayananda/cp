import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveCardMeshProps } from '../../interfaces/props';

const InteractiveCardMesh: React.FC<InteractiveCardMeshProps> = ({
    position,
    scale,
    rotation,
    setOpenCardSelection,
    onNearby
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { camera } = useThree();
    const raycaster = new THREE.Raycaster();
    const proximityThreshold = .85;
    const interactionThreshold = 2;

    const checkRaycastAndDistance = (thresholdDistance: number) => {
        if (!meshRef.current) return false;

        // Get direction vector from camera center
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

    const checkProximity = () => {
        return checkRaycastAndDistance(proximityThreshold);
    };

    const checkInteraction = () => {
        return checkRaycastAndDistance(interactionThreshold);
    };

    useEffect(() => {
        const handleClick = () => {
            if (checkInteraction()) {
                setOpenCardSelection(true);
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [setOpenCardSelection]);

    useEffect(() => {
        // Reset cursor and proximity state when component unmounts
        return () => {
            document.body.style.cursor = 'default';
            if (onNearby) {
                onNearby(false);
            }
        };
    }, [onNearby]);

    useFrame(() => {
        if (!meshRef.current) return;

        const isNearby = checkProximity();
        const canInteract = checkInteraction();

        if (onNearby) {
            onNearby(isNearby);
        }

        if (canInteract) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={scale}
            rotation={rotation}
        >
            <boxGeometry />
            <meshBasicMaterial wireframe color="green" opacity={0} transparent={true} visible={false} />
        </mesh>
    );
};

export default InteractiveCardMesh;
