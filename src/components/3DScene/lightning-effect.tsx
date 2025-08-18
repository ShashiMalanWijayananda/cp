import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

// Lightning flashes every 4-12 seconds, lasts 0.08-0.22s
function getNextFlashTime() {
    return 4 + Math.random() * 8;
}

const FLICKER_COUNT = 2 + Math.floor(Math.random() * 2); // 2-3 flickers per event
const FLICKER_INTERVAL = 0.04; // seconds between flickers

const LightningEffect: React.FC = () => {
    const [flash, setFlash] = useState(false);
    const [intensity, setIntensity] = useState(0);
    const [ambient, setAmbient] = useState(0);
    const [flicker, setFlicker] = useState(0);
    const [_, setDirection] = useState<[number, number, number]>([0, -1, 0]);
    const [position, setPosition] = useState<[number, number, number]>([0, 8, 0]);
    const timer = useRef(0);
    const flashTimer = useRef(0);
    const nextFlash = useRef(getNextFlashTime());
    const flickerIndex = useRef(0);
    const flickerTimer = useRef(0);
    const flickerCount = useRef(FLICKER_COUNT);

    useFrame((_, delta) => {
        timer.current += delta;
        if (!flash && timer.current > nextFlash.current) {
            setFlash(true);
            setIntensity(1.55 + Math.random() * 3);
            setAmbient(0.22/2 + Math.random() * 0.18/2);
            setDirection([
                (Math.random() - 0.5) * 0.7,
                -1,
                (Math.random() - 0.5) * 0.7
            ]);
            setPosition([
                (Math.random() - 0.5) * 8,
                7 + Math.random() * 2,
                (Math.random() - 0.5) * 8
            ]);
            flickerIndex.current = 0;
            flickerCount.current = 2 + Math.floor(Math.random() * 2);
            flickerTimer.current = 0;
            flashTimer.current = 0;
            nextFlash.current = getNextFlashTime();
            timer.current = 0;
        }
        if (flash) {
            flashTimer.current += delta;
            flickerTimer.current += delta;
            if (flickerTimer.current > FLICKER_INTERVAL) {
                // Each flicker: toggle on/off
                setFlicker(flickerIndex.current % 2 === 0 ? 1 : 0);
                flickerIndex.current++;
                flickerTimer.current = 0;
            }
            // End after all flickers
            if (flickerIndex.current > flickerCount.current * 2) {
                setFlash(false);
                setIntensity(0);
                setAmbient(0);
                setFlicker(0);
            }
        }
    });

    // Play thunder sound when lightning flashes and audioTriggerClicked is true and isSceneMusicMuted is not true
    const thunderAudioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        if (flash && flicker === 1) {
            const audioTrigger = sessionStorage.getItem('audioTriggerClicked');
            const isMuted = sessionStorage.getItem('isSceneMusicMuted');
            if (audioTrigger === 'true' && isMuted !== 'true') {
                if (!thunderAudioRef.current) {
                    thunderAudioRef.current = new window.Audio('/thunder.mp3');
                }
                // Always reset and play
                thunderAudioRef.current.currentTime = 0;
                thunderAudioRef.current.volume = 0.2 + Math.random() * 0.22; // random between 0.18 and 0.4
                thunderAudioRef.current.play();
            }
        }
    }, [flash, flicker]);

    return (
        <>
            {/* Thunder audio element is not rendered, managed via ref */}
            {flash && flicker === 1 && (
                <>
                    <directionalLight
                        position={position}
                        intensity={intensity}
                        color="#cceeff"
                        castShadow={false}
                        shadow-bias={-0.001}
                        shadow-camera-near={0.1}
                        shadow-camera-far={30}
                        shadow-mapSize-width={256}
                        shadow-mapSize-height={256}
                        target-position={[0, 0, 0]}
                    />
                    {/* Ambient boost for global flash */}
                    <ambientLight intensity={ambient} color="#eaf6ff" />
                </>
            )}
        </>
    );
};

export default LightningEffect;
