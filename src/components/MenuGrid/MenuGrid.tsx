import {FC} from "react";
import MenuButton from "./MenuButton";
import MenuLargeButton from "./MenuLargeButton";

export interface MenuGridProps {
    onClickProfile?: () => void
    onClickMyTicket?: () => void
    onClickChat?: () => void
    onClickAbout?: () => void
    onClickSupport?: () => void
    onClickProtocol?: () => void
    onClickExplore?: () => void
    onClickBuyTicket?: () => void
}

const MenuGrid: FC<MenuGridProps> = ({
                                         onClickProfile,
                                         onClickMyTicket,
                                         onClickChat,
                                         onClickAbout,
                                         onClickSupport,
                                         onClickProtocol,
                                         onClickExplore,
                                         onClickBuyTicket
                                     }) => {


    return (
        <div className="flex items-center justify-center w-full">
            <div className="w-full">
                <div className="grid w-full grid-cols-1 min-[375px]:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <MenuButton label="Profile" icon="images/icon/profile.svg" onClick={onClickProfile}/>
                    <MenuButton label="My Tickets" icon="images/icon/ticket.svg" onClick={onClickMyTicket}/>
                    <MenuButton label="Chat" icon="images/icon/chat.svg" onClick={onClickChat}/>
                    <MenuButton label="About" icon="images/icon/about.svg" onClick={onClickAbout}/>
                    <MenuButton label="Support" icon="images/icon/Vector.svg" onClick={onClickSupport}/>
                    <MenuButton label="Protocol" icon="images/icon/terms.svg" onClick={onClickProtocol}/>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    <MenuLargeButton label="Explore Yogeshwari" icon="images/icon/explore.svg" highlight={false}
                                     onClick={onClickExplore}/>
                    <MenuLargeButton label="Buy Ticket" icon="images/icon/buy.svg" highlight={true}
                                     onClick={onClickBuyTicket}/>
                </div>
            </div>
        </div>
    );
};

export default MenuGrid;

