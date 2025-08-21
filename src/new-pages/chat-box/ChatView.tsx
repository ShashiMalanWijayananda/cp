import React from "react";
import ChatBox from "./ChatBox";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";
import "./ChatView.css";

const ChatView: React.FC = () => {
  return (
    <div className="chat-view-container">
      <ChatBox />
      <GlobalFooter text="**** Select a Mission Date... ****" />
    </div>
  );
};

export default ChatView;