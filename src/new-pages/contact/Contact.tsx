import React, {FC} from "react";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";
import "./Contact.css";

const Contact: FC = () => {
  return (
    <>
      {/* Page heading (colors/sizes come from your global tokens) */}
      <div className="contact-page-heading">
        <h1>Agent Support</h1>
      </div>

      {/* Main page container (sits inside AppLayout Outlet) */}
      <main className="contact-page-container" role="main">
        <section className="contact-content-main">
          <div className="contact-content-wrapper">

            {/* Introduction section */}
            <div className="contact-intro-section">
              <div className="contact-intro-content">
                <p>You've reached HQ. Need backup, intel, or direct orders? We're locked, loaded, and ready to respond.</p>
                <p>We operate on a tight response protocol. Expect a reply within 24 hours—faster during mission-critical periods.</p>
              </div>
            </div>

            {/* Contact details grid */}
            <div className="contact-details-grid">

              {/* Social Channels Section */}
              <div className="contact-section">
                <header className="contact-section-title" aria-label="section heading">Social surveillance channels</header>
                <div className="contact-section-content">
                  <p><strong>Facebook:</strong> <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/share/1B1V4LBMZq/" className="contact-link">Facebook Recon Base</a></p>
                  <p><strong>Instagram:</strong> <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/kuweni.concert?igsh=YXJjaHZuMmk3ajZl" className="contact-link">Instagram Command Feed</a></p>
                </div>
              </div>

              {/* Direct Support Section */}
              <div className="contact-section">
                <header className="contact-section-title" aria-label="section heading">Direct support coordination</header>
                <div className="contact-section-content">
                  <p><strong>Contact:</strong> +94 70 621 8825</p>
                  <p><em>Available during operation hours and on event deployment days</em></p>
                  <p><strong>Protocol:</strong> SMS/WhatsApp preferred</p>
                  <p><strong>Use for:</strong> Critical support, technical issues, emergency coordination</p>
                </div>
              </div>

              {/* Digital Operations Section */}
              <div className="contact-section">
                <header className="contact-section-title" aria-label="section heading">Digital operations</header>
                <div className="contact-section-content">
                  <p><strong>Email:</strong> info@yogeshwari.one</p>
                  <p><strong>Response Time:</strong> 24 hours (faster during mission-critical periods)</p>
                  <p><strong>Best for:</strong> Detailed inquiries, documentation requests, technical reports</p>
                  <p>
                    <a
                        href="mailto:info@yogeshwari.one"
                        className="contact-link"
                    >
                      → Send Message
                    </a>
                  </p>
                </div>
              </div>

              {/* Mission Coordination Section (kept from existing content) */}
              <div className="contact-section">
                <header className="contact-section-title" aria-label="section heading">Mission coordination</header>
                <div className="contact-section-content">
                  <p><strong>Status:</strong> Operational</p>
                  <p><strong>Coverage:</strong> Colombo Metro Area</p>
                  <p><strong>Services:</strong></p>
                  <div className="contact-service-list">
                    <div className="contact-service-item">→ Ticket verification support</div>
                    <div className="contact-service-item">→ Venue location assistance</div>
                    <div className="contact-service-item">→ Real-time mission updates</div>
                    <div className="contact-service-item">→ Emergency coordination</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Support image */}
            <aside className="contact-image-section" aria-label="Support operations">
              <div className="contact-section">
                <div className="section-title">Ticketing guide:</div>
                <a href="https://drive.google.com/file/d/13p5boSXDeLnjkZ2kNnIq1oS1iac7ePNI/view?usp=sharing" target="_blank"><p className="pl-4 pt-4 pb-4">Download.</p></a>
              </div>
            </aside>

          </div>
        </section>
      </main>

      {/* Global scrolling footer message - MOVED OUTSIDE of main container */}
      <GlobalFooter text="**** AGENT SUPPORT ACTIVE **** COMMUNICATION CHANNELS OPERATIONAL **** HQ STANDING BY **** " />

    </>
  );
};

export default Contact;
