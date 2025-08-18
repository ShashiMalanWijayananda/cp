import React, { useEffect, useState } from "react";

// MUI
import { Typography } from "@mui/material";

// props
interface PointerCoordsProps {
    bottomMargin?: string
} 

const PointerCoords: React.FC<PointerCoordsProps> = ({ bottomMargin }) => {
    const [xCords, setXCords] = useState<number>(1263);
    const [yCords, setYCords] = useState<number>(1390);

    useEffect(() => {
        window.addEventListener('mousemove', (e: any) => {
            setXCords(e.clientX);
            setYCords(e.clientY);
        });
    }, [location]);


    return (
        <>
            <Typography sx={{
                position: 'fixed',
                left: '1.55%',
                bottom: bottomMargin ? bottomMargin : '1.5%',
                color: '#00ff9b',
                fontSize: 15,
                fontFamily: 'Source Code Pro',
                textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                textTransform: 'uppercase'
            }}>{xCords}</Typography>

            <Typography sx={{
                position: 'fixed',
                right: '1.55%',
                bottom: bottomMargin ? bottomMargin : '1.5%',
                color: '#00ff9b',
                fontSize: 15,
                fontFamily: 'Source Code Pro',
                textShadow: '0 0 4px #00ff9b, 0 0 8px #00ff9b',
                textTransform: 'uppercase'
            }}>{yCords}</Typography>
        </>
    )
}

export default PointerCoords