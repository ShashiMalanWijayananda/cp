import React, { useRef } from "react";
import { useFrame } from '@react-three/fiber';

// props
interface TorchLightProps {
    torchLightRef: any,
    torchEnabled: boolean,
}

const TorchLight: React.FC<TorchLightProps> = ({ torchLightRef, torchEnabled }) => {
    const intensityRef = useRef(1.55);
    useFrame(({ clock }) => {
        if (torchLightRef.current && torchEnabled) {
            // Vintage flicker: base + random + periodic dips
            const t = clock.getElapsedTime();
            // Base intensity
            let intensity = 1.35 + Math.sin(t * 7.5) * 0.09;
            // Add random flicker
            intensity += (Math.random() - 0.5) * 0.13;
            // Occasional deep glitch
            if (Math.random() < 0.03) intensity -= 0.3 * Math.random();
            // Clamp
            intensity = Math.max(0.7, Math.min(1.7, intensity));
            torchLightRef.current.intensity = intensity;
            intensityRef.current = intensity;
        } else if (torchLightRef.current) {
            torchLightRef.current.intensity = 0;
        }
    });
    return (
        <>
            <spotLight
                ref={torchLightRef}
                intensity={intensityRef.current}
                distance={8.5}
                angle={Math.PI / 5}
                penumbra={0.9}
                color="#f48525"
                decay={4}
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
                shadow-bias={-0.001}
                shadow-camera-near={0.1}
                shadow-camera-far={15}
            />
        </>
    )
}

export default TorchLight