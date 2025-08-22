import React, { FC } from "react";
import GlobalFooter from "../../components/GlobalFooter/GlobalFooter";
import "./About.css";

const About: FC = () => {
  return (
    <>
      {/* Page heading (colors/sizes come from your global tokens) */}
      <div className="about-page-heading">
        <h1>About Yogeshwari</h1>
      </div>

      {/* Main page container (sits inside AppLayout Outlet) */}
      <main className="about-page-container" role="main">
        <section className="about-content-main">
          <div className="about-content-wrapper">
            {/* Text panel */}
            <div className="about-text-section">
              <header className="about-section-header" aria-label="section heading">
                <h2>What is yogeshwari?</h2>
              </header>

              <div className="about-text-content">
                <p>Yogeshwari is not a continuation. It&apos;s a divergence.</p>

                <p>
                  This isn't just a concert. It's a story encoded into signal, sound, and visual – unfolding
                  through a short film, a locked database, and a trail few will complete.
                </p>

                <p>The experience leads to a standing concert set in a forgotten shipyard.</p>

                <p>Two zones will divide. But a deeper force will connect them.</p>

                <p>
                  What you're seeing here is only part of the design, built by those who operate behind the signals.
                  Engineers. Storytellers. Architects of the unseen.
                </p>

                <p>This platform is the entry point.</p>
                <p>Everything else depends on what you choose to uncover.</p>
                <p>The mission has begun.</p>
                <p>Welcome to Yogeshwari!</p>
              </div>
            </div>

            {/* Portrait (served from /public) */}
            <aside className="about-image-section" aria-label="Yogeshwari portrait">
              <div className="about-image-container">
                {/* If your file lives in /public/images, this relative src works with Vite */}
                <img src="/images/black_white_girl.png" alt="Yogeshwari portrait" />
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Global scrolling footer message */}
      <GlobalFooter text="**** YOGESHWARI SYSTEM ACTIVE **** DIVERGENCE PROTOCOL INITIATED **** SIGNALS DETECTED **** " />
    </>
  );
};

export default About;
