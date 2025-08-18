import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState, useRef} from 'react';
import {useQuery, useSubscription} from '@apollo/client';
import {IAPIResponse, IEnqueue} from "../interfaces/data.interfaces";
import {GET_QUEUE_IDS, QUEUE_SUBSCRIPTION} from "./queries";
import {useLogin} from "../context/login.context";
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../context/app.context";

export interface IQueueStatus {
    currentIndex?: number;
    eventDate?: string;
    eventId?: string;
    path?: string;
    queueKey?: string;
    totalQueue?: string;
    status?: string;
}

interface QueueContextType {
    queueStatus: IQueueStatus | null;
    queueLoading: boolean;
    queueError: any;
    isConnected: boolean;
    subscribe: () => void;
    unsubscribe: () => void;
    reconnect: () => void;
}

interface QueueProviderProps {
    children: ReactNode;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = (): QueueContextType => {
    const context = useContext(QueueContext);
    if (!context) {
        throw new Error('useQueue must be used within a QueueProvider');
    }
    return context;
};

export const QueueProvider: React.FC<QueueProviderProps> = ({children}) => {
    const [queueRequest, setQueueRequest] = useState<IEnqueue | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isSubscriptionActive, setIsSubscriptionActive] = useState(true);

    // Store the original queue data to rebuild subscription
    const originalQueueDataRef = useRef<{
        eventId: string;
        zoneId: string;
        eventDate: string;
    } | null>(null);

    const {user} = useLogin();
    const navigate = useNavigate();
    const {appContext} = useAppContext();

    const {
        data: queue,
        loading: loadingQueue,
        error: error,
        refetch: refetchQueue
    } = useQuery(GET_QUEUE_IDS, {
        variables: {requestId: user?.id},
        skip: !user,
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        const response = queue?.getQueueIds as IAPIResponse;
        if (response?.code === "CODE-1202" && user?.id) {
            const queueData = {
                eventId: response?.data?.eventId,
                zoneId: response?.data?.zoneId,
                eventDate: response?.data?.eventDate
            };

            // Store original data for resubscription
            originalQueueDataRef.current = queueData;

            const enQueue: IEnqueue = {
                requestId: user.id,
                zone: queueData
            };

            // Only set queue request if subscription is active
            if (isSubscriptionActive) {
                setQueueRequest(enQueue);
            }
        }
    }, [queue, user?.id, isSubscriptionActive]);

    const {data: queueStatus, loading: queueLoading, error: queueError} = useSubscription(
        QUEUE_SUBSCRIPTION,
        {
            variables: {
                request: queueRequest
            },
            skip: !queueRequest || !isSubscriptionActive,
            onSubscriptionData: ({subscriptionData}) => {
                if (subscriptionData.data) {
                    const queueStatusData = subscriptionData.data?.queueUpdate?.queueStatus;
                    const search = `?eventDate=${queueStatusData?.eventDate}&eventId=${queueStatusData?.eventId}&zoneId=${queueStatusData?.zoneId}`;

                    if (queueStatusData?.currentIndex <= 100) {
                        //appContext.showErrorDialog("Alert", "You will redirect to purchase route");
                        setTimeout(() => {
                            navigate(`/purchase${search}`);
                        }, 3000);
                    }
                    setIsConnected(true);
                }
            },
            onSubscriptionComplete: () => {
                console.log('Subscription completed');
                setIsConnected(false);
            },
            onError: (error) => {
                console.error('Subscription error:', error);
                setIsConnected(false);
            }
        }
    );

    const subscribe = useCallback(async () => {
        if (!user?.id) {
            console.error('Cannot subscribe: User not found');
            return;
        }

        console.log('Starting subscription process...');

        try {
            // If we don't have original queue data, refetch it
            if (!originalQueueDataRef.current) {
                console.log('Refetching queue data...');
                const result = await refetchQueue();
                const response = result?.data?.getQueueIds as IAPIResponse;

                if (response?.code === "CODE-1202") {
                    originalQueueDataRef.current = {
                        eventId: response?.data?.eventId,
                        zoneId: response?.data?.zoneId,
                        eventDate: response?.data?.eventDate
                    };
                }
            }

            if (originalQueueDataRef.current) {
                setIsSubscriptionActive(true);

                const request: IEnqueue = {
                    requestId: user.id,
                    zone: originalQueueDataRef.current
                };

                console.log('Subscribing to queue with request:', request);
                setQueueRequest(request);
            } else {
                console.error('No queue data available for subscription');
            }
        } catch (error) {
            console.error('Error during subscribe:', error);
            setIsConnected(false);
        }
    }, [user?.id, refetchQueue]);

    const unsubscribe = useCallback(() => {
        console.log('Unsubscribing from queue');
        setIsSubscriptionActive(false);
        setQueueRequest(null);
        setIsConnected(false);
    }, []);

    const reconnect = useCallback(async () => {
        console.log('Reconnecting to queue...');

        // First unsubscribe
        setIsSubscriptionActive(false);
        setQueueRequest(null);
        setIsConnected(false);

        // Wait a bit longer for cleanup
        await new Promise(resolve => setTimeout(resolve, 500));

        // Then resubscribe
        await subscribe();
    }, [subscribe]);

    // Monitor subscription state
    useEffect(() => {
        if (queueRequest && !queueLoading && !queueError && isSubscriptionActive) {
            setIsConnected(true);
        } else if (queueError || !isSubscriptionActive) {
            setIsConnected(false);
        }
    }, [queueRequest, queueLoading, queueError, isSubscriptionActive]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setQueueRequest(null);
            setIsConnected(false);
            setIsSubscriptionActive(false);
        };
    }, []);

    const contextValue: QueueContextType = {
        queueStatus: queueStatus?.queueUpdate?.queueStatus || null,
        queueLoading,
        queueError,
        isConnected,
        subscribe,
        unsubscribe,
        reconnect
    };

    return (
        <QueueContext.Provider value={contextValue}>
            {children}
        </QueueContext.Provider>
    );
};
