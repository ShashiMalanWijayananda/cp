import React, { useEffect } from 'react'
import { EffectComposer, ChromaticAberration, Scanline, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useQualitySettings } from '../../context/QualitySettingsContext'

// React component for the VHS effect
const VHSEffectComponent: React.FC = () => {
    const { gl } = useThree()
    const { settings } = useQualitySettings()

    // Optimize renderer based on quality settings
    useEffect(() => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, settings.textureQuality))
    }, [gl, settings.textureQuality])

    if (!settings.enablePostProcessing) {
        return null;
    }

    return (
        <EffectComposer multisampling={settings.antialiasing ? 4 : 0}>
            <>
                <ChromaticAberration
                    offset={new THREE.Vector2(0.002, 0.002)}
                    radialModulation={false}
                    modulationOffset={0}
                    blendFunction={BlendFunction.NORMAL}
                    opacity={settings.textureQuality > 1 ? 0.22 : 0.1}
                />
                {settings.textureQuality > 0.5 && (
                    <Scanline
                        blendFunction={BlendFunction.OVERLAY}
                        density={0.7}
                        opacity={0.03}
                    />
                )}
                <Vignette opacity={settings.textureQuality > 1 ? 0.55 : 0.3} />
            </>
        </EffectComposer>
    );
}

export default VHSEffectComponent
