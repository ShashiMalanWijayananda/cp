import React, { FC, useRef, useState } from 'react';
import './purchasing-card.css';

interface PurchasingCardProps {
    eventData: {
        title: string;
        date: string;
        time: string;
        location: string;
        image: string;
        price: number;
    };
    onCheckout: () => void;
    onUpdateTicketCount: (ticketCount: number) => void;
}

const PurchasingCard: FC<PurchasingCardProps> = ({ eventData, onCheckout, onUpdateTicketCount }) => {
    const [ticketCount, setTicketCount] = useState(0);
    const cardRef = useRef(null);

    const increaseCount = () => {
        if (ticketCount < 4) {
            const newCount = ticketCount + 1;
            setTicketCount(newCount);
            onUpdateTicketCount(newCount);
        }
    };

    const decreaseCount = () => {
        if (ticketCount > 0) {
            const newCount = ticketCount - 1;
            setTicketCount(newCount);
            onUpdateTicketCount(newCount);
        }
    };




    return (
        <div className="purchasing-container">
            <div className="purchasing-wrapper">
                {/*<div className="purchasing-action">*/}
                {/*    <div className="action-group" onClick={onCheckout} role="button" aria-label="Checkout tickets">*/}
                {/*        <span className="pi pi-shopping-cart action-icon"></span>*/}
                {/*        <span className="action-text">Purchase tickets</span>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="purchasing-relative">


                    <div
                        ref={cardRef}
                        className="purchasing-content submarine-theme"
                    >
                        <div className="submarine-ticket">
                            <div className="purchasing-header-section">
                                <h1 className="artist-name">{eventData.title.toUpperCase()}</h1>
                                <h2 className="concert-text">LIVE IN CONCERT</h2>
                                {/*<div className="purchasing-protocol">TICKET PROTOCOL</div>*/}
                            </div>

                            <div className="purchasing-graphics">
                                <div className="event-image">
                                    <img src={eventData.image} alt={eventData.title} className="event-thumbnail" />
                                </div>
                                {/*<div className="right-section">*/}
                                {/*    <div className="submarine-graphic"></div>*/}
                                {/*    <div className="location-year">*/}
                                {/*        {eventData.location} {new Date(eventData.date).getFullYear()}*/}
                                {/*    </div>*/}
                                {/*    <div className="sound-wave"></div>*/}
                                {/*    <div className="agent-verification">EVENT VERIFIED</div>*/}
                                {/*</div>*/}
                            </div>

                            <div className="purchasing-selector">
                                <div className="purchasing-counter">
                                    <div className="counter-label">SELECT TICKETS:</div>
                                    <div className="counter-controls">
                                        <button
                                            className="counter-button decrease"
                                            onClick={decreaseCount}
                                            disabled={ticketCount <= 0}
                                        >
                                            <span className="pi pi-minus"></span>
                                        </button>
                                        <div className="counter-value">{ticketCount}</div>
                                        <button
                                            className="counter-button increase"
                                            onClick={increaseCount}
                                            disabled={ticketCount >= 4}
                                        >
                                            <span className="pi pi-plus"></span>
                                        </button>
                                    </div>
                                </div>

                                <div className="price-details">
                                    <div className="price-row">
                                        <span className="price-label">Price per ticket:</span>
                                        <span className="price-value">LKR {eventData.price}</span>
                                    </div>
                                    <div className="price-row total">
                                        <span className="price-label">Total:</span>
                                        <span className="price-value">LKR {(eventData.price * ticketCount).toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    className={`engage-access-button ${ticketCount > 0 ? 'active' : ''}`}
                                    onClick={onCheckout}
                                    disabled={ticketCount <= 0}
                                >
                                    {ticketCount > 0 ? 'CHECKOUT NOW' : 'SELECT TICKETS'}
                                </button>
                            </div>

                            <div className="purchasing-footer">
                                <div className="event-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Date:</span>{" "}
                                        {eventData.date}
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Time:</span>{" "}
                                        {eventData.time}
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Max:</span>{" "}
                                        4 tickets
                                    </div>
                                </div>

                                {/*<div className="sequence-id">*/}
                                {/*    #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchasingCard;
