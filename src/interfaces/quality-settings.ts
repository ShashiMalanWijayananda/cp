export interface QualitySettings {
    shadowMapSize: number;
    shadowDistance: number;
    drawDistance: number;
    textureQuality: number;
    enablePostProcessing: boolean;
    antialiasing: boolean;
}

export const qualityPresets = {
    low: {
        shadowMapSize: 512,
        shadowDistance: 50,
        drawDistance: 100,
        textureQuality: 0.5,
        enablePostProcessing: true,
        antialiasing: false
    },
    medium: {
        shadowMapSize: 512 * 1.5,
        shadowDistance: 50 * 1.5,
        drawDistance: 100 * 1.5,
        textureQuality: 0.5 * 1.5,
        enablePostProcessing: true,
        antialiasing: false
    },
    high: {
        shadowMapSize: 2048,
        shadowDistance: 200,
        drawDistance: 500,
        textureQuality: 2,
        enablePostProcessing: true,
        antialiasing: true
    }
} as const;
