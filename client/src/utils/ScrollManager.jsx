import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useLenis } from 'lenis/react'; 

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

    const saveScrollPosition = (e) => {
      sessionStorage.setItem(`scroll-pos-${location.key}`, e.scroll);
    };

    lenis.on('scroll', saveScrollPosition);
    return () => lenis.off('scroll', saveScrollPosition);
  }, [lenis, location.key]);

  // 3. Execute the perfect scroll on route change
  useEffect(() => {
    if (!lenis) return;
    
    // Defer to page-level hash routing if a hash exists
    if (location.hash) return; 

    // THE FIX: If the navigation event explicitly asks to ignore scroll, stop here!
    if (location.state?.noScroll) return;

    if (navType === 'POP') {
      // User hit BACK. Restore exact pixel coordinate.
      const savedPosition = sessionStorage.getItem(`scroll-pos-${location.key}`);
      
      if (savedPosition !== null) {
        setTimeout(() => {
          lenis.scrollTo(parseFloat(savedPosition), { immediate: true });
        }, 100);
      }
    } else {
      // New page visit (PUSH). Snap to top.
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, location.key, location.hash, navType, lenis, location.state]);

  return null;
}