import React, { Suspense, useState, useEffect } from "react";
import * as THREE from 'three';

// r3f
import { Canvas } from "@react-three/fiber";
import { useProgress } from '@react-three/drei';

// components
import Time from "../../components/3DScene/hud/time";
import Location from "../../components/3DScene/hud/location";
import CompassRotation from "../../components/3DScene/hud/compass-rotation";
import CompassHUD from "../../components/3DScene/hud/compass-hud";
import SciFiHUD from "../../components/3DScene/hud/sci-fi-hud";
import TicketsHUD from "../../components/3DScene/hud/tickets-hud";
import Queue from "../../components/3DScene/hud/queue";
import SecretAreaModal from "../../components/3DScene/secret-area-modal";
import BookModal from "../../components/3DScene/book-modal";
import RetroLoadingScreen from "../../components/3DScene/retro-loading-screen";
import ExploreNote from "../../components/3DScene/explore-note";
import Crosshair from '../../components/3DScene/crosshair';
import SceneInstructions from "../../components/3DScene/scene-instructions";
import SceneMenu from "../../components/3DScene/scene-menu";
import ImmersiveModeHandler from "../../components/3DScene/immersive-mode-handler";
import TapeRecorderHandle from "../../components/3DScene/tape-recorder-handle";

// scenes
import RoomHandler from "../../components/3DScene/room-handler";
import SceneLights from "../../components/3DScene//scene-lights";
import FirstPersonCamera from "../../components/3DScene/first-person-camera";
import SceneSetup from "../../components/3DScene/scene-setup";
import NightSky from "../../components/3DScene/night-sky";
import VHSEffectComponent from "../../components/3DScene/vhs-effect";
import InteractiveImageMeshes from "../../components/3DScene/interactive-image-meshes";
import InteractiveBookMeshes from "../../components/3DScene/interactive-book-meshes";
import InteractiveAudioMeshes from "../../components/3DScene/interactive-audio-meshes";
import InteractiveIframeMeshes from "../../components/3DScene/interactive-iframe-meshes";
import IframeModal from "../../components/3DScene/iframe-modal";
import InteractiveCardMeshes from "../../components/3DScene/interactive-card-meshes";
import CardSelectionModal from "../../components/3DScene/card-selection-modal";
import ScenePositionalAudio from "../../components/3DScene/scene-position-audio";
import LightningEffect from "../../components/3DScene/lightning-effect";

// quality settings
import QualitySettings from '../../components/3DScene/quality-settings';
import { useQualitySettings } from "../../context/QualitySettingsContext";
import {useAppContext} from "../../context/app.context";
import {useWebSocketConnection} from "../../graphql/WebSocketConnectionHook";
import {IAPIResponse, IEnqueue, IQueue} from "../../interfaces/data.interfaces";
import {useLogin} from "../../context/login.context";
import {useNavigate} from "react-router-dom";
import {useLazyQuery, useSubscription} from "@apollo/client";
import {CHECK_REQUEST_QUEUE, QUEUE_SUBSCRIPTION} from "../../graphql/queries";

let initialGraphicsQualitySelection = false;

