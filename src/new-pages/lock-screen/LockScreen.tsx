import "./LockScreen.css"
import React, {FC, useEffect, useState} from "react";
import Divergence from "react-divergence-meter";
import ReactGA from 'react-ga4'
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../context/login.context";
import { useAppContext } from "../../context/app.context";
import { useQueue } from "../../graphql/graphql-subscrption";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";
import Marquee from "react-fast-marquee";

interface Props {
    milliseconds?: number;
}

const LockScreen: FC<Props> = ({milliseconds}) => {
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

    // Generate scrolling footer text
    const scrollingText = `****MISSION ENTRY BLOCKED **** MISSION ENTRY BLOCKED **** MISSION ENTRY BLOCKED **** MISSION ENTRY BLOCKED **** MISSION ENTRY BLOCKED **** MISSION ENTRY BLOCKED **** MISSION ENTRY BLOCKED **** MISSION ENTRY BLOCKED **** MISSION ENTRY BLOCKED **** MISSION ENTRY BLOCKED **** `;

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

    // Continuous text for typing animation - ALL TEXT AS ONE STRING
    const continuousText = 'THE SYSTEM IS LOCKED. BUT NOT FOR LONG. A NEW TRANSMISSION IS COMING. WATCH IT! A SINGLE DETAIL WILL SHIFT EVERYTHING. WHEN THE RIGHT PERSON FOLLOWS THE CLUES AND MAKES THE MOVE, THE SYSTEM WILL UNLOCK. ONCE UNLOCKED, THE GATEWAY WILL OPEN FOR ALL REMAINING AGENTS. AND WHAT\'S HIDDEN WILL FINALLY BE REVEALED. — YOGESHWARI ';

    // Countdown logic
    const calculateCountdown = (targetTimestamp: number) => {
        const now = Date.now();
        const difference = targetTimestamp - now;

        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
                isExpired: true,
                totalSeconds: 0
            };
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const ms = Math.floor(difference % 1000);

        return {
            days,
            hours,
            minutes,
            seconds,
            milliseconds: ms,
            isExpired: false,
            totalSeconds: Math.floor(difference / 1000)
        };
    };

    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        isExpired: false
    });

    useEffect(() => {
        const updateCountdown = () => {
            if (milliseconds) {
                const result = calculateCountdown(milliseconds);
                setCountdown(result);
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 100);

        return () => clearInterval(interval);
    }, [milliseconds]);

    // State for countdown display animation
    const [displayedCountdown, setDisplayedCountdown] = useState('00:00:00:00:00');
    const [isAnimatingCountdown, setIsAnimatingCountdown] = useState(false);

    // Format countdown as string
    const formatCountdownString = (countdown: any): string => {
        const days = String(countdown.days).padStart(2, '0');
        const hours = String(countdown.hours).padStart(2, '0');
        const minutes = String(countdown.minutes).padStart(2, '0');
        const seconds = String(countdown.seconds).padStart(2, '0');
        const ms = String(Math.floor(countdown.milliseconds / 10)).padStart(2, '0');
        return `${days}:${hours}:${minutes}:${seconds}:${ms}`;
    };

    // Animate countdown display character by character
    useEffect(() => {
        if (countdown && !isAnimatingCountdown) {
            const newCountdownString = formatCountdownString(countdown);
            if (newCountdownString !== displayedCountdown) {
                setIsAnimatingCountdown(true);
                
                let currentIndex = 0;
                const animateNextCharacter = () => {
                    if (currentIndex <= newCountdownString.length) {
                        setDisplayedCountdown(newCountdownString.slice(0, currentIndex));
                        currentIndex++;
                        setTimeout(animateNextCharacter, 50);
                    } else {
                        setIsAnimatingCountdown(false);
                    }
                };
                animateNextCharacter();
            }
        }
    }, [countdown, displayedCountdown, isAnimatingCountdown]);

    // State for continuous typing animation
    const [typingKey, setTypingKey] = useState(0);

    // Reset typing animation to loop continuously
    useEffect(() => {
        const resetTyping = () => {
            setTypingKey(prev => prev + 1);
        };

        // Reset after the text finishes typing (approximate timing)
        const resetTimer = setTimeout(resetTyping, continuousText.length * 50 + 3000);

        return () => clearTimeout(resetTimer);
    }, [typingKey, continuousText.length]);

    useEffect(() => {
        ReactGA.send({hitType: 'pageview', page: window.location.pathname + window.location.search});
    }, []);

    return (
        <React.Fragment>
            {/* Desktop-only header bar with timestamp */}
            <div className="lock-header">
                <div className="lock-header-left"></div>
                <div className="lock-header-center"></div>
                <div className="lock-header-right">
                    <div className="lock-timestamp" aria-live="polite">{timestamp}</div>
                </div>
            </div>

            {/* Main lock screen container */}
            <div className="lock-screen-view">
                <div className="lock-screen-layout">
                    
                    {/* Logo Section */}
                    <div className="lock-screen-logo">
                        <img src="images/logo/Logo-animate-wothout-Blink.gif" alt="Logo" />
                    </div>

                    {/* YOGESHWARI Title with Retro Animation */}
                    <div className="lock-screen-title">
                        <img 
                            src="/images/lock screen.svg" 
                            alt="YOGESHWARI" 
                            className="yogeshwari-svg"
                        />
                    </div>

                    {/* Countdown Display - Bold Text */}
                    <div className="countdown-display">
                        <div className="countdown-text">
                            {displayedCountdown}
                        </div>
                    </div>

                    {/* System Logs Container - Fixed Height with Continuous Typing */}
                    <div className="lock-screen-logs-container">
                        <div className="lock-screen-logs-header">
                            {/* Marquee for continuous scrolling system logs - same as GlobalFooter */}
                            <Marquee className="system-logs-marquee" speed={50} gradient={false}>
                                <span className="system-logs-text">
                                    ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ● SYSTEM LOGS ●
                                </span>
                            </Marquee>
                        </div>
                        <div className="lock-screen-logs-content">
                            {/* Continuous typing animation - no line breaks */}
                            <div className="continuous-typing-content">
                                <TypeAnimation
                                    key={typingKey} // Force re-render for looping
                                    sequence={[
                                        continuousText,
                                        2000, // Pause at the end
                                        '', // Clear text
                                        500, // Brief pause before restart
                                    ]}
                                    wrapper="span"
                                    speed={60} // Typing speed
                                    repeat={Infinity} // Loop infinitely
                                    cursor={true}
                                    style={{ 
                                        display: 'inline',
                                        wordWrap: 'break-word',
                                        whiteSpace: 'normal'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global scrolling footer */}
                <GlobalFooter text={scrollingText} />
            </div>
        </React.Fragment>
    )
}

export default LockScreen;