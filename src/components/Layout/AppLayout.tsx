import React, {FC} from "react";
import {Outlet} from 'react-router-dom';
import CustomDialog from "../CustomDialog/CustomDialog";
import Header from "../Header/Header";
import CommonHeader from "../CommonTitle/CommonHeader";

const AppLayout: FC = () => {
    return (
        <React.Fragment>
            <div className="flex-col justify-center overflow-y-hidden h-[100vh]">
                <Header/>
               <div className="h-full fixed lg:mt-[4vh] w-full">
                   <CommonHeader/>
               </div>
                <CustomDialog/>
                <div>
                    <div
                        className="flex w-full md:w-1/2 flex-col justify-center  mx-auto  mt-[10vh] h-[85vh] lg:h-[100vh]">
                        <Outlet/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default AppLayout;
