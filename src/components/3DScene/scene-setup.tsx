import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { FogExp2, Vector3 } from "three";
import DustParticles from "./dust-particles";

const SceneSetup: React.FC = () => {
    const { scene, camera } = useThree();
    const fogRef = useRef<FogExp2 | null>(null);
    const timeRef = useRef(0);
    const frameCountRef = useRef(0);
    const windDirectionRef = useRef(new Vector3(1, 0, 0));
    
    // Performance optimization - update fog less frequently on lower-end devices
    const updateInterval = useRef(
        // Use a higher interval if the device has a lower refresh rate
        window.devicePixelRatio < 2 ? 3 : 1
    );

    useEffect(() => {
        // Create exponential fog with optimized initial density
        if (!scene.fog) {
            // Reduce initial density for better performance
            scene.fog = new FogExp2('#0d0608', 0.15);
            fogRef.current = scene.fog;
        }

        return () => {
            if (fogRef.current) {
                scene.fog = null;
                fogRef.current = null;
            }
        };
    }, [scene]);

    // Optimized fog animation with reduced calculations
    useFrame((_state, delta) => {
        if (!fogRef.current || !camera) return;

        // Only update every N frames based on device capability
        frameCountRef.current += 1;
        if (frameCountRef.current % updateInterval.current !== 0) return;

        // Use simplified time calculation
        timeRef.current = (timeRef.current + delta * 0.3) % (Math.PI * 2);

        // Optimize wind effect calculation - using cheaper math operations
        const windEffect = (Math.sin(timeRef.current) * 0.03);
        fogRef.current.density = Math.max(0.12, Math.min(0.18, 0.15 + windEffect));

        // Update wind direction less frequently
        if (frameCountRef.current % (updateInterval.current * 2) === 0) {
            const angle = timeRef.current * 0.08;
            windDirectionRef.current.set(
                Math.cos(angle),
                0,
                Math.sin(angle)
            ).normalize();
        }
    });

    return (
        <>
            <DustParticles />
        </>
    );
};

export default SceneSetup;