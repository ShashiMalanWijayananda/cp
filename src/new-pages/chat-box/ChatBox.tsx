import React, {useEffect, useRef, useState} from 'react';
import {Send} from 'lucide-react';
import {useLogin} from "../../context/login.context";
import ChatView from "./ChatView";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: Date;
}

interface SystemMessage {
    type: 'system' | 'message' | 'error' | 'typing';
    message: string;
    sessionInfo?: {
        userId: string;
        indexName: string;
        activeConnections: number;
        sessionCreated: string;
        isNewSession: boolean;
    };
}

const ChatBox: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
    const [sessionInfo, setSessionInfo] = useState<any>(null);
    const [activeConnections, setActiveConnections] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const isConnectingRef = useRef(false);
    const shouldReconnectRef = useRef(true);
    const {user} = useLogin();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addMessage = (text: string, sender: 'user' | 'other', id?: string) => {
        const newMessage: Message = {
            id: id || `${Date.now()}-${Math.random()}`,
            text,
            sender,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
    };

    const handleWebSocketMessage = (data: string) => {
        try {
            const response: SystemMessage = JSON.parse(data);

            switch (response.type) {
                case 'system':
                    console.log('System message received:', response);
                    if (response.sessionInfo) {
                        setSessionInfo(response.sessionInfo);
                        setActiveConnections(response.sessionInfo.activeConnections);
                    }

                    addMessage(response.message, 'other');
                    break;

                case 'error':
                    console.error('Server error:', response.message);
                    addMessage(`Error: ${response.message}`, 'other');
                    setIsTyping(false);
                    break;

                case 'typing':
                    // Handle typing indicator from server if needed
                    break;

                case 'message':
                default:
                    const messageText = response.message || data;
                    addMessage(messageText, 'other');
                    setIsTyping(false);
                    break;
            }

        } catch (error) {
            console.log('Received non-JSON message, treating as plain text:', data);
            addMessage(data, 'other');
            setIsTyping(false);
        }
    };

    const connectWebSocket = () => {
        // Prevent multiple connections
        if (isConnectingRef.current) {
            console.log('Connection already in progress, skipping...');
            return;
        }

        if (wsRef.current) {
            if (wsRef.current.readyState === WebSocket.OPEN) {
                console.log('WebSocket already connected and open');
                return;
            }
            if (wsRef.current.readyState === WebSocket.CONNECTING) {
                console.log('WebSocket already connecting');
                return;
            }
        }

        if (reconnectAttempts.current >= maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            addMessage('Connection failed after multiple attempts. Please click retry to try again.', 'other');
            return;
        }

        if (!shouldReconnectRef.current) {
            console.log('Reconnection disabled, not connecting');
            return;
        }

        // Close existing connection if it exists
        if (wsRef.current) {
            console.log('Closing existing WebSocket connection');
            wsRef.current.close();
            wsRef.current = null;
        }

        try {
            isConnectingRef.current = true;
            setConnectionStatus('connecting');
            const wsUrl = `/chat?userId=${user?.id || 'anonymous'}&lname=${user?.lastName}`;

            console.log(`Creating new WebSocket connection (attempt ${reconnectAttempts.current + 1}):`, wsUrl);

            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                console.log('WebSocket connected successfully');
                setConnectionStatus('connected');
                reconnectAttempts.current = 0;
                isConnectingRef.current = false;
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }

                console.log('WebSocket connection established, waiting for system message...');
            };

            wsRef.current.onmessage = (event) => {
                console.log('Received WebSocket message:', event.data);
                const response = JSON.parse(event.data);
                handleWebSocketMessage(response?.type == "answer" ? response?.answer : event?.data);
            };

            wsRef.current.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                setConnectionStatus('disconnected');
                isConnectingRef.current = false;

                // Important: Set wsRef to null only after checking reconnection logic
                const shouldReconnect = shouldReconnectRef.current &&
                    event.code !== 1000 &&
                    event.code !== 1001 &&
                    reconnectAttempts.current < maxReconnectAttempts;

                wsRef.current = null;

                if (shouldReconnect) {
                    reconnectAttempts.current++;
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current - 1), 30000);

                    console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})...`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        if (shouldReconnectRef.current) {
                            connectWebSocket();
                        }
                    }, delay);
                } else {
                    console.log('Not reconnecting:',
                        event.code === 1000 ? 'Manual close' :
                            event.code === 1001 ? 'Going away' :
                                'Max attempts reached or reconnection disabled');
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('disconnected');
                isConnectingRef.current = false;
            };

        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            setConnectionStatus('disconnected');
            isConnectingRef.current = false;

            if (shouldReconnectRef.current && reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current++;
                const delay = 3000;

                reconnectTimeoutRef.current = setTimeout(() => {
                    if (shouldReconnectRef.current) {
                        connectWebSocket();
                    }
                }, delay);
            }
        }
    };

    useEffect(() => {
        if (user?.id) {
            shouldReconnectRef.current = true;
            connectWebSocket();
        }

        return () => {
            console.log('Cleaning up WebSocket connection');
            shouldReconnectRef.current = false;

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }

            if (wsRef.current) {
                wsRef.current.close(1000, 'Component unmounting');
                wsRef.current = null;
            }
        };
    }, [user?.id]);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        console.log('Attempting to send message...');
        console.log('WebSocket state:', wsRef.current?.readyState);
        console.log('Connection status:', connectionStatus);

        // Add user message to chat immediately
        const userMessage = addMessage(inputText, 'user');

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
                // Send message in the format your backend expects
                const messageData = {
                    type: 'question',
                    content: inputText,
                    userId: user?.id || 'anonymous',
                    timestamp: new Date().toISOString(),
                    messageId: userMessage.id
                };

                console.log('Sending message to server:', messageData);
                wsRef.current.send(JSON.stringify(messageData));

                setInputText('');
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                }, 30000);

                console.log('Message sent successfully');

            } catch (error) {
                console.error('Error sending message:', error);
                setInputText('');
                addMessage('Failed to send message. Please try again.', 'other');
                setIsTyping(false);
            }

        } else {
            console.log('WebSocket not ready for sending:', {
                exists: !!wsRef.current,
                readyState: wsRef.current?.readyState,
                OPEN: WebSocket.OPEN
            });

            setInputText('');

            setTimeout(() => {
                addMessage('Message could not be sent. Connection not ready. Please wait a moment and try again.', 'other');
            }, 500);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    const handleManualReconnect = () => {
        console.log('Manual reconnect triggered');
        reconnectAttempts.current = 0;
        shouldReconnectRef.current = true;

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        connectWebSocket();
    };

    const isConnected = connectionStatus === 'connected' && wsRef.current?.readyState === WebSocket.OPEN;
    const canSendMessage = isConnected && inputText.trim();

    return (
        <div className="flex flex-col text-white w-full">
            <div className="[375]:h-[40vh] h-[60vh] overflow-y-auto p-4 space-y-4 pb-24">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-8">
                        <p>Welcome to Yogeshwari AI Support!</p>
                        <p className="text-sm mt-2">Ask me anything to get started...</p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        style={{fontStyle: "VT323"}}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                                message.sender === 'user'
                                    ? 'bg-green-600 text-white rounded-br-sm'
                                    : 'bg-gray-700 text-white rounded-bl-sm'
                            }`}
                        >
                            <p className="text-xl whitespace-pre-wrap"
                               style={{fontStyle: "VT323"}}>{message.text}</p>
                            <p className={`text-m mt-1 ${
                                message.sender === 'user' ? 'text-green-200' : 'text-gray-400'
                            }`}>
                                {formatTime(message.timestamp)}
                            </p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-sm max-w-xs">
                            <div className="flex space-x-1 items-center">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                     style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                     style={{animationDelay: '0.2s'}}></div>
                                <span className="text-xs text-gray-400 ml-2">
                                    AI is thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef}/>
            </div>

            <div className="p-4 border-t border-gray-700 fixed bottom-0 left-0 right-0 z-50">
                <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isConnected ? "Ask me anything..." : "Connecting to AI..."}
                            disabled={!isConnected}
                            className="w-full px-4 py-3 bg-gray-700 text-white rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 disabled:opacity-50"
                        />
                        {process.env.NODE_ENV === 'development' && (
                            <div className="absolute right-16 top-1/2 transform -translate-y-1/2 text-xs">
                                <span
                                    className={`px-1 rounded ${wsRef.current?.readyState === WebSocket.OPEN ? 'bg-green-600' : 'bg-red-600'}`}>
                                    WS:{wsRef.current?.readyState || 'null'}
                                </span>
                            </div>
                        )}
                        {sessionInfo && (
                            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                                <div className="w-2 h-2 bg-green-400 rounded-full" title="AI Session Active"></div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!canSendMessage}
                        className={`p-3 rounded-full transition-colors ${
                            canSendMessage
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                        title={!isConnected ? 'Not connected to AI' : !inputText.trim() ? 'Enter a message' : 'Send to AI'}
                    >
                        <Send size={20}/>
                    </button>
                </div>
                {!isConnected && (
                    <div className="text-center mt-2">
                        <span className="text-xs text-yellow-400">
                            {connectionStatus === 'connecting' ? 'Connecting to AI agent...' : 'Connection lost. Attempting to reconnect...'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBox;
