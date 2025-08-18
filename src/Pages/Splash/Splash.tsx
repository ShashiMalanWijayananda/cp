import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./splash.css"

const Splash: FC = () => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Loading');
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Navigate to /menu after loading completes
                    setTimeout(() => {
                        navigate('/registration', {replace: true});
                    }, 500); // Small delay to show 100% before navigating
                    return 100;
                }
                return prev + (100 / 30); // 3 second duration (100ms * 30 = 3000ms)
            });
        }, 100);

        return () => clearInterval(interval);
    }, [navigate]);

    useEffect(() => {
        const textInterval = setInterval(() => {
            setLoadingText(prev => {
                if (prev === 'Loading...') return 'Loading';
                if (prev === 'Loading') return 'Loading.';
                if (prev === 'Loading.') return 'Loading..';
                return 'Loading...';
            });
        }, 500);

        return () => clearInterval(textInterval);
    }, []);

    const blocks = Array.from({ length: 10 }, (_, i) => (
        <div
            key={i}
            style={{
                width: '30px',
                height: '20px',
                backgroundColor: i < Math.floor(progress / 10) ? '#9FFF82' : 'transparent',
                border: '1px solid #9FFF82',
                display: 'inline-block',
                margin: '0 1px'
            }}
        />
    ));

    return (
        <div className="main">
            <div style={{
                backgroundColor: '#0A2314',
                color: '#9FFF82',
                fontFamily: 'Courier New, monospace',
                fontSize: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
                padding: '20px'
            }}>
                {/* Logo */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '60px'
                }}>
                    <img src="images/logo/Logo-animate-wothout-Blink1.gif" alt="Logo" style={{ maxWidth: '300px', maxHeight: '300px' }}/>
                </div>

                {/* Progress section - now centered */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Loading text - centered */}
                    <div style={{
                        marginBottom: '20px',
                        color: '#ffffff',
                        fontFamily: 'VT323, monospace',
                        fontSize: '30px'
                    }}>
                        {loadingText}
                    </div>

                    {/* Progress blocks - centered */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        {blocks}
                    </div>

                    {/* Percentage - centered */}
                    <div style={{
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        fontFamily: 'VT323, monospace'
                    }}>
                        {Math.floor(progress)}%
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Splash;
