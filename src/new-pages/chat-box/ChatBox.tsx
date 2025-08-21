import React, { useEffect, useRef, useState } from "react";
import { useLogin } from "../../context/login.context";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

interface SystemMessage {
  type: "system" | "message" | "error" | "typing";
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
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<"connecting" | "connected" | "disconnected">("disconnected");
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
  const { user } = useLogin();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages]);

  const addMessage = (text: string, sender: "user" | "other", id?: string) => {
    const newMessage: Message = {
      id: id || `${Date.now()}-${Math.random()}`,
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const handleWebSocketMessage = (data: string) => {
    try {
      const response: SystemMessage = JSON.parse(data);
      switch (response.type) {
        case "system":
          if (response.sessionInfo) {
            setSessionInfo(response.sessionInfo);
            setActiveConnections(response.sessionInfo.activeConnections);
          }
          addMessage(response.message, "other");
          break;
        case "error":
          addMessage(`Error: ${response.message}`, "other");
          setIsTyping(false);
          break;
        case "typing":
          break;
        case "message":
        default:
          addMessage(response.message || data, "other");
          setIsTyping(false);
          break;
      }
    } catch {
      addMessage(data, "other");
      setIsTyping(false);
    }
  };

  const connectWebSocket = () => {
    if (isConnectingRef.current) return;
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) return;
      if (wsRef.current.readyState === WebSocket.CONNECTING) return;
    }
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      addMessage(
        "Connection failed after multiple attempts. Please click retry to try again.",
        "other"
      );
      return;
    }
    if (!shouldReconnectRef.current) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      isConnectingRef.current = true;
      setConnectionStatus("connecting");
      const wsUrl = `/chat?userId=${user?.id || "anonymous"}&lname=${
        user?.lastName
      }`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setConnectionStatus("connected");
        reconnectAttempts.current = 0;
        isConnectingRef.current = false;
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        const response = JSON.parse(event.data);
        handleWebSocketMessage(
          response?.type === "answer" ? response?.answer : event?.data
        );
      };

      wsRef.current.onclose = (event) => {
        setConnectionStatus("disconnected");
        isConnectingRef.current = false;

        const shouldReconnect =
          shouldReconnectRef.current &&
          event.code !== 1000 &&
          event.code !== 1001 &&
          reconnectAttempts.current < maxReconnectAttempts;

        wsRef.current = null;

        if (shouldReconnect) {
          reconnectAttempts.current++;
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttempts.current - 1),
            30000
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            if (shouldReconnectRef.current) connectWebSocket();
          }, delay);
        }
      };

      wsRef.current.onerror = () => {
        setConnectionStatus("disconnected");
        isConnectingRef.current = false;
      };
    } catch {
      setConnectionStatus("disconnected");
      isConnectingRef.current = false;
      if (shouldReconnectRef.current && reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          if (shouldReconnectRef.current) connectWebSocket();
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      shouldReconnectRef.current = true;
      connectWebSocket();
    }
    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
        wsRef.current = null;
      }
    };
  }, [user?.id]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userMessage = addMessage(inputText, "user");

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(
          JSON.stringify({
            type: "question",
            content: inputText,
            userId: user?.id || "anonymous",
            timestamp: new Date().toISOString(),
            messageId: userMessage.id,
          })
        );
        setInputText("");
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 30000);
      } catch {
        setInputText("");
        addMessage("Failed to send message. Please try again.", "other");
        setIsTyping(false);
      }
    } else {
      setInputText("");
      setTimeout(() => {
        addMessage(
          "Message could not be sent. Connection not ready. Please wait a moment and try again.",
          "other"
        );
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const isConnected =
    connectionStatus === "connected" &&
    wsRef.current?.readyState === WebSocket.OPEN;
  const canSendMessage = isConnected && inputText.trim();

  return (
    <div className="w-full flex flex-col text-[var(--yo-green)] padding-10px-19px">
      {/* Transcript: single-frame terminal style */}
      <div className="w-full border" style={{ borderColor: "var(--yo-green)" }}>
        <div className="p-5 md:p-6 lg:p-7 h-[60vh] md:h-[65vh] overflow-y-auto">
          {messages.length === 0 && (
            <div className="opacity-70 text-center">
              <p>Welcome to Yogeshwari Archives. The tale awaits your inquiry</p>
            </div>
          )}

          {messages.map((m) => {
            const isAgent = m.sender === "user";
            return (
              <div key={m.id} className="mb-6">
                <div
                  className="whitespace-pre-wrap leading-relaxed tracking-wide"
                  style={{
                    fontFamily:
                      'var(--font-primary, "VT323", ui-monospace, monospace)',
                  }}
                >
                  <span
                    className="pr-2"
                    style={{
                      color: isAgent
                        ? "var(--yo-blue)"
                        : "var(--yo-green)",
                    }}
                  >
                    {isAgent ? "Agent:" : "Yog  :"}
                  </span>
                  <span
                    style={{
                      color: isAgent
                        ? "var(--yo-blue)"
                        : "var(--yo-green)",
                    }}
                  >
                    {m.text}
                  </span>
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {formatTime(m.timestamp)}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="mb-6">
              <span className="inline-flex gap-1 items-center opacity-80">
                <span>Yog&nbsp;:</span>
                <span className="inline-block animate-pulse">●</span>
                <span className="inline-block animate-pulse [animation-delay:.1s]">
                  ●
                </span>
                <span className="inline-block animate-pulse [animation-delay:.2s]">
                  ●
                </span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar — fixed ABOVE footer */}
      <div className="fixed left-0 right-0 bottom-14 z-50 px-4 pb-0">
        <div className="w-full max-w-5xl mx-auto flex items-stretch gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isConnected ? "What is yogeshwari? what" : "Connecting to AI..."
            }
            disabled={!isConnected}
            className="flex-1 px-4 py-3 bg-[#2f3532] text-[var(--yo-green)] border outline-none"
            style={{
              borderColor: "var(--yo-green)",
              boxShadow: "none",
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!canSendMessage}
            className="px-6 font-medium"
            style={{
              background: "var(--yo-green)",
              color: "#0b0b0b",
              opacity: canSendMessage ? 1 : 0.5,
              cursor: canSendMessage ? "pointer" : "not-allowed",
            }}
            title={
              !isConnected
                ? "Not connected to AI"
                : !inputText.trim()
                ? "Enter a message"
                : "Send to AI"
            }
          >
            Send
          </button>
        </div>

        {!isConnected && (
          <div className="text-center mt-2">
            <span className="text-xs" style={{ color: "var(--yo-blue)" }}>
              {connectionStatus === "connecting"
                ? "Connecting to AI agent..."
                : "Connection lost. Attempting to reconnect..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
