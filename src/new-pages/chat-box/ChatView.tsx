import React, {FC} from "react";
import CommonHeader from "../../components/CommonTitle/CommonHeader";
import ChatBox from "./ChatBox";

const ChatView: FC = () => {

    return (<React.Fragment>
        <div className="w-full h-auto p-5 gap-4 flex flex-col fixed">
            <ChatBox/>
        </div>
    </React.Fragment>)

}

export default ChatView
