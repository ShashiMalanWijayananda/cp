import React from 'react';
import './GlobalFooter.css';
import Marquee from "react-fast-marquee";

interface GlobalFooterProps {
    text?: string;
}

const GlobalFooter: React.FC<GlobalFooterProps> = ({
                                                       text
                                                   }) => {
    return (
        <div className="
      bg-brand-gray
      h-[30px]
      lg:h-[50px]
      w-[100vw]
      fixed
      z-1
      bottom-0
      flex
       text-[20px]
      lg:text-[30px]
      text-brand-forest
      items-center
      justify-center
    ">
            <Marquee className="h-full flex items-center">
        <span className="flex items-center h-full">
          {text}
        </span>
            </Marquee>
        </div>
    );
};

export default GlobalFooter;
