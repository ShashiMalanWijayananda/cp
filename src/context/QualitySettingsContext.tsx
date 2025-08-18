import React, { createContext, useContext, useState } from 'react';
import { QualitySettings, qualityPresets } from '../interfaces/quality-settings';

interface QualitySettingsContextType {
    settings: QualitySettings;
    setQualityPreset: (preset: keyof typeof qualityPresets) => void;
}

const QualitySettingsContext = createContext<QualitySettingsContextType | undefined>(undefined);

export const QualitySettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<QualitySettings>(qualityPresets.medium);

    const setQualityPreset = (preset: keyof typeof qualityPresets) => {
        setSettings(qualityPresets[preset]);
    };

    return (
        <QualitySettingsContext.Provider value={{ settings, setQualityPreset }}>
            {children}
        </QualitySettingsContext.Provider>
    );
};

export const useQualitySettings = () => {
    const context = useContext(QualitySettingsContext);
    if (!context) {
        throw new Error('useQualitySettings must be used within a QualitySettingsProvider');
    }
    return context;
};
