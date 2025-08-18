import React, {FC, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {IAPIResponse, ITicket} from "../../interfaces/data.interfaces";
import axiosClient from "../../axios/axiosClient";
import {saveAs} from "file-saver";
import Alert from "../../components/retro/Alert/Alert";
import TicketCard from "../../components/TicketCard/TicketCard";
import Logo from "../../components/Logo/Logo";


interface AlertProps {
    type?: 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
}

const PublicTicketView: FC = () => {
    const [searchParams] = useSearchParams();
    const [alert, setAlert] = useState<AlertProps>({isVisible: false, message: "", type: "info"});
    const [downloading, setDownloading] = useState<boolean>(false);
    const viewId = searchParams.get('id');
    const id = viewId?.startsWith('view-')
        ? viewId.substring(5)
        : viewId;

    const [ticket, setTicket] = useState<ITicket | null>(null);

    useEffect(() => {
        setAlert({type: "info", message: "Loading ticket", isVisible: true});
        if (id) {
            axiosClient.get(`/download/view-ticket/${id}`).then((res) => {
                setAlert({type: "info", message: "Loading ticket", isVisible: false})
                const response = res?.data as IAPIResponse;
                if (response?.code === "CODE-204") {
                    setTicket(response?.data);
                } else {
                    setAlert({type: "info", message: "Operation failed", isVisible: true})
                }
            })
        }

    }, [id]);


    const handleDownload = async (ticket: ITicket) => {
        setDownloading(true);
        setAlert(prev => ({...prev, isVisible: true, message: "Downloading...", type: "info"}));
        try {
            const response = await axiosClient.get(`/download/ticket/${ticket?.id}`, {
                responseType: 'arraybuffer'
            });
            setDownloading(false);
            const blob = new Blob([response.data], {type: 'application/pdf'});
            saveAs(blob, `Yogeshwari.pdf`);
            setAlert(prev => ({...prev, isVisible: false}));
        } catch (error) {
            setAlert(prev => ({...prev, isVisible: true, type: "error", message: `Error downloading... `}));
            console.error('Error downloading PDF:', error);

        }
    };

    const handlingCloseAlert = () => {
        setAlert(prev => ({...prev, isVisible: false}));
    }

    return (
        <React.Fragment>
            <div className="authorize-ticket-view-o-header">
                <Logo variant="small" />
                <div className="authorize-ticket-view-header">Download Ticket</div>
                {/*<Alert message={alert.message} type={alert.type} visible={alert.isVisible} autoCloseDelay={3000}*/}
                {/*       onClose={handlingCloseAlert}/>*/}
                {/*<Alert message={"Loading ticket"} type={"info"} visible={loading} autoCloseDelay={3000}*/}
                {/*       onClose={handlingCloseAlert}/>*/}
                {/*<Alert message={"Ticket loading error"} type={"error"} visible={error === null ? true : false}*/}
                {/*       autoCloseDelay={3000}*/}
                {/*       onClose={handlingCloseAlert}/>*/}
                <div className="authorize-ticket-view-title">
                    {/*Tickets Are Locked. Assign Tickets To Unlock*/}
                </div>

                <div className="ticket-layout-view">
                    {ticket == null && <div className="not-available">Ticket not available</div>}
                    {/*<div className="ticket-view desktop-view">*/}

                    {/*    <TicketCard ticket={ticket}*/}
                    {/*                onDownload={handleDownload}/>*/}
                    {/*</div>*/}

                    {/*{tickets?.length > 0 && <div className="ticket-view mobile-view">*/}
                    {/*    <div className="mobile-ticket-counter">*/}
                    {/*        Ticket {currentTicketIndex + 1} of {tickets.length}*/}
                    {/*    </div>*/}

                    <div className="mobile-ticket-navigation">
                        {/*<button*/}
                        {/*    className="nav-button prev-button"*/}
                        {/*    onClick={prevTicket}*/}
                        {/*    disabled={tickets.length <= 1}*/}
                        {/*>*/}
                        {/*    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">*/}
                        {/*        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2"*/}
                        {/*              strokeLinecap="round" strokeLinejoin="round"/>*/}
                        {/*    </svg>*/}
                        {/*    <span className="nav-text">Back</span>*/}
                        {/*</button>*/}

                        <div className="mobile-ticket-container">

                            {/*<TicketCard ticket={tickets?.[currentTicketIndex]} onClick={handleAssignTicket}*/}
                            {/*            onDownload={handleDownload}/>*/}
                            {ticket && <TicketCard ticket={ticket} details={false} onDownload={handleDownload}/>}
                        </div>

                        {/*<button*/}
                        {/*    className="nav-button next-button"*/}
                        {/*    onClick={nextTicket}*/}
                        {/*    disabled={tickets.length <= 1}*/}
                        {/*>*/}
                        {/*    <span className="nav-text">Next</span>*/}
                        {/*    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">*/}
                        {/*        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"*/}
                        {/*              strokeLinecap="round" strokeLinejoin="round"/>*/}
                        {/*    </svg>*/}
                        {/*</button>*/}
                    </div>

                    {/*<div className="ticket-indicators">*/}
                    {/*    {tickets.map((_, index) => (*/}
                    {/*        <button*/}
                    {/*            key={index}*/}
                    {/*            className={`indicator ${index === currentTicketIndex ? 'active' : ''}`}*/}
                    {/*            onClick={() => setCurrentTicketIndex(index)}*/}
                    {/*        />*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                    {/*</div>}*/}
                </div>
            </div>
        </React.Fragment>)
}
export default PublicTicketView;
