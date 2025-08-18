import React, { useRef } from "react";
// r3f 
import { SpotLight } from "three";

const SceneLights: React.FC = () => {
    const spotLightRef = useRef<SpotLight>(null);
    return (
        <>
            <directionalLight
                position={[15, 15, 8]}
                intensity={.06}
                castShadow
                color="#bfa371"
            />

            <directionalLight
                position={[-15, 15, 8]}
                intensity={.04}
                castShadow
                color="#bfa371"
            />

            {/* Desk wireframe */}
            <mesh position={[-2.5, .8, -1]} scale={[.8, 0.3, 3]} receiveShadow castShadow>
                <boxGeometry />
                <meshStandardMaterial wireframe roughness={0.7} metalness={0.3} transparent opacity={0} />
            </mesh>

            {/* Floor to receive shadows */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow visible={false}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial opacity={0} color="#333333" />
            </mesh>

            {/* Desk spotlight */}
            <spotLight
                position={[-2.35, 3.6, -2.3]}
                intensity={15}
                distance={5.5}
                angle={Math.PI / 3.6}
                penumbra={0.9}
                color="#df9a42"
                target-position={[-2.5, 1, 0]}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0001}
                shadow-camera-far={50}
                shadow-camera-near={0.1}
                shadow-focus={1}
            />

            {/* near the right-side bp image */}
            <spotLight
                ref={spotLightRef}
                position={[4.5, 6, -1]}
                intensity={2}
                distance={6}
                angle={Math.PI / 1}
                penumbra={1}
                color="#bfa371"
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.001}
                shadow-camera-far={50}
                shadow-camera-near={1}
            />

            {/* near the right-side checklist image */}
            <spotLight
                ref={spotLightRef}
                position={[4, 3.5, 6]}
                intensity={2}
                distance={7}
                angle={Math.PI / 1}
                penumbra={1}
                color="#bfa371"
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.001}
                shadow-camera-far={50}
                shadow-camera-near={1}
            />
        </>
    )
}

export default SceneLights