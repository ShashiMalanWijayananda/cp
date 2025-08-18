import React, {createContext, useContext, useState, ReactNode} from "react";


interface DialogState {
    title: string;
    message: string;
    content?: ReactNode;
    isOpenDialog: boolean;
    onRefetch?:(() => void) | undefined;
    onConfirm?: (() => void) | undefined;
    onCancel?: (() => void) | undefined;
    onOk?: (() => void) | undefined;
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    showCancel: boolean;
    showCustomActions: boolean;
}


export interface DialogConfig {
    title?: string;
    message?: string;
    content?: ReactNode;
    onConfirm?: (() => void) | undefined;
    onCancel?: (() => void) | undefined;
    onOk?: (() => void) | undefined;
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    showCancel?: boolean;
    showCustomActions?: boolean;
}


interface AppContextState {
    title: string;
    message: string;
    content?: ReactNode;
    isOpenDialog: boolean;
    onConfirm?: (() => void) | undefined;
    onCancel?: (() => void) | undefined;
    onOk?: (() => void) | undefined;
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    showCancel: boolean;
    showCustomActions: boolean;
    setOpenDialog: (isOpen: boolean) => void;
    showDialog: (config: DialogConfig) => void;
    showConfirmDialog: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
    showErrorDialog: (title: string, message: string) => void;
    showSuccessDialog: (title: string, message: string) => void;
    showContentDialog: (title: string, content: ReactNode, onOk?: () => void) => void;
    showCustomActionsDialog: (
        title: string,
        content: ReactNode,
        primaryAction: { label: string; onClick: () => void },
        secondaryAction: { label: string; onClick: () => void }
    ) => void;
}

interface AppContextType {
    appContext: AppContextState;
    setAppContext: (props: Partial<DialogState>) => void;
}

interface AppContextProviderProps {
    children: React.ReactNode;
}

// Create the context with undefined initial value
const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider: React.FC<AppContextProviderProps> = ({children}) => {
    // Initialize state with proper typing
    const [appContextState, setAppContextState] = useState<DialogState>({
        title: "",
        message: "",
        content: undefined,
        isOpenDialog: false,
        onConfirm: undefined,
        onCancel: undefined,
        onOk: undefined,
        primaryAction: undefined,
        secondaryAction: undefined,
        showCancel: false,
        showCustomActions: false,
    });

    const setOpenDialog = (isOpen: boolean) => {
        setAppContextState((prev) => ({
            ...prev,
            isOpenDialog: isOpen,
        }));
    };

    const showDialog = ({
                            title,
                            message,
                            content,
                            onConfirm,
                            onCancel,
                            onOk,
                            primaryAction,
                            secondaryAction,
                            showCancel = false,
                            showCustomActions = false,
                        }: DialogConfig) => {
        setAppContextState({
            title,
            message,
            content,
            onConfirm,
            onOk,
            onCancel,
            primaryAction,
            secondaryAction,
            showCancel,
            showCustomActions,
            isOpenDialog: true,
        });
    };

    const showConfirmDialog = (
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel?: () => void
    ) => {
        showDialog({
            title,
            message,
            onConfirm,
            onCancel,
            showCancel: true,
        });
    };


    const showErrorDialog = (title: string, message: string) => {
        showDialog({
            title: title,
            message,
            showCancel: false,
        });
    };


    const showSuccessDialog = (title: string, message: string) => {
        showDialog({
            title: title,
            message,
            showCancel: false,
        });
    };

    const showContentDialog = (title: string, content: ReactNode, onOk?: () => void) => {
        showDialog({
            title,
            message: "",
            content,
            onOk,
            showCancel: false,
            showCustomActions: false,
        });
    };

    const showCustomActionsDialog = (
        title: string,
        content: ReactNode,
        primaryAction: { label: string; onClick: () => void },
        secondaryAction: { label: string; onClick: () => void }
    ) => {
        showDialog({
            title,
            message: "", // Empty message since we're using content
            content,
            primaryAction,
            secondaryAction,
            showCancel: false,
            showCustomActions: true,
        });
    };


    const appContext: AppContextState = {
        ...appContextState,
        setOpenDialog,
        showDialog,
        showConfirmDialog,
        showErrorDialog,
        showSuccessDialog,
        showContentDialog,
        showCustomActionsDialog,
    };


    const setAppContext = (props: Partial<DialogState>) => {
        setAppContextState((prev) => ({
            ...prev,
            ...props,
        }));
    };

    return (
        <AppContext.Provider value={{appContext, setAppContext}}>
            {children}
        </AppContext.Provider>
    );
};


const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};

export {AppContextProvider, useAppContext};
