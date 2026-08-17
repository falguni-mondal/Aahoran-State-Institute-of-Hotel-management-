import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useLenis } from 'lenis/react'; // Adjust import based on your Lenis package

export default function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType();
  const lenis = useLenis();

  // 1. Tell the browser's native engine to step back so it doesn't fight Lenis
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // 2. Memorize the exact scroll coordinate as the user moves down the page
  useEffect(() => {
    if (!lenis) return;

    // We tie the scroll position to the unique React Router history key
    const saveScrollPosition = (e) => {
      sessionStorage.setItem(`scroll-pos-${location.key}`, e.scroll);
    };

    lenis.on('scroll', saveScrollPosition);
    return () => lenis.off('scroll', saveScrollPosition);
  }, [lenis, location.key]);

  // 3. Execute the perfect scroll on route change
  useEffect(() => {
    if (!lenis) return;
    
    // If there is a hash (e.g., #canteen), let the specific page handle it
    if (location.hash) return; 

    if (navType === 'POP') {
      // User hit BACK. Grab the exact pixel coordinate they were at.
      const savedPosition = sessionStorage.getItem(`scroll-pos-${location.key}`);
      
      if (savedPosition !== null) {
        // We wait a tiny 100ms for React and GSAP to actually build the DOM heights, 
        // and then we instantly snap them back to their saved spot.
        setTimeout(() => {
          lenis.scrollTo(parseFloat(savedPosition), { immediate: true });
        }, 100);
      }
    } else {
      // User clicked a NEW link (PUSH). Instantly snap to the top.
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, location.key, location.hash, navType, lenis]);

  return null;
}