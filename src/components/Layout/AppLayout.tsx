import React, {FC} from "react";
import {Outlet} from 'react-router-dom';
import CustomDialog from "../CustomDialog/CustomDialog";
import Header from "../Header/Header";
import CommonHeader from "../CommonTitle/CommonHeader";

const AppLayout: FC = () => {
    return (
        <React.Fragment>
            <div className="w-full h-[100vh] overflow-hidden">
                <Header/>
                
                <CustomDialog/>
                
                {/* Main scrollable content area - logo always scrolls with content */}
                <div className="w-full h-full overflow-y-auto overflow-x-hidden">
                    <div className="w-full min-h-full">
                        {/* Logo inside scrollable content for ALL screen sizes */}
                        <div className="w-full">
                            <CommonHeader/>
                        </div>
                        
                        {/* Content wrapper - no padding needed since no fixed elements */}
                        <div className="w-full">
                            <Outlet/>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default AppLayout;