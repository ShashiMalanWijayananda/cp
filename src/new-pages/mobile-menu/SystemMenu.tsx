import React, { FC, useEffect, useState } from "react";
import "./SystemMenu.css";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../context/login.context";
import { useAppContext } from "../../context/app.context";
import { useQueue } from "../../graphql/graphql-subscrption";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";

const SystemMenu: FC = () => {
    const navigate = useNavigate();
    const { user, logoutUser } = useLogin();
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
            {/* Desktop-only header bar with timestamp and logout */}
            <div className="sys-menu-header">
                <div className="sys-menu-header-left"></div>
                <div className="sys-menu-header">
                <div className="sys-menu-header-left"></div>
                <div className="sys-menu-header-center"></div>
                <div className="sys-menu-header-right">
                    <div className="sys-menu-timestamp" aria-live="polite">{timestamp}</div>
                    <button className="sys-menu-logout-btn" onClick={() => logoutUser()}>
                        <img src="images/icon/exit.svg" className="sys-menu-logout-icon" alt="Logout" />
                    </button>
                </div>
            </div>
                <div className="sys-menu-header-right">
                    <button className="sys-menu-logout-btn" onClick={() => logoutUser()}>
                        <img src="images/icon/exit.svg" className="sys-menu-logout-icon" alt="Logout" />
                    </button>
                </div>
            </div>

            {/* Mobile-only logout button */}
            <button className="sys-menu-mobile-logout" onClick={() => logoutUser()}>
                <img src="images/icon/exit.svg" className="sys-menu-mobile-logout-icon" alt="Logout" />
            </button>

            {/* Main page container */}
            <main className="sys-menu-page" role="main">
                <section className="sys-menu-layout">
                    
                    {/* Menu Grid Container - Using unique SystemMenu classes */}
                    <div className="sys-menu-container">
                        
                        {/* Top Grid - 6 Small Menu Items */}
                        <div className="sys-menu-grid">
                            
                            {/* Profile */}
                            <div className="sys-menu-item" onClick={() => navigate("/my-profile")}>
                                <div className="sys-menu-icon">
                                    <img src="images/icon/profile.svg" alt="Profile" />
                                </div>
                                <span className="sys-menu-label">Profile</span>
                            </div>

                            {/* My Tickets */}
                            <div className="sys-menu-item" onClick={() => navigate("/my-tickets")}>
                                <div className="sys-menu-icon">
                                    <img src="images/icon/ticket.svg" alt="My Tickets" />
                                </div>
                                <span className="sys-menu-label">My Tickets</span>
                            </div>

                            {/* Chat */}
                            <div className="sys-menu-item" onClick={() => navigate("/chat")}>
                                <div className="sys-menu-icon">
                                    <img src="images/icon/chat.svg" alt="Chat" />
                                </div>
                                <span className="sys-menu-label">Chat</span>
                            </div>

                            {/* About */}
                            <div className="sys-menu-item" onClick={() => navigate("/about")}>
                                <div className="sys-menu-icon">
                                    <img src="images/icon/about.svg" alt="About" />
                                </div>
                                <span className="sys-menu-label">About</span>
                            </div>

                            {/* Support */}
                            <div className="sys-menu-item" onClick={() => navigate("/contact")}>
                                <div className="sys-menu-icon">
                                    <img src="images/icon/Vector.svg" alt="Support" />
                                </div>
                                <span className="sys-menu-label">Support</span>
                            </div>

                            {/* Protocol */}
                            <div className="sys-menu-item" onClick={() => navigate("/terms")}>
                                <div className="sys-menu-icon">
                                    <img src="images/icon/terms.svg" alt="Protocol" />
                                </div>
                                <span className="sys-menu-label">Protocol</span>
                            </div>

                        </div>

                        {/* Bottom Buttons - 2 Large Buttons */}
                        <div className="sys-menu-buttons">
                            
                            {/* Explore Yogeshwari */}
                            <div className="sys-menu-large-btn" onClick={handleNavigation}>
                                <div className="sys-menu-large-icon">
                                    <img src="images/icon/explore.svg" alt="Explore" />
                                </div>
                                <span className="sys-menu-large-label">Explore Yogeshwari</span>
                            </div>

                            {/* Buy Ticket */}
                            <div className="sys-menu-large-btn highlight" onClick={() => navigate("/mission")}>
                                <div className="sys-menu-large-icon">
                                    <img src="images/icon/buy.svg" alt="Buy Ticket" />
                                </div>
                                <span className="sys-menu-large-label">Buy Ticket</span>
                            </div>

                        </div>
                        
                    </div>

                </section>
            </main>

            {/* Global scrolling footer */}
            <GlobalFooter text={scrollingText} />
        </>
    );
};

export default SystemMenu;