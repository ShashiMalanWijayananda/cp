import React from "react";
import ChatBox from "./ChatBox";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";
import "./ChatView.css";
import {useLogin} from "../../context/login.context";

const ChatView: React.FC = () => {
    const {user} = useLogin();
  return (
    <div className="chat-view-container">
      <ChatBox />
      <GlobalFooter text={`**** Agent ${user?.lastName}, The truth is never given. Ask the right question, and it will reveal itself ****`} />
    </div>
  );
};

export default ChatView;
