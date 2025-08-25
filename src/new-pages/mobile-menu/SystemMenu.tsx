// SystemMenu.tsx
import React, { FC, useEffect, useMemo, useState } from 'react';
import './SystemMenu.css';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../context/login.context';
import { useAppContext } from '../../context/app.context';
import { useQueue } from '../../graphql/graphql-subscrption';
import GlobalFooter from '../../components/GlobalFooter/GlobalFooter';

const SystemMenu: FC = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useLogin();
  const [timestamp, setTimestamp] = useState<string>(
    new Date().toLocaleString()
  );
  const { appContext } = useAppContext();
  const { subscribe } = useQueue();

  const isDesktop = useMemo(
    () => () => window.matchMedia('(min-width: 1024px)').matches,
    []
  );

  // Lock the viewport on mount
  useEffect(() => {
    const prevOverflow = document.documentElement.style.overflow;
    const prevHeight = document.documentElement.style.height;
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';

    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.documentElement.style.height = prevHeight;
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  const getGreetingByTime = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const scrollingText = `**** ${getGreetingByTime()}, Agent ${
    user?.lastName ?? ''
  } **** NAVIGATE WHERE YOU WANT **** SYSTEM OPERATIONAL **** `;

  useEffect(() => {
    subscribe();
    const id = setInterval(
      () => setTimestamp(new Date().toLocaleString()),
      1000
    );
    return () => clearInterval(id);
  }, [subscribe]);

  const handleNavigation = (): void => {
    if (!isDesktop()) {
      appContext.showSuccessDialog(
        'DESKTOP REQUIRED!',
        'For the complete Yogeshwari experience, switch to desktop view.\nSome missions can only be unlocked on a larger screen.'
      );
    } else {
      navigate('/landing-page');
    }
  };

  return (
    <>
      <header className="sys-menu-header" role="banner">
        <div className="sys-menu-header-left" />
        <div className="sys-menu-header-center" />
        <div className="sys-menu-header-right">
          <time className="sys-menu-timestamp" aria-live="polite">
            {timestamp}
          </time>
          <button
            type="button"
            className="sys-menu-logout-btn"
            onClick={logoutUser}
            aria-label="Log out"
          >
            <img
              src="images/icon/exit.svg"
              className="sys-menu-logout-icon"
              alt=""
            />
          </button>
        </div>
      </header>

      <button
        type="button"
        className="sys-menu-mobile-logout"
        onClick={logoutUser}
        aria-label="Log out"
      >
        <img
          src="images/icon/exit.svg"
          className="sys-menu-mobile-logout-icon"
          alt=""
        />
      </button>

      <main className="sys-menu-page" role="main">
        <section className="sys-menu-layout" aria-label="System menu">
          <div className="sys-menu-container">
            <div className="sys-menu-grid">
              <button
                type="button"
                className="sys-menu-item"
                onClick={() => navigate('/my-profile')}
                aria-label="Profile"
              >
                <span className="sys-menu-icon">
                  <img src="images/icon/profile.svg" alt="" />
                </span>
                <span className="sys-menu-label">Profile</span>
              </button>

              <button
                type="button"
                className="sys-menu-item"
                onClick={() => navigate('/my-tickets')}
                aria-label="My Tickets"
              >
                <span className="sys-menu-icon">
                  <img src="images/icon/ticket.svg" alt="" />
                </span>
                <span className="sys-menu-label">My Tickets</span>
              </button>

              <button
                type="button"
                className="sys-menu-item"
                onClick={() => navigate('/chat')}
                aria-label="Chat"
              >
                <span className="sys-menu-icon">
                  <img src="images/icon/chat.svg" alt="" />
                </span>
                <span className="sys-menu-label">Chat</span>
              </button>

              <button
                type="button"
                className="sys-menu-item"
                onClick={() => navigate('/about')}
                aria-label="About"
              >
                <span className="sys-menu-icon">
                  <img src="images/icon/about.svg" alt="" />
                </span>
                <span className="sys-menu-label">About</span>
              </button>

              <button
                type="button"
                className="sys-menu-item"
                onClick={() => navigate('/contact')}
                aria-label="Support"
              >
                <span className="sys-menu-icon">
                  <img src="images/icon/Vector.svg" alt="" />
                </span>
                <span className="sys-menu-label">Support</span>
              </button>

              <button
                type="button"
                className="sys-menu-item"
                onClick={() => navigate('/terms')}
                aria-label="Protocol"
              >
                <span className="sys-menu-icon">
                  <img src="images/icon/terms.svg" alt="" />
                </span>
                <span className="sys-menu-label">Protocol</span>
              </button>
            </div>

            <div className="sys-menu-buttons">
              <button
                type="button"
                className="sys-menu-large-btn"
                onClick={handleNavigation}
                aria-label="Explore Yogeshwari"
              >
                <span className="sys-menu-large-icon">
                  <img src="images/icon/explore.svg" alt="" />
                </span>
                <span className="sys-menu-large-label">Explore Yogeshwari</span>
              </button>

              <button
                type="button"
                className="sys-menu-large-btn highlight"
                onClick={() => navigate('/mission')}
                aria-label="Buy Ticket"
              >
                <span className="sys-menu-large-icon">
                  <img src="images/icon/buy.svg" alt="" />
                </span>
                <span className="sys-menu-large-label">Buy Ticket</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter text={scrollingText} />
    </>
  );
};

export default SystemMenu;
