import React, { useEffect, useRef, useState } from "react";
import { useLogin } from "../../context/login.context";
import { useNavigate } from "react-router-dom";
import "./ChatBox.css";

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
  const [timestamp, setTimestamp] = useState<string>(new Date().toLocaleString());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const isConnectingRef = useRef(false);
  const shouldReconnectRef = useRef(true);
  const { user } = useLogin();
  const navigate = useNavigate();

  // Update timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="chat-container">
      {/* Desktop Header Navigation Bar */}
      {/* <div className="chat-header-nav">
        <div className="chat-nav-links">
          <div className="chat-nav-link" onClick={() => navigate("/")}>
            Home
          </div>
          <div className="chat-nav-link" onClick={() => navigate("/my-profile")}>
            Profile
          </div>
          <div className="chat-nav-link active">
            Chat
          </div>
          <div className="chat-nav-link" onClick={() => navigate("/mission")}>
            Buy Tickets
          </div>
          <div className="chat-nav-link" onClick={() => navigate("/my-tickets")}>
            My Tickets
          </div>
          <div className="chat-nav-link" onClick={() => navigate("/about")}>
            About
          </div>
          <div className="chat-nav-link" onClick={() => navigate("/terms")}>
            Protocol
          </div>
          <div className="chat-nav-link" onClick={() => navigate("/contact")}>
            Support
          </div>
        </div>
        <div className="chat-timestamp">{timestamp}</div>
      </div> */}



      {/* Messages container */}
      <div className="chat-messages-container">
        {messages.length === 0 && (
          <div className="welcome-message-container yog-message">
            {/*<div className="welcome-message">*/}
            {/*  Hello Agent {user?.lastName || 'Kasun'},{'\n'}*/}
            {/*  Welcome to Yogeshwari Archives. The tale awaits your inquiry*/}
            {/*</div>*/}
            <div className="message-timestamp">{formatTime(new Date())}</div>
          </div>
        )}

        {messages.map((m) => {
          const isAgent = m.sender === "user";
          return (
            <div
              key={m.id}
              className={`message-container ${isAgent ? "agent-message" : "yog-message"}`}
            >
              <div className="message-content">{m.text}</div>
              <div className="message-timestamp">{formatTime(m.timestamp)}</div>
            </div>
          );
        })}

        {isTyping && (
          <div className="typing-indicator yog-message">
            <div className="typing-content">
              <span className="typing-dots">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Ask Anything..." : "Connecting to AI..."}
            disabled={!isConnected}
            className="chat-input"
          />
          <button
            onClick={handleSendMessage}
            disabled={!canSendMessage}
            className="chat-send-button"
            title={!isConnected ? "Not connected to AI"
                  : !inputText.trim() ? "Enter a message" : "Send to AI"}
          >
            Send
          </button>
        </div>

        {!isConnected && (
          <div className="connection-status">
            {connectionStatus === "connecting"
              ? "Connecting to AI agent..."
              : "Connection lost. Attempting to reconnect..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
