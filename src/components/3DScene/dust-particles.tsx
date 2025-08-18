import React, { useRef, useEffect, useMemo } from "react";
import {
    Vector3,
    Points,
    BufferGeometry,
    Float32BufferAttribute,
    PointsMaterial,
    TextureLoader,
    AdditiveBlending,
} from "three";
import { useFrame } from "@react-three/fiber";

// Performance-based configuration
const getPerformanceConfig = () => {
    const isLowEnd = window.devicePixelRatio < 2 || !window.matchMedia('(min-device-memory: 4gb)').matches;
    return {
        particleCount: isLowEnd ? 1000 : 1000,
        updateFrequency: isLowEnd ? 1 : 1, // Update every N frames
        textureSize: isLowEnd ? 50 : 50,
        bounds: 20,
    };
};

const config = getPerformanceConfig();

// Optimized radial gradient creation - memoized
const createDustTexture = (size: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const center = size / 2;
    const gradient = ctx.createRadialGradient(
        center, center, 0,
        center, center, center
    );

    gradient.addColorStop(0, 'rgba(253, 141, 36, 0.4)');
    gradient.addColorStop(0.3, 'rgba(253, 141, 36, 0.15)');
    gradient.addColorStop(1, 'rgba(253, 141, 36, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return canvas;
};

const DustParticles: React.FC = () => {
    const pointsRef = useRef<Points | null>(null);
    const frameCountRef = useRef(0);
    const windVectorRef = useRef(new Vector3(0, 0, 0));
    const timeRef = useRef(0);

    // Memoize the geometry creation
    const geometry = useMemo(() => {
        const geo = new BufferGeometry();
        const positions = new Float32Array(config.particleCount * 3);
        const velocities = new Float32Array(config.particleCount * 3);
        const sizes = new Float32Array(config.particleCount);

        for (let i = 0; i < config.particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * config.bounds;
            positions[i3 + 1] = Math.random() * config.bounds * 0.5;
            positions[i3 + 2] = (Math.random() - 0.5) * config.bounds;

            // Reduced velocity range for better performance
            velocities[i3] = (Math.random() - 0.5) * 0.015;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.008;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.015;

            sizes[i] = Math.random() * 0.03 + 0.01;
        }

        geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geo.setAttribute('velocity', new Float32BufferAttribute(velocities, 3));
        geo.setAttribute('size', new Float32BufferAttribute(sizes, 1));

        return geo;
    }, []);

    // Memoize material creation
    const material = useMemo(() => {
        const dustTexture = new TextureLoader().load(createDustTexture(config.textureSize)?.toDataURL() || '');
        return new PointsMaterial({
            size: 0.05,
            map: dustTexture,
            transparent: true,
            opacity: 0.5,
            color: '#a0a0a0',
            blending: AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });
    }, []);

    useEffect(() => {
        if (!pointsRef.current) {
            pointsRef.current = new Points(geometry, material);
        }
        
        return () => {
            geometry.dispose();
            material.dispose();
            if (material.map) material.map.dispose();
        };
    }, [geometry, material]);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;

        // Skip frames based on performance config
        frameCountRef.current = (frameCountRef.current + 1) % config.updateFrequency;
        if (frameCountRef.current !== 0) return;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = pointsRef.current.geometry.attributes.velocity.array as Float32Array;
        const sizes = pointsRef.current.geometry.attributes.size.array as Float32Array;

        // Update time more slowly for performance
        timeRef.current = (timeRef.current + delta * 0.2) % (Math.PI * 2);

        // Calculate wind less frequently
        if (frameCountRef.current === 0) {
            const windAngle = timeRef.current * 0.08;
            windVectorRef.current.set(
                Math.cos(windAngle) * 0.008,
                Math.sin(windAngle * 0.4) * 0.002,
                Math.sin(windAngle) * 0.008
            );
        }

        // Optimize particle updates with chunking
        const chunkSize = 100;
        for (let chunk = 0; chunk < config.particleCount; chunk += chunkSize) {
            const endChunk = Math.min(chunk + chunkSize, config.particleCount);
            
            for (let i = chunk; i < endChunk; i++) {
                const i3 = i * 3;

                // Simplified size variation
                if (i % 3 === 0) { // Update only every third particle's size
                    sizes[i] = (Math.sin(timeRef.current + i * 0.1) * 0.01 + 1) * 0.015;
                }

                positions[i3] += velocities[i3] + windVectorRef.current.x;
                positions[i3 + 1] += velocities[i3 + 1] + windVectorRef.current.y;
                positions[i3 + 2] += velocities[i3 + 2] + windVectorRef.current.z;

                // Optimized boundary checks
                const halfBounds = config.bounds * 0.5;
                if (positions[i3] > halfBounds || positions[i3] < -halfBounds) {
                    positions[i3] *= -0.99;
                }
                if (positions[i3 + 1] > halfBounds) positions[i3 + 1] = 0;
                if (positions[i3 + 1] < 0) positions[i3 + 1] = halfBounds;
                if (positions[i3 + 2] > halfBounds || positions[i3 + 2] < -halfBounds) {
                    positions[i3 + 2] *= -0.99;
                }
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.size.needsUpdate = true;
    });

    return pointsRef.current ? <primitive object={pointsRef.current} /> : null;
};

export default DustParticles;