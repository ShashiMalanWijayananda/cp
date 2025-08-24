import React, { FC } from "react";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";
import "./Terms.css";

const Terms: FC = () => {
  return (
    <>
      {/* Page heading (colors/sizes come from your global tokens) */}
      <div className="terms-page-heading">
        <h1>Protocol</h1>
      </div>

      {/* Main page container (sits inside AppLayout Outlet) */}
      <main className="terms-page-container" role="main">
        <section className="terms-content-main">
          <div className="terms-content-wrapper">

            {/* Terms grid layout */}
            <div className="terms-grid">

              {/* Left Column */}
              <div className="terms-column">

                <div className="terms-section">
                  <header className="section-title" aria-label="section heading">Event details</header>
                  <div className="section-content">
                    <table className="event-details-table">
                      <tbody>
                        <tr>
                          <td><li>Event Title</li></td>
                          <td>:</td>
                          <td>Yogeshwari</td>
                        </tr>
                        <tr>
                          <td><li>Date</li></td>
                          <td>:</td>
                          <td>29th/30th November 2025</td>
                        </tr>
                        <tr>
                          <td><li>Venue</li></td>
                          <td>:</td>
                          <td>
                            <a target="_blank" rel="noopener noreferrer" href="https://maps.app.goo.gl/7DFJw5hkfMNk8ZSy8">
                              Sri Lanka Port Authority<br/>
                              Beira New Yard, Colombo
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td><li>Gates Open</li></td>
                          <td>:</td>
                          <td>4:30 PM</td>
                        </tr>
                        <tr>
                          <td><li>Gates Close</li></td>
                          <td>:</td>
                          <td>7:30 PM</td>
                        </tr>
                        <tr>
                          <td><li>Show Starts</li></td>
                          <td>:</td>
                          <td>7:00 PM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="terms-section">
                  <header className="section-title" aria-label="section heading">Parking & shuttle service</header>
                  <div className="section-content">
                    <ul className="bullet-list">
                      <li>Parking Location: <a href="https://maps.app.goo.gl/jrg6Fv8oqXt4NUF7A" target="_blank">Sri Lanka Exhibition & Convention Center (SLECC) Car Park, Colombo 07</a>.</li>
                      <li>Shuttle Service:</li>
                      <li>Pickup: 4:00 PM - 5:30 PM from SLECC to No Limits Beira New Yard.</li>
                      <li>Return shuttle services will resume from 9:30 PM - 11:30 PM.</li>
                      <li>Boarding the shuttle will be first come first serve basis.</li>
                      <li>Private transport should stop at <a href="https://maps.app.goo.gl/cPcKjFmtEuAg9idS6" target="_blank">Jin Pendan junction</a> and walk through to the venue entrance.</li>
                      <li>Please follow marshals and signage for boarding areas.</li>
                    </ul>
                  </div>
                </div>

                <div className="terms-section">
                  <header className="section-title" aria-label="section heading">Prohibited items</header>
                  <div className="section-content">
                    <ul className="bullet-list">
                      <li>To ensure safety and comfort, the following items are prohibited:</li>
                      <li>Alcohol, cigarettes, drugs, or illegal substances.</li>
                      <li>Food and beverages from outside.</li>
                      <li>Professional cameras, equipment, recorders, and video recording devices.</li>
                      <li>Banners, flags, or signage without prior approval.</li>
                      <li>Glass containers.</li>
                      <li>Laser pointers, fireworks, or any pyrotechnic items.</li>
                    </ul>
                  </div>
                </div>

                <div className="terms-section">
                  <header className="section-title" aria-label="section heading">Audio & visual disclaimer</header>
                  <div className="section-content">
                    <ul className="bullet-list">
                      <li>By entering the venue, you consent to photography, audio recording, and video filming for event promotion purposes.</li>
                      <li>No personal recording or live streaming of the event is permitted.</li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="terms-column">

                <div className="terms-section">
                  <header className="section-title" aria-label="section heading">Ticketing & entry</header>
                  <div className="section-content">
                    <ul className="bullet-list">
                      <li>This ticket admits one person only.</li>
                      <li>Entry is permitted only via the designated zone entrance:</li>
                      <li>Zone A: Use Entrance Gate A</li>
                      <li>Zone Z: Use Entrance Gate Z</li>
                      <li>Attendees must carry a valid ID to match the NIC/Passport on the ticket</li>
                      <li>Tickets purchased from unauthorized sources may be refused entry.</li>
                    </ul>
                  </div>
                </div>

                <div className="terms-section">
                  <header className="section-title" aria-label="section heading">Venue map & zones</header>
                  <div className="section-content">
                    <ul className="bullet-list">
                      <li>Refer to the attached venue map for:</li>
                      <li>Entrance gate locations for Zone A and Zone Z</li>
                      <li>Sanitary areas, first aid, food & beverage</li>
                      <li>Emergency exits and evacuation paths</li>
                      <li>Audience members must remain within their allocated zones.</li>
                    </ul>
                  </div>
                </div>

                <div className="terms-section">
                  <header className="section-title" aria-label="section heading">Conduct & safety</header>
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
                  <header className="section-title" aria-label="section heading">Refunds & cancellations</header>
                  <div className="section-content">
                    <ul className="bullet-list">
                      <li>Tickets are non-refundable unless the event is canceled or rescheduled.</li>
                      <li>In the event of force majeure, the organizers reserve the right to postpone or cancel the event.</li>
                      <li>Any changes will be communicated via official channels.</li>
                    </ul>
                  </div>
                </div>

                <div className="terms-section">
                  <header className="section-title" aria-label="section heading">Contact & assistance</header>
                  <div className="section-content">
                    <ul className="bullet-list">
                      <li>
                        For official event updates, visit:<br/>
                        <strong>
                          Official <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/kuweni.concert?igsh=YXJkaHZuMmk3ajZl">Instagram</a>/<a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/share/1B1V4LBMZq/">Facebook</a> page – Yogeshwari Live
                        </strong>
                      </li>
                      <li>
                        For support or shuttle coordination, contact our hotline:<br/>
                        <strong>+94 70 621 8825</strong>
                      </li>
                      <li>Thank You for Being a Part of Yogeshwari Concert</li>
                      <li>Let's create a respectful, immersive, and unforgettable live musical experience.</li>
                    </ul>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>
      </main>

      {/* Global scrolling footer message - MOVED OUTSIDE of main container */}
      <GlobalFooter text="**** PROTOCOL ESTABLISHED **** TERMS ACKNOWLEDGED **** MISSION PARAMETERS SET **** " />

    </>
  );
};

export default Terms;
