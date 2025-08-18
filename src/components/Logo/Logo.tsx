import React, {FC} from "react";
import "./logo.css"

interface LogoProps {
    variant?: 'standard' | 'small' | 'header' | 'centered';
    className?: string;
    page?: 'system-menu' | 'mission' | 'about' | 'contact' | 'profile' | 'login' | 'authorize-tickets' |'registration';
}

export const Logo: FC<LogoProps> = ({
                                        variant = 'standard',
                                        className = '',
                                        page
                                    }) => {

    const getContainerClass = () => {
        let baseClass = '';

        switch (variant) {
            case 'header':
                baseClass = 'header-logo-container';
                break;
            case 'centered':
                baseClass = 'centered-logo-container';
                break;
            case 'small':
                baseClass = 'logo-container';
                break;
            default:
                baseClass = 'logo-container';
                break;
        }

        // Add page-specific class if provided
        const pageClass = page ? `${page}-page` : '';

        return `${baseClass} ${pageClass} ${className}`.trim();
    };

    const getLogoClass = () => {
        switch (variant) {
            case 'centered':
                return 'logo-small';
            default:
                return 'logo-standard';
        }
    };

    // Special handling for login page
    if (page === 'login') {
        return (
            <React.Fragment>
                <div className={`logo ${page}-page ${className}`}>
                    <img src="images/logo/Logo-animate-wothout-Blink1.gif" alt="Yogeshwari Logo"/>
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <div className={getContainerClass()}>
                <div className={`general-logo ${getLogoClass()}`}>
                    <img src="images/logo/Logo-animate-wothout-Blink1.gif" alt="Yogeshwari Logo"/>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Logo;
