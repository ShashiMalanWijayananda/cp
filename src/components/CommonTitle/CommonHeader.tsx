import React, {FC} from "react";
import "./CommonHeader.css";

const CommonHeader: FC = () => {

    return (
        <React.Fragment>
            <div className="common-header-container">
                <div className="common-header-logo">
                    <img
                        src="images/logo/Logo-animate-wothout-Blink1.gif"
                        alt="Yogeshwari Logo"
                        style={{filter: 'sepia(1) saturate(0) brightness(0.8) hue-rotate(20deg)'}}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

export default CommonHeader;