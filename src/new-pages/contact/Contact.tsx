import React, {FC} from "react";
import "./Contact.css";

const Contact: FC = () => {
    return (
        <React.Fragment>
            <div className="w-full h-auto p-5 gap-4 fixed flex flex-col flex items-center justify-center">
                <div className="w-full min-[375px]:overflow-y-auto gap-4 min-[375px]:h-[70vh] min-[414px]:h-[60vh] lg:h-full sticky p-[10px]">
                    <div className="yo-contact-view">
                        {/* Updated class names throughout */}
                        
                        <div className="yo-contact-content">
                            <h1 className="yo-contact-title">AGENT SUPPORT</h1>

                            <div className="yo-contact-split-content">
                                <div className="yo-contact-main-content">
                                    <div className="yo-contact-section">
                                        <p>You've reached HQ. Need backup, intel, or direct orders?</p>
                                        <p>Our field operatives are standing by across multiple channels.</p>
                                        <p>Choose your preferred communication protocol below.</p>
                                    </div>
                                </div>

                                <div className="yo-contact-details-panel">
                                    <div className="yo-contact-section">
                                        <h2 className="yo-contact-section-title">Official Instagram Page</h2>
                                        <div className="yo-contact-section-content">
                                            <p>
                                                <strong>Handle:</strong> @yogeshwari_live
                                            </p>
                                            <p>
                                                <strong>Status:</strong> Active 24/7
                                            </p>
                                            <p>
                                                <strong>Best for:</strong> Updates, behind-the-scenes intel, and mission briefings
                                            </p>
                                            <p>
                                                <a href="https://instagram.com/yogeshwari_live" 
                                                   className="yo-contact-link" 
                                                   target="_blank" 
                                                   rel="noopener noreferrer">
                                                    → Access Channel
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="yo-contact-section">
                                        <h2 className="yo-contact-section-title">Direct Support Coordination</h2>
                                        <div className="yo-contact-section-content">
                                            <p>
                                                <strong>Contact:</strong> +94 77X XXX XXX
                                            </p>
                                            <p>
                                                <strong>Hours:</strong> 0900-2100 (Sri Lanka Time)
                                            </p>
                                            <p>
                                                <strong>Protocol:</strong> SMS/WhatsApp preferred
                                            </p>
                                            <p>
                                                <strong>Use for:</strong> Critical support, technical issues, emergency coordination
                                            </p>
                                        </div>
                                    </div>

                                    <div className="yo-contact-section">
                                        <h2 className="yo-contact-section-title">Digital Operations</h2>
                                        <div className="yo-contact-section-content">
                                            <p>
                                                <strong>Email:</strong> support@yogeshwari.one
                                            </p>
                                            <p>
                                                <strong>Response Time:</strong> 24-48 hours
                                            </p>
                                            <p>
                                                <strong>Best for:</strong> Detailed inquiries, documentation requests, technical reports
                                            </p>
                                            <p>
                                                <a href="mailto:support@yogeshwari.one" 
                                                   className="yo-contact-link">
                                                    → Send Message
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="yo-contact-section">
                                        <h2 className="yo-contact-section-title">Mission Coordination</h2>
                                        <div className="yo-contact-section-content">
                                            <p>
                                                <strong>Status:</strong> Operational
                                            </p>
                                            <p>
                                                <strong>Coverage:</strong> Colombo Metro Area
                                            </p>
                                            <p>
                                                <strong>Services:</strong>
                                            </p>
                                            <div className="yo-contact-bullet-point">→ Ticket verification support</div>
                                            <div className="yo-contact-bullet-point">→ Venue location assistance</div>
                                            <div className="yo-contact-bullet-point">→ Real-time mission updates</div>
                                            <div className="yo-contact-bullet-point">→ Emergency coordination</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="yo-contact-image-wrapper">
                                    <img 
                                        src="/images/contact-support.jpg" 
                                        alt="Support Operations"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Contact;