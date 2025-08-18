export interface InteractiveImageMeshesProps {
    setOpen: (isOpen: boolean) => void
    setShowProximityText: (isTextShown: boolean) => void
}

export interface InteractiveMeshProps {
    position: [number, number, number];
    scale: [number, number, number];
    rotation: [number, number, number];
    setOpen: (isOpen: boolean) => void;
    assetName: string;
    assetFileName: string
    onNearby?: (isNear: boolean) => void;
}

export interface InteractiveBookMeshesProps {
    setOpenBook: (isOpen: boolean) => void
    setShowBookProximityText: (isTextShown: boolean) => void
}

export interface InteractiveBookMeshProps {
    position: [number, number, number];
    scale: [number, number, number];
    rotation: [number, number, number];
    setOpenBook: (isOpen: boolean) => void;
    bookName: string;
    assetFileName: string,
    isbnNumber: string,
    overview: string,
    author: string,
    onNearby?: (isNear: boolean) => void;
}

export interface SecretAreaModalProps {
    open: boolean;
    onClose: () => void;
    assetName: string,
    assetFileName: string
}

export interface BookModalProps {
    openBook: boolean;
    onBookInspectionClose: () => void;
    bookName: string;
    assetFileName: string,
    isbnNumber: string,
    overview: string,
    author: string,
}

export interface HUDPanelDetailProps {
    title: string;
    data: any;
}

export interface ExploreNoteProps {
    type: "image" | "book" | "audio" | "iframe" | "card"
}

export interface InteractiveAudioMeshesProps {
    setShowAudioProximityText: (isTextShown: boolean) => void
}

export interface InteractiveAudioMeshProps {
    position: [number, number, number];
    scale: [number, number, number];
    rotation: [number, number, number];
    audioName: string;
    audioFileName: string;
    onNearby?: (isNear: boolean) => void;
}

export interface InteractiveIframeMeshesProps {
    setShowIframeProximityText: (isTextShown: boolean) => void;
    setOpenIframe: (isOpen: boolean) => void;
}

export interface InteractiveIframeMeshProps {
    position: [number, number, number];
    scale: [number, number, number];
    rotation: [number, number, number];
    iframeTitle: string;
    iframeUrl: string;
    setOpenIframe: (isOpen: boolean) => void;
    onNearby?: (isNear: boolean) => void;
    helperText?: string
}

export interface IframeModalProps {
    openIframe: boolean;
    onClose: () => void;
}

export interface CardSelectionModalProps {
    open: boolean;
    onClose: () => void;
    selectedCard?: number | null;
    onCardSelect?: (cardIndex: number) => void;
}

export interface InteractiveCardMeshesProps {
    setOpenCardSelection: (isOpen: boolean) => void;
    setShowCardProximityText: (isTextShown: boolean) => void;
}

export interface InteractiveCardMeshProps {
    position: [number, number, number];
    scale: [number, number, number];
    rotation: [number, number, number];
    setOpenCardSelection: (isOpen: boolean) => void;
    onNearby?: (isNear: boolean) => void;
}

export interface InstructionsModalProps {
    onClose: () => void;
    visible: boolean;
}

export interface TypewriterContentProps {
    content: string,
    contentSize: string,
    visibilityDelay: number
}