const Room: React.FC = () => {
        const navigator = useNavigate();
    useEffect(() => {
        // setting up session storage keys
        sessionStorage.setItem("isAllMaterialsApplied", JSON.stringify(false));
        sessionStorage.setItem('audioTriggerClicked', JSON.stringify(false));
        sessionStorage.setItem('isSceneMusicMuted', JSON.stringify(true));
        sessionStorage.setItem('anInteractiveModalIsOPened', JSON.stringify(false));
        sessionStorage.setItem('anImageModalIsOPened', JSON.stringify(false));
        sessionStorage.setItem('settingsModalIsOPened', JSON.stringify(false));
    }, [location.search])


    const { progress } = useProgress(); // This is still used for the loading screen

    // for image inspection
    const [open, setOpen] = useState<boolean>(false);
    const [showProximityText, setShowProximityText] = useState<boolean>(false);
    const onClose = () => { setOpen(false); }
    // for book inspection
    const [openBook, setOpenBook] = useState<boolean>(false);
    const [showBookProximityText, setShowBookProximityText] = useState<boolean>(false);
    const onBookInspectionClose = () => { setOpenBook(false); }

    // for audio interaction
    const [showAudioProximityText, setShowAudioProximityText] = useState<boolean>(false);

    // for iframe interaction
    const [openIframe, setOpenIframe] = useState<boolean>(false);
    const [showIframeProximityText, setShowIframeProximityText] = useState<boolean>(false);

    // for card selection interaction
    const [openCardSelection, setOpenCardSelection] = useState<boolean>(false);
    const [showCardProximityText, setShowCardProximityText] = useState<boolean>(false);
    const [selectedCard, setSelectedCard] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showInstructions, setShowInstructions] = useState<boolean>(true);
    const [showSceneMenu, setShowSceneMenu] = useState<boolean>(false);

    const [immersive, setImmersive] = useState<boolean>(false);

    const { settings } = useQualitySettings();

    const handleLoadingComplete = () => {
        setIsLoading(false);
        setShowInstructions(true);
    };

    const handleInstructionsClose = () => {
        setShowInstructions(false);
        if (!initialGraphicsQualitySelection) {
            setShowSettings(true);
        }
    };

    const handleMenuClose = () => {
        setShowSceneMenu(false);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Prevent repeat firing
            if (event.repeat) return;

            if (event.key === 'Tab') {
                event.preventDefault();
                if (showSettings) {
                    sessionStorage.setItem('settingsModalIsOPened', JSON.stringify(false));
                }
                setShowSettings(prev => !prev);
            }
            if (event.key.toLowerCase() === 'i') {
                event.preventDefault();
                setShowInstructions(prev => !prev);
            }
            if (event.key === 'h') {
                event.preventDefault();
                navigator("/menu", {replace: true})
            }
        };

        // Fires when exiting fullscreen or pointer lock
        const handleImmersiveExit = () => {
            const notFullscreen = !document.fullscreenElement;
            const notPointerLock = document.pointerLockElement === null;
            if (notFullscreen && notPointerLock) {
                const isAnImageModalOpened = JSON.parse(sessionStorage.getItem('anImageModalIsOPened') || 'false');
                const isSettingsModalOpened = JSON.parse(sessionStorage.getItem('settingsModalIsOPened') || 'false');

                if (!isAnImageModalOpened && !isSettingsModalOpened) {
                    setShowSceneMenu(prev => !prev);
                }
                // setShowInstructions(prev => !prev);
            }
            if (document.pointerLockElement) {
                setImmersive(true);
            }
            else {
                setImmersive(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('fullscreenchange', handleImmersiveExit);
        document.addEventListener('pointerlockchange', handleImmersiveExit);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('fullscreenchange', handleImmersiveExit);
            document.removeEventListener('pointerlockchange', handleImmersiveExit);
        };
    }, [showInstructions, showSettings]);

    const {appContext} = useAppContext();
    const {connectionStatus, lastError, isCompleted} = useWebSocketConnection();
    const [queueRequest, setQueueRequest] = useState<IEnqueue | null>(null);
    const [wsError, setWsError] = useState<boolean>(false);
    const [wsDisconnected, setWsDisconnected] = useState<boolean>(false);
    const [wasConnected, setWasConnected] = useState<boolean>(false);
    const [wsCompleted, setWsCompleted] = useState<boolean>(false);
    const [qStatus, setQStatus] = useState<IQueue>(null);
    const {user} = useLogin();
    const eventId = localStorage.getItem("eventId");
    const zoneId = localStorage.getItem("zoneId");
    const eventDate = localStorage.getItem("eventDate");
    const navigate = useNavigate();

    const [enqueue, {error: enqueueError, loading: enqueueLoading}] =
        useLazyQuery(CHECK_REQUEST_QUEUE, {fetchPolicy: 'network-only'});

    const {data: queueStatus, loading: queueLoading, error: queueError} = useSubscription(QUEUE_SUBSCRIPTION, {
        variables: {
            request: queueRequest
        },
        skip: !queueRequest || !eventId || !user?.id || !eventDate || !zoneId
    });

    useEffect(() => {
        if (!eventId || !user?.id || !eventId || !eventDate || !zoneId) return;
        enqueue({
            variables: {requestId: user.id, eventId},
            onCompleted: (res) => {
                const response = res?.checkRequestQueue as IAPIResponse;
                const request: IEnqueue = {
                    requestId: user.id,
                    zone: {
                        eventId: eventId,
                        zoneId: response?.data?.queue?.zoneId,
                        eventDate: response?.data?.queue?.eventDate
                    }
                };
                setQueueRequest(request);
            },
            onError: (error) => {
                console.error("Mutation error:", error);
            },
        });
    }, [enqueue, eventId, user?.id]);


    useEffect(() => {
        switch (connectionStatus) {
            case 'connecting':
                console.log('Connecting to WebSocket...');
                setWsError(false);
                setWsDisconnected(false);
                setWsCompleted(false);
                break;
            case 'connected':
                console.log('WebSocket connected successfully!');
                setWsError(false);
                setWsDisconnected(false);
                setWsCompleted(false);
                setWasConnected(true);
                break;
            case 'disconnected':
                console.log('WebSocket disconnected - handle reconnection logic');
                if (wasConnected && isCompleted) {
                    setWsDisconnected(true);
                }
                break;
            case 'completed':
                console.log('WebSocket subscription completed successfully');
                setWsError(false);
                setWsDisconnected(false);
                setWsCompleted(true);
                break;
            case 'error':
                console.error('WebSocket error:', lastError);
                setWsError(true);
                break;
        }
    }, [connectionStatus, lastError, wasConnected, isCompleted]);

    useEffect(() => {
        const qs = queueStatus?.queueUpdate?.queueStatus as IQueue
        setQStatus(qs);
        if (qs?.currentIndex <= 100) {
            appContext.showErrorDialog("Alert", "You will redirect to purchase route")
            setTimeout(() => {
                const path = `eventDate=${eventDate}&eventId=${eventId}&zoneId=${zoneId}`
                navigate(`/purchase?${path}`);
                appContext.setOpenDialog(false);
            }, 5000);

        }

    }, [queueStatus])

    useEffect(() => {
        if (!eventId || !user?.id) return;
        enqueue({
            variables: {requestId: user.id, eventId},
            onCompleted: (res) => {
                const response = res?.checkRequestQueue as IAPIResponse;
                const request: IEnqueue = {
                    requestId: user.id,
                    zone: {
                        eventId: eventId,
                        zoneId: response?.data?.queue?.zoneId,
                        eventDate: response?.data?.queue?.eventDate
                    }
                };
                setQueueRequest(request);
            },
            onError: (error) => {
                console.error("Mutation error:", error);
            },
        });
    }, [enqueue, eventId, user?.id]);

    const batchSize = (currentIndex: number): number => {
        if (currentIndex >= 500) {
            return currentIndex - 100;
        }
        return currentIndex;
    }

    return (
        <div style={{ width: "100%", height: "100vh", position: 'relative' }}>
            {isLoading ? (
                <RetroLoadingScreen
                    progress={progress}
                    onLoadingComplete={handleLoadingComplete} />
            ) : (
                <>
                    <SceneInstructions
                        visible={showInstructions}
                        onClose={handleInstructionsClose}
                    />

                    {!false && (
                        showSettings && (
                            <QualitySettings onClose={() => {
                                setShowSettings(false)
                                initialGraphicsQualitySelection = true;
                            }} />
                        )
                    )}

                    <SceneMenu
                        visible={showSceneMenu}
                        onClose={handleMenuClose}
                    />
                </>
            )}

            <>
                {!immersive && (
                    <ImmersiveModeHandler />
                )}

                {/* HUD */}
                    <>
                        <TicketsHUD />
                        <CompassHUD />
                        <Time/>
                        <Queue index={qStatus?.currentIndex}/>
                        <Location />
                        <SciFiHUD />
                        <Crosshair />
                    </>

                {/* Proximity Text */}
                {showProximityText && (
                    <ExploreNote type="image" />
                )}

                {/* Proximity Text */}
                {showBookProximityText && (
                    <ExploreNote type="book" />
                )}

                {/* Audio Proximity Text */}
                {showAudioProximityText && (
                    <ExploreNote type="audio" />
                )}

                {/* Iframe Proximity Text */}
                {showIframeProximityText && (
                    <ExploreNote type="iframe" />
                )}

                {/* Card Selection Proximity Text */}
                {showCardProximityText && (
                    <ExploreNote type="card" />
                )}

                {/* threejs canvas */}
                <Canvas
                    camera={{ position: [0, 1.8, 0], fov: 75, near: 0.1, far: settings.drawDistance }}
                    gl={{ antialias: settings.antialiasing }}
                    shadows={{ enabled: true, type: THREE.PCFSoftShadowMap }}
                >
                    {/* background music */}
                    <ScenePositionalAudio />

                    <SceneSetup />

                    <NightSky />

                    <SceneLights />

                    <Suspense fallback={null}><RoomHandler /></Suspense>

                    <FirstPersonCamera />

                    <CompassRotation />

                    <VHSEffectComponent />

                    <LightningEffect />

                    {/* <OrbitControls /> */}

                    {/* <Stats /> */}

                    <InteractiveImageMeshes setOpen={setOpen} setShowProximityText={setShowProximityText} />
                    <InteractiveBookMeshes setOpenBook={setOpenBook} setShowBookProximityText={setShowBookProximityText} />
                    <InteractiveAudioMeshes setShowAudioProximityText={setShowAudioProximityText} />
                    <InteractiveIframeMeshes setOpenIframe={setOpenIframe} setShowIframeProximityText={setShowIframeProximityText} />
                    <InteractiveCardMeshes setOpenCardSelection={setOpenCardSelection} setShowCardProximityText={setShowCardProximityText} />
                </Canvas>

                {/* special handler for the tape-recorder */}
                <TapeRecorderHandle />

                <CardSelectionModal
                    open={openCardSelection}
                    onClose={() => setOpenCardSelection(false)}
                    selectedCard={selectedCard}
                    onCardSelect={setSelectedCard}
                />

                <SecretAreaModal
                    open={open}
                    onClose={onClose}
                    assetName={JSON.parse(sessionStorage.getItem('modalMessage') as string)}
                    assetFileName={JSON.parse(sessionStorage.getItem('modalFileName') as string)}
                />

                <BookModal
                    openBook={openBook}
                    onBookInspectionClose={onBookInspectionClose}
                    bookName={JSON.parse(sessionStorage.getItem('bookName') as string)}
                    assetFileName={JSON.parse(sessionStorage.getItem('assetFileName') as string)}
                    isbnNumber={JSON.parse(sessionStorage.getItem('isbnNumber') as string)}
                    overview={JSON.parse(sessionStorage.getItem('overview') as string)}
                    author={JSON.parse(sessionStorage.getItem('author') as string)} />

                <IframeModal
                    openIframe={openIframe}
                    onClose={() => setOpenIframe(false)}
                />
            </>
        </div>
    );
};

export default Room;
