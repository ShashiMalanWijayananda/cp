import React from "react";

// components
import InteractiveIframeMesh from "./interactive-iframe-mesh";

// props
import { InteractiveIframeMeshesProps } from "../../interfaces/props";

const InteractiveIframeMeshes: React.FC<InteractiveIframeMeshesProps> = ({
    setOpenIframe,
    setShowIframeProximityText
}) => {
    return (
        <>
            <InteractiveIframeMesh
                position={[-2.28, .89, -1.75]}
                scale={[.2, .1, .53]}
                rotation={[0, 0, 0]}
                iframeTitle="Oscilloscope Emulator"
                iframeUrl="https://oscilloscopeemulator.z23.web.core.windows.net/"
                setOpenIframe={setOpenIframe}
                onNearby={setShowIframeProximityText}
                helperText="press and hold keys on the keyboard"
            />

            {/* <InteractiveIframeMesh
                position={[-2.38, 1, -2.36]}
                scale={[.2, .35, .70]}
                rotation={[0, -0.6, 0]}
                iframeTitle="Oscilloscope Emulator"
                iframeUrl="https://osc-desktop-client.netlify.app/"
                setOpenIframe={setOpenIframe}
                onNearby={setShowIframeProximityText}
            /> */}

            <InteractiveIframeMesh
                position={[-1.25, 1.2, -2.75]}
                scale={[.85, .18, .25]}
                rotation={[0, 0, 0]}
                iframeTitle="Submarine Inspector Program"
                iframeUrl="https://submarineview.z23.web.core.windows.net/"
                setOpenIframe={setOpenIframe}
                onNearby={setShowIframeProximityText}
                helperText=""
            />

            {/* <mesh
                position={[-1.25, 1.2, -2.75]}
                scale={[.85, .18, .25]}
                rotation={[0, 0, 0]}>
                <boxGeometry />
                <meshBasicMaterial wireframe color="red" />
            </mesh> */}
        </>
    );
};

export default InteractiveIframeMeshes;
