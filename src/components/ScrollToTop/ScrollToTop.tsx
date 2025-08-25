import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Your app uses fixed containers with overflow, so we need to target them specifically
    const scrollContainers = [
      // Main window (fallback)
      window,
      // Your specific page containers
      '.about-page-container',
      '.contact-page-container', 
      '.purchase-page-container',
      '.purchase-page-container-direct',
      '.authorize-tickets-page-container',
      '.profile-page-container',
      '.queue-page-container',
      '.system-menu-page-container',
      '.zone-view-page-container',
      // Any container with these classes
      '[class*="-page-container"]',
      '[class*="page-container"]',
      // Tailwind overflow classes
      '.overflow-y-auto',
      '.overflow-auto',
      // AppLayout containers
      '.h-\\[85vh\\]',
      '.h-\\[100vh\\]'
    ];

    const resetScroll = () => {
      // Method 1: Reset main window scroll
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });

      // Method 2: Direct DOM manipulation
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Method 3: Reset your specific containers
      scrollContainers.forEach(selector => {
        if (typeof selector === 'string') {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (element instanceof HTMLElement) {
              element.scrollTop = 0;
              element.scrollLeft = 0;
            }
          });
        }
      });

      // Method 4: Force reset on the AppLayout outlet container
      const outletContainer = document.querySelector('.flex.w-full.md\\:w-auto.flex-col.justify-center');
      if (outletContainer instanceof HTMLElement) {
        outletContainer.scrollTop = 0;
      }

      // Method 5: Reset any overflow containers
      const allScrollable = document.querySelectorAll('*');
      allScrollable.forEach(element => {
        if (element instanceof HTMLElement) {
          const style = window.getComputedStyle(element);
          if (style.overflow === 'auto' || style.overflow === 'scroll' || 
              style.overflowY === 'auto' || style.overflowY === 'scroll') {
            element.scrollTop = 0;
            element.scrollLeft = 0;
          }
        }
      });
    };

    // Use setTimeout to ensure DOM is ready after route change
    const timeoutId = setTimeout(resetScroll, 10);

    // Also try immediate reset
    resetScroll();

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;