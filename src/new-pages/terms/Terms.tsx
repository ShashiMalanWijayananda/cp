
import React from "react";
import "./Terms.css";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";

const Terms: React.FC = () => {
  return (
    <div className="terms-page-container">
      <div className="terms-content-main">
        <div className="terms-page-heading">
          <h1>Protocol</h1>
        </div>

        <div className="terms-content-wrapper">
          <div className="terms-grid">
            {/* LEFT COLUMN */}
            <div className="terms-column">
              {/* Event Details */}
              <section className="terms-section">
                <h2 className="section-title">Event Details</h2>
                <div className="section-content">
                  <table className="event-details-table">
                    <tbody>
                      <tr><td>Event Title</td><td>:</td><td>Yogeshwari</td></tr>
                      <tr><td>Date</td><td>:</td><td>29th/30th November 2025</td></tr>
                      <tr>
                        <td>Venue</td><td>:</td>
                        <td>Sri Lanka Port Authority<br/>Beira New Yard, Colombo</td>
                      </tr>
                      <tr><td>Gates Open</td><td>:</td><td>4:30 PM</td></tr>
                      <tr><td>Gates Close</td><td>:</td><td>7:30 PM</td></tr>
                      <tr><td>Show Starts</td><td>:</td><td>7:00 PM</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Parking & Shuttle Service */}
              <section className="terms-section">
                <h2 className="section-title">Parking &amp; Shuttle Service</h2>
                <div className="section-content">
                  <ul className="bullet-list">
                    <li>
                      <strong>Parking Location:</strong>{" "}
                      <a href="#" aria-label="SLECC Car Park">
                        Sri Lanka Exhibition &amp; Convention Centre (SLECC)
                      </a>{" "}
                      Car Park.
                    </li>
                    <li>
                      <strong>Shuttle Service:</strong>
                      <ul>
                        <li>Free shuttle buses will operate between 4:00 PM – 6:30 PM from SLECC to the Beira New Yard venue.</li>
                        <li>Return shuttle services will resume from 9:30 PM – 11:30 PM.</li>
                      </ul>
                    </li>
                    <li>Boarding to the shuttle will be first come first serve basis.</li>
                    <li>
                      Attendees who travel through their own transport should stop at{" "}
                      <a href="#" aria-label="Jln Pandan Junction">Jln Pandan Junction</a>{" "}
                      and walk through to the venue entrance.
                    </li>
                    <li>Please follow marshals and signage for boarding areas.</li>
                  </ul>
                </div>
              </section>

              {/* Prohibited Items */}
              <section className="terms-section">
                <h2 className="section-title">Prohibited Items</h2>
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
              </section>

              {/* Audio & Visual Disclaimer */}
              <section className="terms-section">
                <h2 className="section-title">Audio &amp; Visual Disclaimer</h2>
                <div className="section-content">
                  <ul className="bullet-list">
                    <li>By entering the venue, you consent to photography, audio recording, and video filming for event promotion purposes.</li>
                    <li>No personal recording or live streaming of the event is permitted.</li>
                  </ul>
                </div>
              </section>

              {/* Organizers' Rights */}
              <section className="terms-section">
                <h2 className="section-title">Organizers’ Rights</h2>
                <div className="section-content">
                  <p>The event organizers reserve the right to:</p>
                  <ul className="bullet-list">
                    <li>Modify or reschedule with prior notice.</li>
                    <li>Change entrance arrangements due to safety, logistics, or unforeseen circumstances.</li>
                    <li>Refuse entry to any person who does not comply with these terms.</li>
                  </ul>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="terms-column">
              {/* Ticketing & Entry */}
              <section className="terms-section">
                <h2 className="section-title">Ticketing &amp; Entry</h2>
                <div className="section-content">
                  <ul className="bullet-list">
                    <li>This ticket admits one person only.</li>
                    <li>
                      Entry is permitted only via the designated zone entrance:
                      <ul>
                        <li>Zone A: Use Entrance Gate A</li>
                        <li>Zone 2: Use Entrance Gate 2</li>
                      </ul>
                    </li>
                    <li>Attendees must carry a valid ID to match the NIC/Passport on the ticket</li>
                    <li>Tickets purchased from unauthorized sources may be refused entry.</li>
                  </ul>
                </div>
              </section>

              {/* Venue Map & Zones */}
              <section className="terms-section">
                <h2 className="section-title">Venue Map &amp; Zones</h2>
                <div className="section-content">
                  <p>Refer to the attached venue map for:</p>
                  <ul className="bullet-list">
                    <li>Entrance gate locations for Zone A and Zone 2</li>
                    <li>Sanitary areas, first aid, food &amp; beverage</li>
                    <li>Emergency exits and evacuation paths</li>
                    <li>Audience members must remain within their allocated zones.</li>
                  </ul>
                </div>
              </section>

              {/* Conduct & Safety */}
              <section className="terms-section">
                <h2 className="section-title">Conduct &amp; Safety</h2>
                <div className="section-content">
                  <ul className="bullet-list">
                    <li>Security personnel and volunteer marshals will be stationed throughout the venue.</li>
                    <li>Any person engaging in disorderly, offensive, or unsafe behavior will be removed.</li>
                    <li>Please cooperate with security checks at all entry points.</li>
                    <li>In case of emergency, follow directions from the nearest safety marshal.</li>
                  </ul>
                </div>
              </section>

              {/* Refunds & Cancellations */}
              <section className="terms-section">
                <h2 className="section-title">Refunds &amp; Cancellations</h2>
                <div className="section-content">
                  <ul className="bullet-list">
                    <li>Tickets are non-refundable unless the event is canceled or rescheduled.</li>
                    <li>In the event of force majeure, the organizers reserve the right to postpone or cancel the event.</li>
                    <li>Any changes will be communicated via official channels.</li>
                  </ul>
                </div>
              </section>

              {/* Contact & Assistance */}
              <section className="terms-section">
                <h2 className="section-title">Contact &amp; Assistance</h2>
                <div className="section-content">
                  <ul className="bullet-list">
                    <li>For official event updates, visit:<br/>Official Instagram/Facebook page — Yogeshwari Live</li>
                    <li>For support or shuttle coordination, contact our hot line:<br/>+94 70 621 8825</li>
                    <li>Thank You For Being a Part of Yogeshwari Concert</li>
                    <li>Let’s create a respectful, immersive, and unforgettable live musical experience.</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
       {/* Global scrolling footer message */}
      <GlobalFooter text="**** AGENT SUPPORT ACTIVE **** COMMUNICATION CHANNELS OPERATIONAL **** HQ STANDING BY **** " />

    </div>

  );
};

export default Terms;
