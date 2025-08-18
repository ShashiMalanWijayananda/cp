import "./LockScreen.css"
import React, {FC, useEffect, useState} from "react";
import Divergence from "react-divergence-meter";
import ReactGA from 'react-ga4'
import { TypeAnimation } from 'react-type-animation';

interface Props {
    milliseconds?: number;
}

const LockScreen: FC<Props> = ({milliseconds}) => {
    const [step, setStep] = useState(0);
    const paragraphs = [
        '***',
        'The system is locked. But not for long.',
        'A new transmission is coming. Watch it!',
        'A single detail will shift everything.',
        'When the right person follows the clues and makes the move, the system will unlock. Once unlocked, the gateway will open for all remaining agents.',
        "And what's hidden will finally be revealed.",
        '— Yogeshwari',
        '***'
    ];
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

    const formatTimeUnit = (value: number, digits: number = 2): string => {
        return String(value).padStart(digits, '0');
    };

    const getDigits = (value: number, totalDigits: number): string[] => {
        const formatted = formatTimeUnit(value, totalDigits);
        return formatted.split('');
    };

    const daysDigits = getDigits(countdown.days, 2);
    const hoursDigits = getDigits(countdown.hours, 2);
    const minutesDigits = getDigits(countdown.minutes, 2);
    const secondsDigits = getDigits(countdown.seconds, 2);
    const millisecondsDigits = getDigits(countdown.milliseconds, 3);

    useEffect(() => {
        ReactGA.send({hitType: 'pageview', page: window.location.pathname + window.location.search});
    }, []);
    return (
        <React.Fragment>
            <div className="lock-screen-view">
                <div className="lock-screen-logo">
                    <img src="images/logo/Logo-animate-wothout-Blink.gif" alt="Logo" width={250}/>
                </div>

                <div className="lock-screen-title">MISSION ENTRY BLOCKED</div>
                <div className="meter">
                    <div className="meter-group">
                        <div className="digits-container">
                            <Divergence value={daysDigits[0]}/>
                            <Divergence value={daysDigits[1]}/>
                        </div>
                        {/*<label>DAYS</label>*/}
                    </div>

                    <div className="meter-separator">:</div>

                    <div className="meter-group">
                        <div className="digits-container">
                            <Divergence value={hoursDigits[0]}/>
                            <Divergence value={hoursDigits[1]}/>
                        </div>
                        {/*<label>HOURS</label>*/}
                    </div>

                    <div className="meter-separator">:</div>

                    <div className="meter-group">
                        <div className="digits-container">
                            <Divergence value={minutesDigits[0]}/>
                            <Divergence value={minutesDigits[1]}/>
                        </div>
                        {/*<label>MINUTES</label>*/}
                    </div>

                    <div className="meter-separator">:</div>

                    <div className="meter-group">
                        <div className="digits-container">
                            <Divergence value={secondsDigits[0]}/>
                            <Divergence value={secondsDigits[1]}/>
                        </div>
                        {/*<label>SECONDS</label>*/}
                    </div>

                    <div className="meter-separator">:</div>

                    <div className="meter-group">
                        <div className="digits-container">
                            <Divergence value={millisecondsDigits[0]}/>
                            <Divergence value={millisecondsDigits[1]}/>
                            {/*<Divergence value={millisecondsDigits[2]} />*/}
                        </div>
                        {/*<label>MILLISECONDS</label>*/}
                    </div>
                </div>
                <div className="lock-screen-content">

                </div>
                <div className="lock-footer">
                    {paragraphs.map((text, index) =>
                        index <= step ? (
                            <TypeAnimation
                                key={index}
                                sequence={[
                                    text,
                                    () => {
                                        if (step === index) {
                                            setTimeout(() => setStep((prev) => prev + 1), 800);
                                        }
                                    },
                                ]}
                                wrapper="p"
                                speed={80}
                                repeat={0}
                                cursor={false}
                            />
                        ) : null
                    )}
                </div>

            </div>
        </React.Fragment>
    )
}

export default LockScreen;
