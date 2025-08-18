import React, {createContext, useContext, useState} from "react";

interface DialogConfig {
    title?: string;
    content?: React.ReactNode;
}

type DialogContextType = {
    dialogContext: {
        title?: string;
        content?: React.ReactNode;
    };
    setDialogContext: (props: DialogConfig | null) => void;
    isOpen: boolean;
    openDialog: (config: DialogConfig) => void;
    closeDialog: () => void;
};

type DialogContextProviderProps = {
    children: React.ReactNode;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const DialogContextProvider = ({children}: DialogContextProviderProps) => {
    const [dialogContext, setDialogContextState] = useState<DialogConfig>({
        title: undefined,
        content: undefined
    });
    const [isOpen, setIsOpen] = useState(false);

    const setDialogContext = (config: DialogConfig | null) => {
        if (config === null) {
            setDialogContextState({
                title: undefined,
                content: undefined
            });
            setIsOpen(false);
        } else {
            setDialogContextState(config);
        }
    };

    // Open dialog with config
    const openDialog = (config: DialogConfig) => {
        setDialogContextState(config);
        setIsOpen(true);
    };

    // Close dialog
    const closeDialog = () => {
        setIsOpen(false);
        setDialogContextState({
            title: undefined,
            content: undefined
        });
    };

    const contextValue: DialogContextType = {
        dialogContext,
        setDialogContext,
        isOpen,
        openDialog,
        closeDialog
    };

    return (
        <DialogContext.Provider value={contextValue}>
            {children}
        </DialogContext.Provider>
    );
};

const useDialogContext = () => {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error(
            "useDialogContext must be used within a DialogContextProvider"
        );
    }
    return context;
};

export {DialogContextProvider, useDialogContext};
export type {DialogConfig, DialogContextType};
