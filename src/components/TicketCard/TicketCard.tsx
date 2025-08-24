import "./TicketCard.css"
import React, {FC} from "react";
import {ITicket} from "../../interfaces/data.interfaces";

interface TicketProps {
    ticket?: ITicket,
    onClick?: (ticket: ITicket) => void;
    onDownload?: (ticket: ITicket) => void;
    locked?: boolean;
    details?: boolean;
    download?: boolean;
}


const TicketCard: FC<TicketProps> = ({ticket, onClick, onDownload, locked = true, details = true, download = true}) => {
    return (<React.Fragment>
        <div className="ticket-card">
            <div className={`ticket-card-view ${ticket?.share ? "" : locked && "locked"} ${ticket?.zoneId}`}
                 onClick={() => !ticket?.share && onClick(ticket)}>
                <div className="ticket-layout">
                    <div className="ticket-card-logo">
                        <img className="card-logo" src={"images/logo_new.svg"}/>
                    </div>
                    {/*<span className="header">{ticket?.event?.eventName?.toUpperCase()}</span>*/}
                    <span className="header">ZONE {ticket?.zoneId?.toUpperCase()?.split("ZONE") ?? ""}</span>
                    <div className={"qr-info"}>
                        <img src="images/icon/qr_code.png" width="150px" height="150px"/>
                        <span className="ticket-id">#{ticket?.sequenceId}</span>
                        <span className="font-vt323" style={{color: ticket?.zoneId === "zoneA" ? "#C49799" : "#8666D5"}}>Access Code</span>
                    </div>
                    <div className={"ticket-venue-info"}>
                        <div className="box-row">
                            <span className="box"
                                  style={{
                                      background: ticket?.zoneId === "zoneA" ? "#C49799" : "#8666D5",
                                      color: "#ffffff"
                                  }}><span>Date:</span><span
                                className="font-vt323">{ticket?.event?.eventDate ?? ""}</span></span>
                            <span className="box"
                                  style={{
                                      background: ticket?.zoneId === "zoneA" ? "#C49799" : "#8666D5",
                                      color: "#ffffff"
                                  }}><span>Time:</span><span
                                className="font-vt323">{ticket?.event?.eventTime ?? ""}</span></span>
                        </div>
                        <div className="box-row">
                            <span
                                className="box" style={{
                                border: ticket?.zoneId === "zoneA" ? "#C49799 2px solid" : "#8666D5 2px solid",
                                color: "#ffffff",
                                fontSize:".9rem"
                            }}><span>Venue:</span><span
                                className="font-vt323"
                                style={{fontSize: "0.8rem"}}>{ticket?.event?.eventLocationLong ?? ""}</span></span>
                        </div>
                        <div className="box-row">
                            <span className="box"><span
                                className="text-center" style={{color: "#ffffff", fontFamily: "VT323"}}>THE MISSION IS LIVE<br/>
WELCOME TO YOGESHWARI</span></span>
                        </div>
                        <div className="box-row"
                             style={{background: ticket?.zoneId === "zoneA" ? "#C49799" : "#8666D5", color: "#ffffff"}}>
                            <span className="box" style={{paddingBottom: "10px", fontSize: "2rem"}}><span
                                className="font-vt323 text-center">{ticket?.price} (LKR)</span></span>
                        </div>
                    </div>
                </div>

            </div>
            <div className={"assigner-box"}>
                {!!(ticket?.share) && <>
                    <div className="assigner" onClick={() => onDownload(ticket)}>
                        {download && <span className="download">Download</span>}
                        {details && <><p>Assignee : {ticket?.assigner?.email}</p>
                            <p>NIC/Passport : {ticket?.assigner?.nic}</p></>}
                    </div>
                </>}
            </div>
        </div>

    </React.Fragment>)
}

export default TicketCard;
