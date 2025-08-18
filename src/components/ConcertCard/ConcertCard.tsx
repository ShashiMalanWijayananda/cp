import React, { FC, useState, useEffect } from 'react';
import './concert_card.css'
import {AudioManager} from "../MusciPlayer/AudioManager";
import {IEvent} from "../../interfaces/data.interfaces";



interface IVenueZone {
    id: string;
}

interface ConcertCardProps {
    event?: IEvent;
    onBookEvent?: (zone: IVenueZone) => void;
}

const ConcertCard: FC<ConcertCardProps> = ({
                                               event,
                                               onBookEvent
                                           }) => {
    const [isGlitching, setIsGlitching] = useState(false);
    const [scanline, setScanline] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);
    const [terminalText, setTerminalText] = useState('');
    const [blinkingCursor, setBlinkingCursor] = useState(true);

    // Glitch effect
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 150);
        }, 3000 + Math.random() * 2000);

        return () => clearInterval(glitchInterval);
    }, []);

    // Scanline animation
    useEffect(() => {
        const scanlineInterval = setInterval(() => {
            setScanline(prev => (prev + 1) % 100);
        }, 50);

        return () => clearInterval(scanlineInterval);
    }, []);

    // Terminal text animation
    useEffect(() => {
        const text = '> INITIALIZING CONCERT PROTOCOL...';
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                setTerminalText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);

        return () => clearInterval(typeInterval);
    }, []);

    // Blinking cursor
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setBlinkingCursor(prev => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, []);

    const handleBooking = () => {
        AudioManager.play("/sounds/switch-off.mp3").then(()=>console.log("play")).catch(error=>console.error(error));
        setIsLoading(true);
        setTimeout(() => {
            setAccessGranted(true);
            setIsLoading(false);

            // Reset after animation
            setTimeout(() => {
                setAccessGranted(false);
                if (onBookEvent && event) {

                    onBookEvent(event as unknown as IVenueZone);
                }
            }, 2000);
        }, 1500);
    };

    return (
        <div className="cyber-concert-container">
            <div className="background-grid">
                <div className="grid-container">
                    {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className="grid-cell" style={{ animationDelay: `${i * 0.05}s` }} />
                    ))}
                </div>
            </div>

            <div className={`card-container ${isGlitching ? 'glitching' : ''}`}>
                {/* Terminal Header */}
                <div className="terminal-header-concert hidden sm:block">
                    <div className="terminal-dots-concert">
                        <div className="terminal-dot red"></div>
                        <div className="terminal-dot yellow"></div>
                        <div className="terminal-dot green"></div>
                        <div className="terminal-title-concert">CONCERT.EXE</div>
                    </div>
                    <div className="terminal-text">
                        {terminalText}<span className={`blinking-cursor ${blinkingCursor ? 'opacity-100' : 'opacity-0'}`}>█</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className={`main-card ${isGlitching ? 'glitching' : ''}`}>
                    {/* CRT Scanlines inside card */}
                    <div className="scanlines-overlay">
                        <div className="scanline" style={{ top: `${scanline}%` }} />
                        <div className="scanlines-pattern" />
                    </div>

                    {/* Glitch overlay */}
                    {isGlitching && <div className="glitch-overlay" />}

                    <div className="card-content">
                        {/* ASCII Art Header */}
                        <div className="ascii-header">
                            <div className="ascii-border">
                                ╔══════════════════════════════╗
                            </div>
                            <h1 className="main-title">
                                {event.eventName?.toUpperCase()}
                                {isGlitching && (
                                    <>
                    <span className="glitch-text-red">
                      {event.eventName?.toUpperCase()}
                    </span>
                                        <span className="glitch-text-blue">
                      {event.eventName?.toUpperCase()}
                    </span>
                                    </>
                                )}
                            </h1>
                            <h2 className="subtitle">
                                ◊ LIVE TRANSMISSION ◊
                            </h2>
                            <div className="ascii-border">
                                ╚══════════════════════════════╝
                            </div>
                        </div>

                        {/* Cassette Deck Style Info */}
                        <div className="cassette-deck">
                            <div className="cassette-controls">
                                <div className="cassette-reels">
                                    <div className="cassette-reel">
                                        <div className="reel-spinner"></div>
                                    </div>
                                    <div className="cassette-reel">
                                        <div className="reel-spinner reverse"></div>
                                    </div>
                                </div>
                                <div className="recording-indicator">● REC</div>
                            </div>

                            {/* Waveform Visualization */}
                            <div className="waveform-container">
                                <svg className="waveform-svg" viewBox="0 0 200 20">
                                    {Array.from({ length: 30 }).map((_, i) => (
                                        <rect
                                            key={i}
                                            x={i * 6}
                                            y={10 - Math.sin(Date.now() * 0.005 + i * 0.3) * 6}
                                            width="3"
                                            height={Math.abs(Math.sin(Date.now() * 0.005 + i * 0.3) * 12)}
                                            fill="var(--color-lime)"
                                            className="waveform-bar"
                                        />
                                    ))}
                                </svg>
                            </div>

                            <div className="info-grid">
                                <div className="info-card">
                                    <div className="info-label">[VENUE]</div>
                                    <div className="info-value">{event.eventLocation}</div>
                                </div>
                                <div className="info-card">
                                    <div className="info-label">[TIME]</div>
                                    <div className="info-value-small">{event.eventDate}</div>
                                    <div className="info-value-small">{event.eventTime}</div>
                                </div>
                            </div>
                        </div>

                        {/* Radar/Oscilloscope */}
                        <div className="radar-section">
                            <div className="radar-container hidden sm:block">
                                <div className="radar-circle">
                                    <div className="radar-circle-inner">
                                        <div className="radar-circle-innermost">
                                            <div className="radar-dot"></div>
                                        </div>
                                    </div>
                                    {/* Radar Sweep */}
                                    <div className="radar-sweep"></div>
                                </div>
                                <div className="radar-label">RADAR</div>
                            </div>

                            {/* Terminal Stats */}
                            <div className="stats-panel">
                                <div className="stats-row">
                                    <span className="stats-label">SLOTS: </span>
                                    <span className="stats-value-accent">{400}</span>
                                </div>
                                <div className="stats-row">
                                    <span className="stats-label">STAT: </span>
                                    <span className="stats-value-status">ONLINE</span>
                                </div>
                            </div>
                        </div>

                        {/* Access Button */}
                        <div className="button-section">
                            {isLoading && (
                                <div className="loading-overlay">
                                    <div className="loading-content">
                                        <div className="loading-spinner">⟳</div>
                                        <div className="loading-text">AUTHENTICATING...</div>
                                    </div>
                                </div>
                            )}

                            {accessGranted && (
                                <div className="access-granted-overlay">
                                    <div className="loading-content">
                                        <div className="access-granted-icon">✓</div>
                                        <div className="access-granted-text">ACCESS GRANTED</div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleBooking}
                                disabled={isLoading}
                                className="purchase-button"
                            >
                                <div className="button-content">
                                    <span>►</span>
                                    <span>PURCHASE</span>
                                    <span>◄</span>
                                </div>
                            </button>
                        </div>

                        {/* Bottom ASCII Border */}
                        <div className="bottom-border hidden sm:block">
                            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConcertCard;
