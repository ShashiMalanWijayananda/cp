import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import axiosClient from '../axios/axiosClient';

interface SiteContextType {
    isEnable: boolean;
    isLoading: boolean;
    error: string | null;
    milliseconds: number | null,
    checkSiteStatus: () => Promise<void>;
    refreshSiteStatus: () => void;
}

export const SiteContext = createContext<SiteContextType>({
    isEnable: false,
    isLoading: false,
    error: null,
    milliseconds: 0,
    checkSiteStatus: async () => {
    },
    refreshSiteStatus: () => {
    }
} as SiteContextType);

export const SiteContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isEnable, setEnable] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [milliseconds, setMilliseconds] = useState<number>(0);
    const checkSiteStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosClient.get("/site/isActive");
            const responseData = response.data;

            if (responseData?.code === "CODE-00000") {
                setEnable(responseData?.data?.siteEnable as boolean);
                setMilliseconds(responseData?.data?.enabledTime as number)
            } else {
                setError(responseData?.message || "Failed to get site status");
                setEnable(false);
            }
        } catch (error: any) {
            console.error("Error checking site status:", error);
            const errorMessage = error.response?.data?.message || 'Failed to check site status';
            setError(errorMessage);
            setEnable(false);
        } finally {
            setLoading(false);
        }
    };

    const refreshSiteStatus = () => {
        checkSiteStatus();
    };


    useEffect(() => {
        checkSiteStatus();
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
           // checkSiteStatus();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const contextValue: SiteContextType = {
        milliseconds,
        isEnable,
        isLoading,
        error,
        checkSiteStatus,
        refreshSiteStatus
    };

    return (
        <SiteContext.Provider value={contextValue}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSite = (): SiteContextType => {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error('useSite must be used within a SiteContextProvider');
    }
    return context;
};
