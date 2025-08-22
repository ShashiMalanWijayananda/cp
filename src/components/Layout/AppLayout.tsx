import React, {FC} from "react";
import {Outlet} from 'react-router-dom';
import CustomDialog from "../CustomDialog/CustomDialog";
import Header from "../Header/Header";
import CommonHeader from "../CommonTitle/CommonHeader";
import {useLocation, useNavigate} from "react-router-dom";

const AppLayout: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <React.Fragment>
            <div className="w-full h-[100vh] overflow-hidden">
                <Header/>
                <CustomDialog/>

                {location.pathname.includes("landing-page") ? (
                    <Outlet/>
                ) : (
                    <>
                        <div className="w-full h-full min-[1024px]: overflow-y-overflow-x-hidden overflow-y-auto overflow-x-hidden">
                            <div className="w-full min-h-full">
                                <div className="w-full fixed bg-brand-forest z-50 min-[1024px]:pt-5">
                                    <CommonHeader/>
                                </div>
                                <div className="w-full pt-[150px] lg:pt-[250px]">
                                    <Outlet/>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </React.Fragment>
    );
}

export default AppLayout;
