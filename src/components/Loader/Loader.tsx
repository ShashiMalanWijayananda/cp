import React, {FC} from "react";
import "./Loader.css";

interface LoaderProps {
    type?: 'spinner' | 'matrix' | 'cassette' | 'oscilloscope' | 'terminal' | 'floppy' | 'nixie';
    text?: string;
    showText?: boolean;
}

const Loader: FC<LoaderProps> = ({
                                     type = 'spinner',
                                     text = 'Loading',
                                     showText = true
                                 }) => {

    const renderLoader = () => {
        switch (type) {
            case 'spinner':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="retro-spinner"></div>
                        {showText && (
                            <span className="retro-text text-brand-rose mt-4 text-2xl">
                {text}
              </span>
                        )}
                    </div>
                );

            case 'matrix':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="matrix-loader">
                            <div className="matrix-bar" style={{height: '20px'}}></div>
                            <div className="matrix-bar" style={{height: '35px'}}></div>
                            <div className="matrix-bar" style={{height: '45px'}}></div>
                            <div className="matrix-bar" style={{height: '60px'}}></div>
                            <div className="matrix-bar" style={{height: '40px'}}></div>
                            <div className="matrix-bar" style={{height: '25px'}}></div>
                            <div className="matrix-bar" style={{height: '50px'}}></div>
                        </div>
                        {showText && (
                            <span className="retro-text text-brand-lime mt-4 text-xl">
                {text}
              </span>
                        )}
                    </div>
                );

            case 'cassette':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="cassette-loader">
                            <div className="cassette-reel left"></div>
                            <div className="cassette-reel right"></div>
                            <div className="cassette-tape"></div>
                        </div>
                        {showText && (
                            <span className="retro-text text-brand-amber mt-4 text-xl">
                {text}
              </span>
                        )}
                    </div>
                );

            case 'oscilloscope':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="oscilloscope-loader">
                            <div className="oscilloscope-grid"></div>
                            <div className="oscilloscope-wave"></div>
                            <div className="oscilloscope-beam"></div>
                        </div>
                        {showText && (
                            <span className="retro-text text-brand-cyan mt-4 text-xl">
                {text}
              </span>
                        )}
                    </div>
                );

            case 'terminal':
                return (
                    <div className="terminal-loader">
                        <div className="terminal-line">C:\SYSTEM&gt; INITIALIZING...</div>
                        <div className="terminal-line">LOADING MODULES...</div>
                        <div className="terminal-line terminal-prompt">
                            {text.toUpperCase()}
                        </div>
                        <div className="terminal-progress">
                            <div className="terminal-block"></div>
                            <div className="terminal-block"></div>
                            <div className="terminal-block"></div>
                            <div className="terminal-block"></div>
                            <div className="terminal-block"></div>
                            <div className="terminal-block"></div>
                            <div className="terminal-block"></div>
                            <div className="terminal-block"></div>
                        </div>
                    </div>
                );

            case 'floppy':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="floppy-loader">
                            <div className="floppy-label"></div>
                            <div className="floppy-center"></div>
                        </div>
                        {showText && (
                            <span className="retro-text text-brand-cyan mt-4 text-xl">
                {text}
              </span>
                        )}
                    </div>
                );

            case 'nixie':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="nixie-loader">
                            <div className="nixie-tube">
                                <div className="nixie-digit">8</div>
                            </div>
                            <div className="nixie-tube">
                                <div className="nixie-digit">8</div>
                            </div>
                            <div className="nixie-tube">
                                <div className="nixie-digit">8</div>
                            </div>
                            <div className="nixie-tube">
                                <div className="nixie-digit">8</div>
                            </div>
                        </div>
                        {showText && (
                            <span className="retro-text text-brand-amber mt-4 text-xl">
                {text}
              </span>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="retro-spinner"></div>
                        {showText && (
                            <span className="retro-text text-brand-rose mt-4 text-2xl">
                {text}
              </span>
                        )}
                    </div>
                );
        }
    };

    return (
        <React.Fragment>
            <div className="fixed inset-0 flex items-center justify-center z-50 retro-container bg-brand-primary">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="p-8 flex flex-col items-center justify-center">
                        {renderLoader()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Loader;
