import React, {FC} from "react";
import "./About.css";

const About: FC = () => {
    return (
        <React.Fragment>
            <div className="w-full h-auto p-5 gap-4 fixed flex flex-col flex items-center justify-center ">
                <div
                    className="w-full min-[375px]:overflow-y-auto gap-4 min-[375px]:h-[70vh] min-[414px]:h-[60vh] lg:h-full sticky p-[10px] ">
                    <div className="about-view">
                        {/*<Logo variant="small"/>*/}

                        {/*<h1 className="about-title">ABOUT YOGESHWARI</h1>*/}

                        <div className="content-wrapper">

                            <div className="text-block">
                                <div className="about-subheader">
                                    <h2>What is Yogeshwari?</h2>
                        </div>

                        <div className="text-box">
                            <p>Yogeshwari is not a continuation. It’s a divergence.</p>
                            <p>
                                This isn’t just a concert. It’s a story encoded into signal, sound, and visual —
                                unfolding through a short film, a locked database, and a trail few will complete.
                            </p>
                            <p>
                                The experience leads to a standing concert set in a forgotten shipyard.
                            </p>
                            <p>
                                Two zones will divide. But a deeper force will connect them.
                            </p>
                            <p>
                                What you’re seeing here is only part of the design, built by those who operate behind
                                the
                                signals. Engineers. Storytellers. Architects of the unseen.
                            </p>
                            <p>This platform is the entry point.</p>
                            <p>Everything else depends on what you choose to uncover.</p>
                            <p>The mission has begun.</p>
                            <p>Welcome to Yogeshwari!</p>
                        </div>


                    </div>


                    <div className="image-wrapper">
                        <img src="images/black_white_girl.png" alt="Yogeshwari Portrait"/>
                    </div>

                            {/* Footer with scrolling text - FIXED structure */}
                            {/* <div className="about-footer-scrolling">
                    <div className="about-scroll-wrapper">
                        <span className="about-scroll-content">
                            {"**** sample text ****"}
                        </span>
                    </div>
                </div> */}

                        </div>
                    </div>
                </div>

            </div>
        </React.Fragment>
    );
};

export default About;
