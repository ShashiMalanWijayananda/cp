import React, {FC} from 'react';
import './notifibar.css';


interface CustomAlertProps {
    title?: string;
    message?: string;

}

const CustomAlert: FC<CustomAlertProps> = ({title, message}) => {
    return (
        <div className="retro-no-events-container">
            <div className="retro-screen">
                <div className="screen-content">
                    <div className="pixel-icon">
                        <div className="calendar-icon">
                            <div className="calendar-top"></div>
                            <div className="calendar-body">
                                <div className="calendar-x"></div>
                            </div>
                        </div>
                    </div>

                    <h3 className="retro-heading">{title ?? ""}</h3>

                    <div className="terminal-text">
                        <p className="message">{message ?? ""}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;
