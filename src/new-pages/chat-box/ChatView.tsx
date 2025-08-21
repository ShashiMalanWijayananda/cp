import React from "react";
import ChatBox from "./ChatBox";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";

const ChatView: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col gap-5 ">
     

      {/* Chat area */}
      <ChatBox />

  
       {/* Global scrolling footer message */}
      <GlobalFooter text="**** Select a Mission Date... ****" />
    </div>
  );
};

export default ChatView;
