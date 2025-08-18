import React, {FC, useEffect, useState} from "react";
import "./SystemMenu.css"
import {useNavigate} from "react-router-dom";
import {useLogin} from "../../context/login.context";
import {useAppContext} from "../../context/app.context";
import {useQueue} from "../../graphql/graphql-subscrption";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";
import MenuGrid from "../../components/MenuGrid/MenuGrid";

const SystemMenu: FC = () => {
    const navigate = useNavigate();
    const {user} = useLogin();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth <= 480);
    const {appContext} = useAppContext();
    const {subscribe} = useQueue()

    const isDesktop = () => {
        const userAgent = navigator.userAgent;
        return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(userAgent);
    };

    const getGreetingByTime = (): string => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 18) return 'Good Evening';
        return 'Good Evening';
    };

    const scrollingText = `${getGreetingByTime()}, Agent ${user?.lastName}. Navigate where you want`;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsSmallDevice(window.innerWidth <= 480);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        navigate("/login");
    };

    const [timestamp, setTimestamp] = useState(new Date().toLocaleString());

    useEffect(() => {
        subscribe();
        const interval = setInterval(() => {
            setTimestamp(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleNavigation = () => {
        if (!isDesktop()) {
            appContext.showSuccessDialog(
                "REQUIRED!!!",
                "For the complete Yogeshwari experience, switch to desktop view.\n" +
                "Some missions can only be unlocked on a larger screen."
            );
        } else {
            navigate("/landing-page")
        }
    }

    return (
        <React.Fragment>

            <div className="w-full p-5 gap-4 flex flex-col items-center justify-center fixed lg:sticky">

                <MenuGrid onClickProfile={() => navigate("/my-profile")} onClickMyTicket={() => navigate("/my-tickets")}
                          onClickChat={() => navigate("/chat")} onClickAbout={() => navigate("/about")}
                          onClickSupport={() => navigate("/contact")} onClickProtocol={() => navigate("/terms")}
                          onClickExplore={handleNavigation} onClickBuyTicket={() => navigate("/mission")}/>
                <GlobalFooter
                    text={scrollingText}
                />
            </div>
        </React.Fragment>
    )
}

export default SystemMenu;
