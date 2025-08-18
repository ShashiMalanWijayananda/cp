import { useState, useEffect } from 'react';
import {connectionEvents} from "./ConnectionEventEmitter";

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'completed';

interface DisconnectionData {
    code?: number;
    reason?: string;
}

interface CompletionData {
    reason?: string;
    message?: string;
}

interface UseWebSocketConnectionReturn {
    connectionStatus: ConnectionStatus;
    lastError: Error | null;
    isCompleted: boolean;
}

export const useWebSocketConnection = (): UseWebSocketConnectionReturn => {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [lastError, setLastError] = useState<Error | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    useEffect(() => {
        const handleConnecting = (): void => {
            setConnectionStatus('connecting');
            setIsCompleted(false);
        };

        const handleConnected = (): void => {
            setConnectionStatus('connected');
            setLastError(null);
            setIsCompleted(false);
        };

        const handleDisconnected = (data?: DisconnectionData): void => {
            setConnectionStatus('disconnected');
            console.log('WebSocket disconnected:', data);
        };

        const handleError = (error: Error): void => {
            setLastError(error);
            setConnectionStatus('error');
        };

        const handleCompleted = (data?: CompletionData): void => {
            setConnectionStatus('completed');
            setIsCompleted(true);
            console.log('WebSocket subscription completed:', data);
        };

        connectionEvents.on('connecting', handleConnecting);
        connectionEvents.on('connected', handleConnected);
        connectionEvents.on('disconnected', handleDisconnected);
        connectionEvents.on('error', handleError);
        connectionEvents.on('completed', handleCompleted);

        return () => {
            connectionEvents.off('connecting', handleConnecting);
            connectionEvents.off('connected', handleConnected);
            connectionEvents.off('disconnected', handleDisconnected);
            connectionEvents.off('error', handleError);
            connectionEvents.off('completed', handleCompleted);
        };
    }, []);

    return { connectionStatus, lastError, isCompleted };
};
