import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to reset scroll position on route changes
 * Specifically designed for your AppLayout structure
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const resetAllScrollPositions = () => {
      // Method 1: Reset main window
      if (window.scrollTo) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      
      // Method 2: Direct DOM reset
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Method 3: Reset all elements with scrollable content
      const scrollableSelectors = [
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
        // Generic page containers
        '[class*="-page-container"]',
        '[class*="page-container"]',
        // Overflow containers
        '.overflow-y-auto',
        '.overflow-auto',
        '[style*="overflow"]',
        // Your AppLayout containers
        '.h-\\[85vh\\]',
        '.h-\\[100vh\\]'
      ];

      // Reset each container type
      scrollableSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (element instanceof HTMLElement) {
              element.scrollTop = 0;
              element.scrollLeft = 0;
            }
          });
        } catch (e) {
          // Ignore selector errors
          console.debug('Scroll reset selector error:', selector, e);
        }
      });

      // Method 4: Brute force - check ALL elements for scroll
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        if (element instanceof HTMLElement) {
          const computedStyle = window.getComputedStyle(element);
          const hasVerticalScroll = 
            computedStyle.overflowY === 'auto' || 
            computedStyle.overflowY === 'scroll' ||
            computedStyle.overflow === 'auto' ||
            computedStyle.overflow === 'scroll';
          
          if (hasVerticalScroll && element.scrollHeight > element.clientHeight) {
            element.scrollTop = 0;
          }
        }
      });
    };

    // Reset immediately
    resetAllScrollPositions();
    
    // Reset after DOM updates (for dynamic content)
    requestAnimationFrame(() => {
      resetAllScrollPositions();
    });

    // Reset after a delay (for slower async content)
    const timeoutId = setTimeout(resetAllScrollPositions, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);
};

export default useScrollToTop;