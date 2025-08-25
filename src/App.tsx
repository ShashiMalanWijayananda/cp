import React, {FC} from 'react'
import client from "./graphql/apploClient";
import {ApolloProvider} from "@apollo/client";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {LoginContextProvider} from "./context/login.context";
import AuthenticatedRoutes from "./components/Routes/AuthenticatedRoutes";
import Splash from "./Pages/Splash/Splash";
import {AppContextProvider, useAppContext} from "./context/app.context";
import Registration from "./new-pages/registration/Registration";
import MissionSelection from "./new-pages/mission/Mission-Selection";
import ZoneView from "./new-pages/zone/ZoneView";
import QueueView from "./new-pages/queue-view/QueueView";
import PurchaseTickets from "./new-pages/purchase/PurchaseTickets";
import {DialogContextProvider} from "./context/dialog.context";
import LoginComponent from "./new-pages/login/LoginComponent";
import AuthorizeTickets from "./new-pages/authorize-ticket/AuthorizeTickets";
import Profile from "./new-pages/profile/Profile";
import {QualitySettingsProvider} from "./context/QualitySettingsContext";
import SystemMenu from "./new-pages/mobile-menu/SystemMenu";
import {SiteContextProvider, useSite} from "./context/site.context";
import LockScreen from "./new-pages/lock-screen/LockScreen";
import "./App.css"
import Terms from "./new-pages/terms/Terms";
import About from "./new-pages/about/About";
import PublicTicketView from "./new-pages/public-ticket-view/PublicTicketView";
import Room from "./Pages/Room/Room";
import Contact from "./new-pages/contact/Contact";
import {QueueProvider} from "./graphql/graphql-subscrption";
import ChatBox from "./new-pages/chat-box/ChatBox";
import ChatView from "./new-pages/chat-box/ChatView";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop"; // Import the new component

const AppRoutes: FC = () => {
    const {isEnable, isLoading, error, refreshSiteStatus, milliseconds} = useSite();
    const {appContext} = useAppContext();
    
    if (isLoading) {
        return (
            <div className="app-main-loading">
                <div>Checking site status...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="app-main-loading">
                <h1>Service Unavailable</h1>
                <p>{error}</p>
                <button onClick={refreshSiteStatus}>
                    Try Again
                </button>
            </div>
        );
    }

    if (isEnable) {
        return (
           <LockScreen milliseconds={milliseconds}/>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginComponent/>} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/view-ticket" element={<PublicTicketView />} />
            <Route element={<AuthenticatedRoutes />}>
                <Route element={<AppLayout />}>
                    <Route path="/mission" element={<MissionSelection />} />
                    <Route path="/menu" element={<SystemMenu/>}/>
                    <Route path="/my-profile" element={<Profile/>}/>
                    <Route path="/landing-page" element={<Room/>}/>
                    <Route path="/zones" element={<ZoneView/>}/>
                    <Route path="/purchase" element={<PurchaseTickets/>}/>
                    <Route path="/queue" element={<QueueView/>}/>
                    <Route path="/my-tickets" element={<AuthorizeTickets/>}/>
                    <Route path="/terms" element={<Terms/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/chat" element={<ChatView/>}/>
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="/splash" replace/>}/>
            <Route path="" element={<Navigate to="/splash" replace/>}/>
        </Routes>
    );
};

export const App: FC = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    return (
        <React.Fragment>
            <SiteContextProvider>
                <ApolloProvider client={client}>
                    <GoogleOAuthProvider clientId={clientId}>
                        <Router>
                            {/* Add ScrollToTop component here - it will run on every route change */}
                            <ScrollToTop />
                            <AppContextProvider>
                                <QueueProvider>
                                    <LoginContextProvider>
                                        <QualitySettingsProvider>
                                            <DialogContextProvider>
                                                <AppRoutes/>
                                            </DialogContextProvider>
                                        </QualitySettingsProvider>
                                    </LoginContextProvider>
                                </QueueProvider>
                            </AppContextProvider>
                        </Router>
                    </GoogleOAuthProvider>
                </ApolloProvider>
            </SiteContextProvider>
        </React.Fragment>
    );
};

export default App;