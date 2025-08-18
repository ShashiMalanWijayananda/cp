import "./Header.css"
import React, {FC, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom"
import {useLogin} from "../../context/login.context";

const Header: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {logoutUser} = useLogin();
    const zone = new URLSearchParams(location.search);

    const [zoneId, setZoneId] = useState<string>(zone.get("zoneId"));

    useEffect(() => {
        setZoneId(zone.get("zoneId"))
    }, [zone])

    return (<React.Fragment>
        {!location.pathname.includes("landing-page") && !location.pathname.includes("room") && !location.pathname.includes("menu") &&

            <div className={`common-header ${zoneId}`}>
                <div className="header-nav-links">
                    <span className="button-text"
                          onClick={() => navigate("/menu")}>
                        {location.pathname?.includes("menu") && ">"}Home
                    </span>
                    <span className="button-text"
                          onClick={() => navigate("/my-profile")}>
                       {location.pathname?.includes("my-profile") && ">"}Profile
                    </span>
                    <span className="button-text"
                          onClick={() => navigate("/chat")}>
                        {location.pathname?.includes("chat") && ">"}Chat
                    </span>
                    <span className="button-text"
                          onClick={() => navigate("/mission")}>
                        {location.pathname?.includes("mission") && ">"}Buy Tickets
                    </span>
                    <span className="button-text"
                          onClick={() => navigate("/my-tickets")}>
                        {location.pathname?.includes("my-tickets") && ">"}My Tickets
                    </span>
                    <span className="button-text"
                          onClick={() => navigate("/about")}>
                        {location.pathname?.includes("about") && ">"}About
                    </span>
                    <span className="button-text"
                          onClick={() => navigate("/terms")}>
                        {location.pathname?.includes("terms") && ">"}Protocol
                    </span>
                    <span className="button-text"
                          onClick={() => navigate("/contact")}>
                        {location.pathname?.includes("contact") && ">"}Support
                    </span>
                </div>

                <div className="header-exit-button" onClick={() => logoutUser()}>
                    <img className="logout-icon" src="images/icon/exit.svg" alt="Go Back"/>
                </div>
            </div>}

        <div className="mob-navi">
            {!location.pathname.includes("menu") ?
                <span className="mob-navi-click" onClick={() => navigate("/menu")}>&lt;</span> :
                <span></span>
            }
            <div className="mobile-exit-button" onClick={() => logoutUser()}>
                <img src="images/icon/exit.svg" className="logout-icon" alt="Exit"/>
            </div>
        </div>
    </React.Fragment>)
}

export default Header;
