import {FC} from "react";

export interface ButtonProps {
    onClick?: () => void;
    icon?: string;
    label?: string;
    highlight?: boolean;
}

const MenuLargeButton: FC<ButtonProps> = ({onClick, icon, label, highlight}) => {
    return(
        <div onClick={onClick}
             className={`${highlight ? 'bg-green-400 text-green-900' : 'bg-transparent text-white'} border-2 border-green-400  cursor-pointer p-4 flex flex-row items-center justify-center text-center h-[4rem] lg:h-[5rem] gap-4`}>
            <div className="w-6 h-6 min-[375px]:w-8 min-[375px]:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-10 mb-1 sm:mb-2 flex items-center justify-center">
                <img
                    className={`w-full h-full object-contain filter ${highlight ? 'brightness-0' : 'brightness-0 invert'}`}
                    src={icon}
                    alt={label || "icon"}
                />
            </div>
            <span className="text-[10px] min-[375px]:text-lg md:text-xl lg:text-2xl font-medium font-jersey25">{label}</span>
        </div>
    )
}

export default MenuLargeButton;
