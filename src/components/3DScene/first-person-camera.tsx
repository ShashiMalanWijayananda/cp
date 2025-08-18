import React, { useState, useRef, useCallback, useEffect } from "react";

// r3f
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import TorchLight from "./torch-light";

interface KeyState {
    [key: string]: boolean;
    ArrowUp: boolean;
    ArrowDown: boolean;
    ArrowLeft: boolean;
    ArrowRight: boolean;
    KeyW: boolean;
    KeyS: boolean;
    KeyA: boolean;
    KeyD: boolean;
    w: boolean;
    s: boolean;
    a: boolean;
    d: boolean;
    KeyL: boolean;
    l: boolean;
}

const FirstPersonCamera: React.FC = () => {
    const { camera, gl, clock } = useThree();
    const [keys, setKeys] = useState<KeyState>({
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
        w: false,
        s: false,
        a: false,
        d: false,
        KeyL: false, // Torch toggle
        l: false
    });

    // Mouse look state
    const [isPointerLocked, setIsPointerLocked] = useState(false);
    const [torchEnabled, setTorchEnabled] = useState(true);
    const eulerRef = useRef({ x: 0, y: 0 }); // Store pitch and yaw separately
    const torchLightRef = useRef<any>(null);

    // Breathing animation settings
    const breathingAmplitude = 0.009; // Maximum up/down movement in units
    const breathingFrequency = 0.75; // Breathing cycles per second (slower, more natural)

    // Movement speed and rotation speed
    const moveSpeed = 0.018;
    // const rotationSpeed = 0.05 / 2;
    const mouseSensitivity = 0.002;
    const invertMouseY = false; // Set to true if you want inverted Y-axis
    const playerHeight = 1.55; // Human height in meters (about 6 feet)

    // Boundary constraints (based on the yellow wireframe box)
    const boundaries = {
        minX: 1.6 - 7.8 / 2, // center - scale/2
        maxX: 1.6 + 7.8 / 2,
        minZ: 1.85 - 8.3 / 2,
        maxZ: 1.85 + 9.3 / 2,
        y: playerHeight // Fixed height for walking
    };

    // Handle keyboard events
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Prevent default behavior for game controls
        if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
            event.preventDefault();
        }

        // Handle torch toggle
        if (event.code === 'KeyL' || event.key.toLowerCase() === 'l') {
            setTorchEnabled(prev => !prev);
        }

        const keyCode = event.code;
        const keyValue = event.key.toLowerCase();

        // Special handling for WASD and arrow keys
        const keyMap: { [key: string]: string } = {
            'd': 'KeyD',
            'a': 'KeyA',
            'w': 'KeyW',
            's': 'KeyS',
            'arrowup': 'ArrowUp',
            'arrowdown': 'ArrowDown',
            'arrowleft': 'ArrowLeft',
            'arrowright': 'ArrowRight',
            'up': 'ArrowUp',
            'down': 'ArrowDown',
            'left': 'ArrowLeft',
            'right': 'ArrowRight'
        };

        setKeys(prev => {
            const newState = { ...prev };
            // Set both the code and key value
            newState[keyCode] = true;
            newState[keyValue] = true;

            // For WASD keys, ensure both representations are set
            if (keyMap[keyValue]) {
                newState[keyMap[keyValue]] = true;
            }
            if (Object.values(keyMap).includes(keyCode)) {
                newState[keyCode.slice(-1).toLowerCase()] = true;
            }

            return newState;
        });
    }, []);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        const keyCode = event.code;
        const keyValue = event.key.toLowerCase();

        // Special handling for WASD keys
        const keyMap: { [key: string]: string } = {
            'd': 'KeyD',
            'a': 'KeyA',
            'w': 'KeyW',
            's': 'KeyS'
        };

        setKeys(prev => {
            const newState = { ...prev };
            // Clear both the code and key value
            newState[keyCode] = false;
            newState[keyValue] = false;

            // For WASD keys, ensure both representations are cleared
            if (keyMap[keyValue]) {
                newState[keyMap[keyValue]] = false;
            }
            if (Object.values(keyMap).includes(keyCode)) {
                newState[keyCode.slice(-1).toLowerCase()] = false;
            }

            return newState;
        });
    }, []);

    // Handle mouse movement for looking around
    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (!isPointerLocked) return;

        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        // Update stored rotations
        eulerRef.current.y -= movementX * mouseSensitivity; // Yaw (left/right)
        eulerRef.current.x -= movementY * mouseSensitivity * (invertMouseY ? -1 : 1); // Pitch (up/down)

        // Limit vertical rotation to prevent flipping
        eulerRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, eulerRef.current.x));

        // Apply rotations to camera in the correct order for FPS controls
        camera.rotation.set(eulerRef.current.x, eulerRef.current.y, 0, 'YXZ');
    }, [isPointerLocked, camera, mouseSensitivity, invertMouseY]);

    // Handle pointer lock events
    const handlePointerLockChange = useCallback(() => {
        setIsPointerLocked(document.pointerLockElement === gl.domElement);
    }, [gl.domElement]);

    // Request pointer lock on canvas click
    const handleCanvasClick = useCallback(() => {
        if (!isPointerLocked) {
            gl.domElement.requestPointerLock();
        }
    }, [isPointerLocked, gl.domElement]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Mouse and pointer lock event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('pointerlockchange', handlePointerLockChange);
        gl.domElement.addEventListener('click', handleCanvasClick);

        // Listen for turnPlayerAround event
        const handleTurnPlayerAround = (e: any) => {
            // Rotate camera/player by the specified angle (in degrees)
            const angle = (e && e.detail && e.detail.angle) ? e.detail.angle : 180;
            // Convert degrees to radians
            const radians = (angle * Math.PI) / 180;
            eulerRef.current.x += radians;
            camera.rotation.set(eulerRef.current.x, eulerRef.current.y, 0, 'YXZ');
        };
        window.addEventListener('turnPlayerAround', handleTurnPlayerAround);

        // Listen for setPlayerPosition event
        const handleSetPlayerPosition = (e: any) => {
            if (e && e.detail) {
                const { x, y, z } = e.detail;
                camera.position.set(x, y !== undefined ? y : playerHeight, z);
            }
        };
        window.addEventListener('setPlayerPosition', handleSetPlayerPosition);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            gl.domElement.removeEventListener('click', handleCanvasClick);
            window.removeEventListener('turnPlayerAround', handleTurnPlayerAround);
            window.removeEventListener('setPlayerPosition', handleSetPlayerPosition);
        };
    }, [handleKeyDown, handleKeyUp, handleMouseMove, handlePointerLockChange, handleCanvasClick, camera]);

    // Set initial camera position and rotation
    useEffect(() => {
        camera.position.set(-1.5, playerHeight, 6); // Start at human height
        camera.rotation.set(0, 0, 0, 'YXZ'); // Set rotation order for FPS controls
        eulerRef.current = { x: 0, y: 0 }; // Initialize euler angles
    }, [camera]);

    useFrame((_, delta) => {
        const direction = new Vector3();
        const right = new Vector3();
        camera.getWorldDirection(direction);
        right.crossVectors(camera.up, direction).normalize();

        // Calculate movement
        const movement = new Vector3();

        // Forward/Backward movement (Arrow Up/Down or W/S)
        const isForward = Boolean(
            keys.ArrowUp || keys.KeyW || keys.w || keys['w'] ||
            keys['arrowup'] || keys['up']
        );
        const isBackward = Boolean(
            keys.ArrowDown || keys.KeyS || keys.s || keys['s'] ||
            keys['arrowdown'] || keys['down']
        );
        const isLeft = Boolean(
            keys.ArrowLeft || keys.KeyA || keys.a || keys['a'] ||
            keys['arrowleft'] || keys['left']
        );
        const isRight = Boolean(
            keys.KeyD || keys.d || keys['d'] || keys.ArrowRight ||
            keys['arrowright'] || keys['right']
        );

        // Use delta for frame-rate independent movement
        const frameMoveSpeed = moveSpeed * (delta * 60); // 60 is a reference FPS

        if (isForward) {
            movement.add(direction.clone().multiplyScalar(frameMoveSpeed));
        }
        if (isBackward) {
            movement.add(direction.clone().multiplyScalar(-frameMoveSpeed));
        }
        if (isLeft) {
            movement.add(right.clone().multiplyScalar(frameMoveSpeed));
        }
        if (isRight) {
            movement.add(right.clone().multiplyScalar(-frameMoveSpeed));
        }

        // Apply movement with boundary constraints
        const newPosition = camera.position.clone().add(movement);
        newPosition.x = Math.max(boundaries.minX, Math.min(boundaries.maxX, newPosition.x));
        newPosition.z = Math.max(boundaries.minZ, Math.min(boundaries.maxZ, newPosition.z));

        // Walking animation (vertical bob only)
        const time = clock.getElapsedTime();
        const isMoving = isForward || isBackward || isLeft || isRight;
        let yOffset = 0;
        if (isMoving) {
            const walkFrequency = 7.2; // steps per second
            const walkAmplitudeY = 0.022 / 2.5; // up/down
            yOffset = Math.abs(Math.sin(time * walkFrequency)) * walkAmplitudeY;
        } else {
            yOffset = Math.sin(time * Math.PI * breathingFrequency) * breathingAmplitude;
        }
        newPosition.y = boundaries.y + yOffset;

        // Check if new position would be inside any no-go zones
        const redBox = {
            center: new Vector3(1, 1.5, 3.4),
            halfSize: new Vector3(2.6 / 2, 2.5 / 2, 7 / 2)
        };

        const insideRedBox =
            newPosition.x >= redBox.center.x - redBox.halfSize.x &&
            newPosition.x <= redBox.center.x + redBox.halfSize.x &&
            newPosition.z >= redBox.center.z - redBox.halfSize.z &&
            newPosition.z <= redBox.center.z + redBox.halfSize.z;

        // wooden table - left side - no-go zone
        const leftWoodenTable = {
            center: new Vector3(-2.5, 1.4, -1.2),
            halfSize: new Vector3(0.75 / 2, 2.5 / 2, 3.5 / 2)
        };

        const insideLeftWoodenTable =
            newPosition.x >= leftWoodenTable.center.x - leftWoodenTable.halfSize.x &&
            newPosition.x <= leftWoodenTable.center.x + leftWoodenTable.halfSize.x &&
            newPosition.z >= leftWoodenTable.center.z - leftWoodenTable.halfSize.z &&
            newPosition.z <= leftWoodenTable.center.z + leftWoodenTable.halfSize.z;

        // Only update position if not inside any no-go zones
        if (!insideRedBox && !insideLeftWoodenTable) {
            camera.position.copy(newPosition);
        }


        // position={[-.65, 1.4, -2.55]} scale={[3.75, 2.5, .75]}
        // wooden table - right side - no-go zone
        const rightWoodenTable = {
            center: new Vector3(-.65, 1.4, -2.55),
            halfSize: new Vector3(3.75 / 2, 2.5 / 2, .75 / 2)
        };

        const insideRightWoodenTable =
            newPosition.x >= rightWoodenTable.center.x - rightWoodenTable.halfSize.x &&
            newPosition.x <= rightWoodenTable.center.x + rightWoodenTable.halfSize.x &&
            newPosition.z >= rightWoodenTable.center.z - rightWoodenTable.halfSize.z &&
            newPosition.z <= rightWoodenTable.center.z + rightWoodenTable.halfSize.z;

        // Only update position if not inside any no-go zones
        if (!insideRedBox && !insideLeftWoodenTable && !insideRightWoodenTable) {
            camera.position.copy(newPosition);
        }


        // Update torch light position and flicker effect
        if (torchLightRef.current && torchEnabled) {
            // Position the torch slightly in front of the camera
            const torchOffset = new Vector3(0.1, -0.1, -0.3);
            torchOffset.applyMatrix4(camera.matrixWorld);
            torchLightRef.current.position.copy(camera.position);

            // Point the torch in the same direction as the camera
            const lookDirection = new Vector3();
            camera.getWorldDirection(lookDirection);
            const targetPosition = camera.position.clone().add(lookDirection);
            torchLightRef.current.target.position.copy(targetPosition);
            torchLightRef.current.target.updateMatrixWorld();
        }
    });

    return (
        <>
            <TorchLight torchLightRef={torchLightRef} torchEnabled={torchEnabled} />
        </>
    );
}

export default FirstPersonCamera