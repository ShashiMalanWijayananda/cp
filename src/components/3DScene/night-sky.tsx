import React, { useMemo } from 'react';
import { Color, BackSide } from 'three';
import { useFrame } from '@react-three/fiber';

interface StarParticle {
    position: [number, number, number];
    size: number;
    brightness: number;
    twinkleSpeed: number;
}

const NightSky: React.FC = () => {
    // Generate random stars
    const stars = useMemo(() => {
        const starCount = 150;
        const temp: StarParticle[] = [];

        for (let i = 0; i < starCount; i++) {
            // Create stars only in the upper hemisphere
            const radius = 100;
            const theta = 2 * Math.PI * Math.random();
            // Restrict phi to upper hemisphere (0 to π/2 instead of 0 to π)
            const phi = Math.acos(Math.random());

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = Math.abs(radius * Math.cos(phi)); // Force Y to be positive
            const z = radius * Math.sin(phi) * Math.sin(theta);

            temp.push({
                position: [x, y, z],
                size: Math.random() * 0.3 + 0.1, // Random size between 0.1 and 0.6
                brightness: Math.random() * 0.2 + 0.5, // Random brightness
                twinkleSpeed: Math.random() * 2 + 0.5, // Random twinkling speed
            });
        }
        return temp;
    }, []);

    // Create stars geometry attributes
    const { positions, sizes } = useMemo(() => {
        const positions = new Float32Array(stars.length * 3);
        const sizes = new Float32Array(stars.length);

        stars.forEach((star, i) => {
            positions[i * 3] = star.position[0];
            positions[i * 3 + 1] = star.position[1];
            positions[i * 3 + 2] = star.position[2];
            sizes[i] = star.size;
        });

        return { positions, sizes };
    }, [stars]);

    // Handle star twinkling
    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        stars.forEach((star, i) => {
            const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
            if (sizes instanceof Float32Array) {
                sizes[i] = star.size * twinkle;
            }
        });
    });

    return (
        <>
            {/* Sky dome (half sphere) */}
            <mesh position={[0, -10, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <sphereGeometry args={[100, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshBasicMaterial
                    side={BackSide}
                    color={new Color('#000000')}
                    fog={false}
                />
            </mesh>

            {/* Stars */}
            <points position={[0, -10, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={positions.length / 3}
                        array={positions}
                        itemSize={3}
                        args={[positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-size"
                        count={sizes.length}
                        array={sizes}
                        itemSize={1}
                        args={[sizes, 1]}
                    />
                </bufferGeometry>

                <pointsMaterial
                    size={0.5}
                    sizeAttenuation={true}
                    color={new Color('#504f4e')}
                    transparent
                    opacity={0.8}
                    fog={false}
                />
            </points>
        </>
    );
};

export default NightSky;
