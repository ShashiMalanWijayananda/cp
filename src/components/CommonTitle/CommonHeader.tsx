import React, {FC} from "react";


const CommonHeader: FC = () => {

    return (
        <React.Fragment>
            <div
                className="w-full flex flex-col items-center justify-center text-center gap-10 pt-[5vh] z-5">
                <div className="w-[120px] lg:w-[160px]"><img
                    src="images/logo/Logo-animate-wothout-Blink1.gif"
                    alt="Yogeshwari Logo"
                    style={{filter: 'sepia(1) saturate(0) brightness(0.8) hue-rotate(20deg)'}}
                /></div>
            </div>
        </React.Fragment>
    )
}

export default CommonHeader;
