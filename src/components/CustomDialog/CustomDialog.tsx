import React, {FC, useEffect, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {useAppContext} from "../../context/app.context";
import "./CustomDialog.css";
import "../../App.css"

interface CustomDialogProps {
    customContent?: React.ReactNode;
    customFooter?: React.ReactNode;
    customHeader?: React.ReactNode;
    className?: string;
    width?: string;
}

const CustomDialog: FC<CustomDialogProps> = ({
                                                 customContent,
                                                 customFooter,
                                                 customHeader,
                                                 className = "",
                                                 width = "500px"
                                             }) => {
    const { appContext, setAppContext } = useAppContext();
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

    const {
        title,
        message,
        content,
        isOpenDialog,
        onConfirm,
        onCancel,
        onOk,
        primaryAction,
        secondaryAction,
        showCancel,
        showCustomActions
    } = appContext;

    useEffect(() => {
        const checkDevice = () => {
            const isMobile = window.innerWidth <= 768;
            setIsMobileOrTablet(isMobile);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    useEffect(() => {
        let audio: HTMLAudioElement | null = null;

        if (isOpenDialog) {
            try {
                audio = new Audio("/sounds/retro-blip.mp3");
                audio.play().catch(() => {
                });
            } catch (error) {
            }
        }

        return () => {
            if (audio) {
                audio.pause();
                audio = null;
            }
        };
    }, [isOpenDialog]);

    const handleHide = () => {
        setAppContext({ isOpenDialog: false });
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        handleHide();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        handleHide();
    };

    const handleOk = () => {
        if (onOk) {
            onOk();
        }
        handleHide();
    };

    const handlePrimaryAction = () => {
        if (primaryAction?.onClick) {
            primaryAction.onClick();
        }
    };

    const handleSecondaryAction = () => {
        if (secondaryAction?.onClick) {
            secondaryAction.onClick();
        }
    };

    const customActionsFooter = (
        <div className="retro-dialog-footer">
            {secondaryAction && (
                <Button
                    label={secondaryAction.label}
                    icon="pi pi-times"
                    className="retro-dialog-button retro-dialog-button-secondary custom-button"
                    onClick={handleSecondaryAction}
                />
            )}

            {primaryAction && (
                <Button
                    label={primaryAction.label}
                    icon="pi pi-check"
                    className="retro-dialog-button retro-dialog-button-primary custom-button"
                    onClick={handlePrimaryAction}
                />
            )}
        </div>
    );

    const standardFooter = (
        <div className="retro-dialog-footer">
            {onConfirm && (
                <Button
                    label="Confirm"
                    icon="pi pi-check"
                    className="retro-dialog-button retro-dialog-button-primary custom-button"
                    onClick={handleConfirm}
                />
            )}

            {onOk && !onConfirm && (
                <Button
                    label="OK"
                    icon="pi pi-check"
                    className="retro-dialog-button retro-dialog-button-primary custom-button"
                    onClick={handleOk}
                />
            )}

            {!onConfirm && !onOk && !showCustomActions && (
                <Button
                    label="OK"
                    icon="pi pi-check"
                    className="retro-dialog-button retro-dialog-button-primary custom-button"
                    onClick={handleHide}
                />
            )}

            {showCancel && (
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    className="retro-dialog-button retro-dialog-button-secondary custom-button"
                    onClick={handleCancel}
                />
            )}
        </div>
    );

    const defaultFooter = showCustomActions ? customActionsFooter : standardFooter;

    const defaultHeader = (
        <div className="retro-dialog-header">
            <span className="retro-dialog-header-text">{title || "Message"}</span>
        </div>
    );

    const defaultContent = (
        <div className="retro-dialog-content">
            <div className="retro-terminal">
                {content ? (
                    content
                ) : (
                    <p className="retro-text-light">{message || "No message provided."}</p>
                )}
            </div>
        </div>
    );

    return (
        <Dialog
            visible={isOpenDialog}
            onHide={handleHide}
            header={customHeader || defaultHeader}
            footer={customFooter || defaultFooter}
            className={`retro-dialog ${isMobileOrTablet ? 'mobile-fullscreen' : ''} ${className}`}
            modal
            resizable={false}
            draggable={false}
            closeOnEscape
            dismissableMask
            position="center"
            blockScroll={isMobileOrTablet}
        >
          <div style={{padding: 25}}>  {customContent || defaultContent}</div>
        </Dialog>
    );
};

export default CustomDialog;
