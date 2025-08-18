import React, {FC} from "react";
import "./Contact.css";

const Contact: FC = () => {
    return (
        <React.Fragment>
            <div className="w-full h-auto p-5 gap-4 fixed flex flex-col flex items-center justify-center ">
                <div
                    className="w-full min-[375px]:overflow-y-auto gap-4 min-[375px]:h-[70vh] min-[414px]:h-[60vh] lg:h-full sticky p-[10px]">
                    <div className="contact-view">
                        {/*<Logo variant="small" />*/}

                        <div className="content">
                            {/*<h1 className="contact-title">AGENT SUPPORT</h1>*/}

                            <div className="split-content">
                                <div className="contact-content">
                                    <div className="contact-section">
                                        <p>You've reached HQ. Need backup, intel, or direct orders? We’re locked,
                                            loaded,
                                            and ready to respond.</p>
                                    </div>

                                    <div className="contact-section">
                                        <div className="section-title">Mission Comms (Email):</div>
                                        <p>Dispatch your inquiries, intel reports, or mission requests to:<br/>
                                            <a href="mailto:info@yogeshwari.one"
                                               className="contact-link">info@yogeshwari.one</a>
                                        </p>
                                    </div>

                                    <div className="contact-section">
                                <div className="section-title">Field Ops Hotline:</div>
                                <p>
                                    For real-time support and rapid response, call our Command Unit:<br />
                                    <strong>+94 70 621 8825</strong><br />
                                    <em>(Available during operation hours and on event deployment days)</em>
                                </p>
                            </div>

                            <div className="contact-section">
                                <div className="section-title">Social Surveillance Channels:</div>
                                <p>
                                    Follow our official comms on:<br/>
                                    <a target="_blank" href="https://www.facebook.com/share/1B1V4LBMZq/"
                                       className="contact-link">Facebook Recon Base</a><br/>
                                    <a target="_blank"
                                       href="https://www.instagram.com/kuweni.concert?igsh=YXJjaHZuMmk3ajZl"
                                       className="contact-link">Instagram Command Feed</a>
                                </p>
                            </div>

                            <div className="contact-section">
                                <div className="section-title">Response Time:</div>
                                <p>We operate on a tight response protocol. Expect a reply within 24 hours—faster during
                                    mission-critical periods.</p>
                            </div>

                                    <div className="contact-section">
                                        <div className="section-title">Ticketing Guide:</div>
                                        <p className="contact-link"><a
                                            href="https://drive.google.com/file/d/13p5boSXDeLnjkZ2kNnIq1oS1iac7ePNI/view?usp=sharing"
                                            target="_blank" className="contact-link">Download Ticketing Guide.</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<div className="powered-by">*/}
                        {/*    <a href="https://shehans.github.io/site/" target="_blank">Powered by: Grit Co Digital</a>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
};

export default Contact;
