import {FC} from "react";

export interface ButtonProps {
    onClick?: () => void;
    icon?: string;
    label?: string;
}

const MenuButton: FC<ButtonProps> = ({onClick, icon, label}) => {

    return (
        <div onClick={onClick}
             className="gap-4 border-2 border-green-400 bg-transparent cursor-pointer p-1 min-[375px]:p-2 sm:p-3 md:p-2 lg:p-3 flex flex-col items-center justify-center text-center text-white w-full h-[6rem] lg:h-[7rem]  mx-auto">
            <div
                className="w-6 h-6 min-[375px]:w-8 min-[375px]:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:h-8 mb-1 sm:mb-2 flex items-center justify-center">
                <img className="w-full h-full object-contain filter brightness-0 invert" src={icon}
                     alt={label || "icon"}/>
            </div>
            <span
                className="text-[10px] min-[375px]:text-lg md:text-xl lg:text-2xl font-medium font-jersey25">{label}</span>
        </div>
    )
}

export default MenuButton;
