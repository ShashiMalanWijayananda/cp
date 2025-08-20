import React, { FC, useEffect, useState } from "react";
import "./SystemMenu.css";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../context/login.context";
import { useAppContext } from "../../context/app.context";
import { useQueue } from "../../graphql/graphql-subscrption";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";
import MenuGrid from "../../components/MenuGrid/MenuGrid";

const SystemMenu: FC = () => {
    const navigate = useNavigate();
    const { user } = useLogin();
    const [timestamp, setTimestamp] = useState<string>(new Date().toLocaleString());
    const { appContext } = useAppContext();
    const { subscribe } = useQueue();

    // Check if device is desktop
    const isDesktop = (): boolean => {
        const userAgent = navigator.userAgent;
        return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(userAgent);
    };

    // Get greeting based on time of day
    const getGreetingByTime = (): string => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Generate scrolling footer text
    const scrollingText = `**** ${getGreetingByTime()}, Agent ${user?.lastName} **** NAVIGATE WHERE YOU WANT **** SYSTEM OPERATIONAL **** `;

    // Initialize subscriptions and timestamp
    useEffect(() => {
        subscribe();
        
        const interval = setInterval(() => {
            setTimestamp(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(interval);
    }, [subscribe]);

    // Handle navigation to main experience
    const handleNavigation = (): void => {
        if (!isDesktop()) {
            appContext.showSuccessDialog(
                "DESKTOP REQUIRED",
                "For the complete Yogeshwari experience, switch to desktop view.\n" +
                "Some missions can only be unlocked on a larger screen."
            );
        } else {
            navigate("/landing-page");
        }
    };

    return (
        <>
            {/* Desktop-only header bar with timestamp */}
            <div className="system-menu-header-bar">
                <div className="system-menu-timestamp" aria-live="polite">
                    {timestamp}
                </div>
            </div>

            {/* Main page container */}
            <main className="system-menu-page-container" role="main">
                <section className="system-menu-layout">
                    
                    {/* Menu Grid Component - Updated with proper CSS classes */}
                    <div className="w-full flex flex-col items-center justify-center gap-4">
                        <MenuGrid 
                            onClickProfile={() => navigate("/my-profile")} 
                            onClickMyTicket={() => navigate("/my-tickets")}
                            onClickChat={() => navigate("/chat")} 
                            onClickAbout={() => navigate("/about")}
                            onClickSupport={() => navigate("/contact")} 
                            onClickProtocol={() => navigate("/terms")}
                            onClickExplore={handleNavigation} 
                            onClickBuyTicket={() => navigate("/mission")}
                        />
                    </div>
                </section>
            </main>

            {/* Global scrolling footer */}
            <GlobalFooter text={scrollingText} />
        </>
    );
};

export default SystemMenu;