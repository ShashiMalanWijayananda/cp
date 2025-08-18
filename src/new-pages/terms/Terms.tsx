import React, {FC} from "react";
import "./Terms.css";

const Terms: FC = () => {
    return (
        <React.Fragment>
            <div className="w-full h-auto p-5 gap-4 fixed flex flex-col flex items-center justify-center ">
                <div
                    className="w-full min-[375px]:overflow-y-auto gap-4 min-[375px]:h-[70vh] min-[414px]:h-[60vh] lg:h-full sticky p-[10px] ">
                    <div className="terms-view">

                        {/*<div className="terms-box">*/}
                        {/*  <Logo variant="small" />*/}
                        {/*    <h1 className="terms-view-title">AGENT ENTRY PROTOCOL</h1>*/}
                        {/*</div>*/}

                        <div className="terms-content-container">
                            <div className="content">
                                <div className="terms-grid">
                            {/* Left Column */}
                            <div className="terms-column">
                                <div className="terms-section">
                                    <div className="section-title">Event Details</div>
                                    <div className="section-content">
                                        <table className="event-details-table">
                                            <tbody>
                                            <tr>
                                                <td>Event Title</td>
                                                <td>:</td>
                                                <td>Yogeshwari</td>
                                            </tr>
                                            <tr>
                                                <td>Date</td>
                                                <td>:</td>
                                                <td>29th/30th November 2025</td>
                                            </tr>
                                            <tr>
                                                <td>Venue</td>
                                                <td>:</td>
                                                <td>
                                                    <a target="_blank" href={"https://maps.app.goo.gl/7DFJw5hkfMNk8ZSy8"}>
                                                        Sri Lanka Port Authority<br/>
                                                        Beira New Yard, Colombo
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Gates Open</td>
                                                <td>:</td>
                                                <td>4:30 PM</td>
                                            </tr>
                                            <tr>
                                                <td>Gates Close</td>
                                                <td>:</td>
                                                <td>7:30 PM</td>
                                            </tr>
                                            <tr>
                                                <td>Show Starts</td>
                                                <td>:</td>
                                                <td>7:00 PM</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="terms-section">
                                    <div className="section-title">Parking & Shuttle Service</div>
                                    <div className="section-content">
                                        <ul className="bullet-list">
                                            <li>Parking Location: <a target="_blank" href="https://maps.app.goo.gl/jrg6Fv8oqXt4NUF7A">Sri Lanka Exhibition & Convention Centre (SLECC) Card Park.</a></li>
                                            <li>
                                                Shuttle Service:
                                                <ul>
                                                    <li>Free shuttle buses will operate between 4:00 PM – 6:30 PM from SLECC to the Beria New Yard venue.</li>
                                                    <li>Return shuttle services will resume from 9:30 PM – 11:30 PM.</li>
                                                </ul>
                                            </li>
                                            <li>Boarding to the shuttle will be first come first serve basis.</li>
                                            <li>Attendees will travel through own transport should stop at <a target="_blank" href="https://maps.app.goo.gl/cPcKjFmtEuAg9idS6">Jln Pandan Junction and walk through to the venue entrance</a></li>
                                            <li>Please follow marshals and signage for boarding areas.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="terms-section">
                                    <div className="section-title">Venue Map & Zones</div>
                                    <div className="section-content">
                                        <p>(Zone map will be published later)</p>
                                        <ul className="bullet-list">
                                            <li>
                                                Refer to the attached venue map for:
                                                <ul>
                                                    <li>Entrance gate locations for Zone A and Zone Z</li>
                                                    <li>Sanitary areas, first aid, food & beverage</li>
                                                    <li>Emergency exits and evacuation paths</li>
                                                </ul>
                                            </li>
                                            <li>Audience members must remain within their allocated zones.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="terms-section">
                                    <div className="section-title">Audio & Visual Disclaimer</div>
                                    <div className="section-content">
                                        <ul className="bullet-list">
                                            <li>By entering the venue, you consent to photography, audio recording, and video filming for event promotion purposes.</li>
                                            <li>No personal recording or live streaming of the event is permitted.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="terms-section">
                                    <div className="section-title">Organizers' Rights</div>
                                    <div className="section-content">
                                        <ul className="bullet-list">
                                            <li>
                                                The event organizers reserve the right to:
                                                <ul>
                                                    <li>Modify or reschedule with prior notice.</li>
                                                    <li>Change entrance arrangements due to safety, logistics, or unforeseen circumstances.</li>
                                                    <li>Refuse entry to any person who does not comply with these terms.</li>
                                                </ul>
                                            </li>
                                        </ul>
                                        <p><strong>Official <a target="_blank" href="https://www.instagram.com/kuweni.concert?igsh=YXJkaHZuMmk3ajZl">Instagram</a> / <a target="_blank" href="https://www.facebook.com/share/1B1V4LBMZq/">Facebook</a> page – Yogeshwari</strong></p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="terms-column">
                                <div className="terms-section">
                                    <div className="section-title">Ticketing & Entry</div>
                                    <div className="section-content">
                                        <ul className="bullet-list">
                                            <li>Each person is allowed to purchase a maximum of 4 tickets per show.</li>
                                            <li>One ticket admits one person only.</li>
                                            <li>
                                                Entry is permitted only via the designated zone entrance:
                                                <ul>
                                                    <li>Zone A: Use Entrance Gate A</li>
                                                    <li>Zone Z: Use Entrance Gate Z</li>
                                                </ul>
                                            </li>
                                            <li>Attendees must carry a valid ID to match the NIC/Passport on the ticket.</li>
                                            <li>Tickets purchased from unauthorized sources may be refused entry.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="terms-section">
                                    <div className="section-title">Prohibited Items</div>
                                    <div className="section-content">
                                        <p>To ensure safety and comfort, the following items are prohibited:</p>
                                        <ul className="bullet-list">
                                            <li>Alcohol, cigarettes, drugs, or illegal substances</li>
                                            <li>Weapons, sharp objects, or explosives</li>
                                            <li>Professional camera equipment, drones, and video recorders</li>
                                            <li>Banners, flags, or signage without prior approval</li>
                                            <li>Laser pointers, fireworks, or any pyrotechnic items</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="terms-section">
                                    <div className="section-title">Conduct & Safety</div>
                                    <div className="section-content">
                                        <ul className="bullet-list">
                                            <li>Security personnel and volunteer marshals will be stationed throughout the venue.</li>
                                            <li>Any person engaging in disorderly, offensive, or unsafe behavior will be removed.</li>
                                            <li>Please cooperate with security checks at all entry points.</li>
                                            <li>In case of emergency, follow directions from the nearest safety marshal.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="terms-section">
                                    <div className="section-title">Refunds & Cancellations</div>
                                    <div className="section-content">
                                        <ul className="bullet-list">
                                            <li>Tickets are non-refundable unless the event is canceled or rescheduled.</li>
                                            <li>In the event of force majeure, the organizers reserve the right to postpone or cancel the event.</li>
                                            <li>Any changes will be communicated via official channels.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="terms-section">
                                    <div className="section-title">Contact & Assistance</div>
                                    <div className="section-content">
                                        <ul className="bullet-list">
                                            <li>
                                                For official event updates, visit:<br/>
                                                <strong>Official <a target="_blank" href="https://www.instagram.com/kuweni.concert?igsh=YXJkaHZuMmk3ajZl">Instagram</a> / <a target="_blank" href="https://www.facebook.com/share/1B1V4LBMZq/">Facebook</a> page – Yogeshwari </strong>
                                            </li>
                                            <li>
                                                For support or shuttle coordination, contact our hotline:<br/>
                                                <strong>+94 70 621 8825</strong>
                                            </li>
                                            <li>Thank You for Being a Part of Yogeshwari Concert</li>
                                            <li>Let's create a respectful, immersive, and unforgettable live musical
                                                experience.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Terms;
