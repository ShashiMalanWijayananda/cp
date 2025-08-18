import React, { useEffect, useRef } from "react";

// MUI
import { Box } from "@mui/material";

const PointerCrossLines: React.FC = () => {
    const verticalLineRef = useRef<HTMLDivElement>(null);
    const horizontalLineRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let rafId: number;
        
        const handleMouseMove = (e: MouseEvent) => {
            rafId = requestAnimationFrame(() => {
                if (verticalLineRef.current) {
                    verticalLineRef.current.style.transform = `translate3d(${e.clientX}px, 0, 0)`;
                }
                if (horizontalLineRef.current) {
                    horizontalLineRef.current.style.transform = `translate3d(0, ${e.clientY}px, 0)`;
                }
                if (dotRef.current) {
                    dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);


    return (
        <>
            <Box
                ref={verticalLineRef}
                component="div"
                sx={{
                    position: 'fixed',
                    top: 0,
                    width: '1px',
                    left: 0,
                    backgroundColor: 'rgba(0, 255, 155, .25)',
                    height: '100vh',
                    pointerEvents: 'none',
                    transform: 'translate3d(0, 0, 0)',
                    willChange: 'transform',
                    zIndex: 1000,
                    transformOrigin: 'center',
                    backfaceVisibility: 'hidden',
                }}
            />

            <Box
                ref={horizontalLineRef}
                component="div"
                sx={{
                    position: 'fixed',
                    top: 0,
                    width: '100vw',
                    left: 0,
                    backgroundColor: 'rgba(0, 255, 155, .25)',
                    height: '1px',
                    pointerEvents: 'none',
                    transform: 'translate3d(0, 0, 0)',
                    willChange: 'transform',
                    zIndex: 1000,
                    transformOrigin: 'center',
                    backfaceVisibility: 'hidden',
                }}
            />

            <Box
                ref={dotRef}
                component="div"
                sx={{
                    position: 'fixed',
                    width: '6.25px',
                    height: '6.25px',
                    backgroundColor: 'rgba(0, 255, 155, .85)',
                    boxShadow: '0 0 30px 5px rgba(0, 255, 155, 1)',
                    borderRadius: '50%',
                    left: '-2px',
                    top: '-2px',
                    transform: 'translate3d(0, 0, 0)',
                    pointerEvents: 'none',
                    opacity: 1,
                    willChange: 'transform',
                    zIndex: 1000,
                    transformOrigin: 'center',
                    backfaceVisibility: 'hidden',
                }}
            />
        </>
    )
}

export default PointerCrossLines