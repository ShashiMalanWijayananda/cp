import "./ticket.css";
import {ITicket} from "../../interfaces/data.interfaces";
import {FC} from "react";

interface TicketViewProps {
    ticket?: ITicket;
    index?: number;
    ticketRefs?: any;
    onShare?: (ticket: ITicket) => void;
    onDownload?: (id: string) => void;
    isShared?: boolean;
}

const TicketCard: FC<TicketViewProps> = ({ticket, index, ticketRefs, onShare, onDownload, isShared}) => {
    // Determine zone class for styling
    const zoneClass = ticket?.zoneId === "zoneA" ? "zoneA" : "zoneZ";
    
    return (
        <div className="ticket-container">
            <div className="ticket-wrapper">
                {/* Action buttons */}
                {!isShared ? (
                    <div className="ticket-action">
                        <div 
                            className="action-group" 
                            onClick={() => ticket && onShare && onShare(ticket)} 
                            role="button"
                            aria-label="Share ticket"
                        >
                            <span className="pi pi-share-alt action-icon"></span>
                            <span className="action-text">Share ticket</span>
                        </div>
                    </div>
                ) : (
                    <div className="ticket-action">
                        <div 
                            className="action-group" 
                            onClick={() => ticket?.id && onDownload && onDownload(ticket.id)} 
                            role="button" 
                            aria-label="Download ticket"
                        >
                            <span className="pi pi-download action-icon"></span>
                            <span className="action-text">Download ticket</span>
                        </div>
                    </div>
                )}

                <div className="ticket-relative">
                    {/* Overlay for non-shared tickets */}
                    {!isShared && (
                        <div 
                            className="ticket-overlay" 
                            onClick={() => ticket && onShare && onShare(ticket)} 
                            aria-hidden="true"
                        />
                    )}

                    {/* Main ticket content */}
                    <div
                        ref={(el) => ticketRefs && ticketRefs.current && (ticketRefs.current[index || 0] = el)}
                        className={`submarine-theme ${zoneClass}`}
                    >
                        <div className="ticket">
                            {/* Header Section */}
                            <div className="ticket-header-section">
                                <h1 className="concert-name">
                                    {ticket?.event?.eventName?.toUpperCase() || "YOGESHWARI"}
                                </h1>
                                <h2 className="concert-text">LIVE IN CONCERT</h2>
                                <div className="ticket-protocol">TICKET PROTOCOL</div>
                            </div>

                            {/* Graphics Section */}
                            <div className="ticket-graphics">
                                <img 
                                    src={ticket?.qrData || "images/icon/qr_code.png"} 
                                    className="qr-area" 
                                    alt="QR Code"
                                />
                                <div className="right-section">
                                    <div className="submarine-graphic"></div>
                                    <div className="location-year">
                                        {ticket?.event?.eventLocation || "VENUE"} {new Date(ticket?.event?.eventDate || Date.now()).getFullYear()}
                                    </div>
                                    <div className="sound-wave"></div>
                                    <div className="agent-verification">AGENT ID VERIFIED</div>
                                </div>
                            </div>

                            {/* Agent Section */}
                            <div className="agent-section">
                                <div className="agent-label">AGENT</div>
                                <div className="agent-name">
                                    {ticket?.assigner?.nic || ticket?.assigner?.email || "ATTENDEE"}
                                </div>

                                <div className="access-details">
                                    <div className="access-zone-label">ACCESS ZONE:</div>
                                    <div className="zone-designation">
                                        ZONE {ticket?.zoneId?.toUpperCase()?.replace("ZONE", "") || "A"}
                                    </div>

                                    <div className="barcode-section">
                                        <img
                                            src={ticket?.qrData || "images/icon/qr_code.png"}
                                            alt={`Code for ticket #${ticket?.sequenceId || "N/A"}`}
                                            className="barcode-image"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Engage Access Button */}
                            <div className="engage-access-button">
                                ENGAGE ACCESS
                            </div>

                            {/* Footer Section */}
                            <div className="ticket-footer">
                                <div className="event-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Date:</span>
                                        <span>{ticket?.event?.eventDate || "N/A"}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Time:</span>
                                        <span>{ticket?.event?.eventTime || "N/A"}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Price:</span>
                                        <span>{ticket?.price || "N/A"} LKR</span>
                                    </div>
                                </div>

                                <div className="sequence-id">
                                    #{ticket?.sequenceId || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assigner Badge */}
                    {ticket?.assigner && (
                        <div className="assigner-badge">
                            <span className="assigner-icon">
                                <i className="pi pi-user-plus" aria-hidden="true"></i>
                            </span>
                            <span>
                                Shared with: {ticket?.assigner?.email}
                                {ticket?.assigner?.nic && <span> ({ticket?.assigner?.nic})</span>}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketCard;