import React, {FC, ReactNode, useEffect} from 'react';

export interface AlertProps {
    message?: string | ReactNode;
    visible?: boolean;
    type?: 'error' | 'warning' | 'info' | 'success';
    onClose?: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
    className?: string;
}
const Alert: FC<AlertProps> = ({
                                   message,
                                   visible,
                                   type = 'error',
                                   onClose,
                                   autoClose = true,
                                   autoCloseDelay = 5000,
                                   className = ''
                               }) => {
    useEffect(() => {
        if (autoClose && visible && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [autoClose, visible, onClose, autoCloseDelay]);

    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case 'error':
                return (
                    <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                              stroke="currentColor" strokeWidth="2" fill="none"/>
                        <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="17" r="1" fill="currentColor"/>
                    </svg>
                );
            case 'info':
                return (
                    <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="8" r="1" fill="currentColor"/>
                    </svg>
                );
            case 'success':
                return (
                    <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 12l2 2l4 -4" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getAlertStyle = () => {
        const baseStyle = {
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '4px',
            minHeight: "80px", // Changed from height to minHeight to accommodate varying content
            display: 'flex',
            alignItems: 'flex-start', // Changed to flex-start for better alignment with multi-line content
            justifyContent: 'space-between',
            fontFamily: 'VT323',
            fontSize: '20px',
            backgroundColor: 'rgba(9,35,19,0.79)', // yo-dark-green
        };

        switch (type) {
            case 'success':
                return {
                    ...baseStyle,
                    color: '#9FFF82'
                };
            case 'error':
                return {
                    ...baseStyle,
                    color: '#c49799'
                };
            case 'warning':
                return {
                    ...baseStyle,
                    color: '#CFDF82'
                };
            default: // info
                return {
                    ...baseStyle,
                    color: '#c49799'
                };
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2147483647, // Maximum z-index value
            width: '60%'
        }}>
            <div style={getAlertStyle()} className={className}>
                <div style={{display: 'flex', alignItems: 'flex-start', flex: 1}}>
                    <div style={{marginRight: '12px', marginTop: '2px', flexShrink: 0}}>{getIcon()}</div>
                    <div style={{flex: 1}}>{message}</div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer',
                            color: 'inherit',
                            marginLeft: '12px',
                            flexShrink: 0
                        }}
                        aria-label="Close"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;
