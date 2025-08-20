import React, { FC } from "react";
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
                <p>You&apos;ve reached HQ. Need backup, intel, or direct orders?</p>
                <p>Our field operatives are standing by across multiple channels.</p>
                <p>Choose your preferred communication protocol below.</p>
              </div>
            </div>

            {/* Contact details grid */}
            <div className="contact-details-grid">
              
              {/* Instagram Section */}
              <div className="contact-section">
                <header className="contact-section-title" aria-label="section heading">Official Instagram Page</header>
                <div className="contact-section-content">
                  <p><strong>Handle:</strong> @yogeshwari_live</p>
                  <p><strong>Status:</strong> Active 24/7</p>
                  <p><strong>Best for:</strong> Updates, behind-the-scenes intel, and mission briefings</p>
                  <p>
                    <a 
                      href="https://instagram.com/yogeshwari_live" 
                      className="contact-link" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      → Access Channel
                    </a>
                  </p>
                </div>
              </div>

              {/* Direct Support Section */}
              <div className="contact-section">
                <header className="contact-section-title" aria-label="section heading">Direct Support Coordination</header>
                <div className="contact-section-content">
                  <p><strong>Contact:</strong> +94 77X XXX XXX</p>
                  <p><strong>Hours:</strong> 0900-2100 (Sri Lanka Time)</p>
                  <p><strong>Protocol:</strong> SMS/WhatsApp preferred</p>
                  <p><strong>Use for:</strong> Critical support, technical issues, emergency coordination</p>
                </div>
              </div>

              {/* Digital Operations Section */}
              <div className="contact-section">
                <header className="contact-section-title" aria-label="section heading">Digital Operations</header>
                <div className="contact-section-content">
                  <p><strong>Email:</strong> support@yogeshwari.one</p>
                  <p><strong>Response Time:</strong> 24-48 hours</p>
                  <p><strong>Best for:</strong> Detailed inquiries, documentation requests, technical reports</p>
                  <p>
                    <a 
                      href="mailto:support@yogeshwari.one" 
                      className="contact-link"
                    >
                      → Send Message
                    </a>
                  </p>
                </div>
              </div>

              {/* Mission Coordination Section */}
              <div className="contact-section">
                <header className="contact-section-title" aria-label="section heading">Mission Coordination</header>
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
              <div className="contact-image-container">
                <img 
                  src="/images/contact-support.jpg" 
                  alt="Support Operations"
                  loading="lazy"
                />
              </div>
            </aside>
            
          </div>
        </section>
      </main>
      
      {/* Global scrolling footer message */}
      <GlobalFooter text="**** AGENT SUPPORT ACTIVE **** COMMUNICATION CHANNELS OPERATIONAL **** HQ STANDING BY **** " />
      
    </>
  );
};

export default Contact;