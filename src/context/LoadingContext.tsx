import React, { createContext, useContext, useState } from 'react';
import { useProgress } from '@react-three/drei';

interface LoadingContextType {
    setCustomProgress: (progress: number) => void;
    progress: number;
    totalProgress: number;
}

const LoadingContext = createContext<LoadingContextType>({
    setCustomProgress: () => {},
    progress: 0,
    totalProgress: 0,
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [customProgress, setCustomProgress] = useState(0);
    const { progress } = useProgress();
    
    const totalProgress = Math.floor((progress + customProgress) / 2);

    return (
        <LoadingContext.Provider value={{ 
            setCustomProgress, 
            progress: customProgress,
            totalProgress 
        }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
