import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutTechTeaser() {
  const sectionRef = useRef(null);
  const bgContainerRef = useRef(null);
  const magneticAreaRef = useRef(null);
  const magneticElementRef = useRef(null);

  useGSAP(() => {
    // 1. Initialize SplitType for the main heading
    const heading = document.querySelector('.tech-heading');
    let splitHeading;
    
    if (heading) {
      splitHeading = new SplitType(heading, { types: 'lines', lineClass: 'split-line' });
      
      splitHeading.lines.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'block';
        
        // Anti-Clipping Fix for Serif/Capitalize Fonts
        wrapper.style.paddingTop = '0.1em';
        wrapper.style.paddingBottom = '0.1em';
        wrapper.style.marginTop = '-0.1em';
        wrapper.style.marginBottom = '-0.1em';
        
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
    }

    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)"
    }, (context) => {
      let { isDesktop } = context.conditions;

      // ==========================================
      // ENTRANCE REVEAL TIMELINE
      // ==========================================
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isDesktop ? "top 80%" : "top 90%",
          toggleActions: "play none none reverse"
        }
      });

      // Curtain reveal for the background container
      entranceTl.fromTo('.bg-reveal-mask',
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }
      );

      // Deep image scale-down effect (happens concurrently)
      entranceTl.fromTo('.bg-parallax-image',
        { scale: 1.3 },
        { scale: 1, duration: 1.6, ease: "expo.inOut" },
        "<"
      );

      // Label Fade-in
      entranceTl.fromTo('.tech-label',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.8"
      );

      // SplitText Rising Reveal
      if (splitHeading) {
        entranceTl.fromTo(splitHeading.lines,
          { yPercent: 100 },
          { yPercent: 0, duration: 1, stagger: 0.1, ease: "expo.out" },
          "-=0.6"
        );
      }

      // Magnetic CTA Button Fade-in
      entranceTl.fromTo('.magnetic-area',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out" },
        "-=0.8"
      );

      // ==========================================
      // SCRUB-DRIVEN PARALLAX EFFECTS
      // ==========================================
      
      // 1. Slow Y-axis move for the background image to create depth
      gsap.to('.bg-parallax-image', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // 2. Slow horizontal track for the massive background text
      gsap.to('.bg-massive-text', {
        xPercent: isDesktop ? -20 : -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    });

    return () => {
      mm.revert();
      if (splitHeading) splitHeading.revert();
    };
  }, { scope: sectionRef });

  // ==========================================
  // MAGNETIC HOVER LOGIC
  // ==========================================
  const handleMouseMove = (e) => {
    if (!magneticAreaRef.current || !magneticElementRef.current) return;
    
    const { left, top, width, height } = magneticAreaRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Magnetic pull strength (0.4 multiplier)
    const x = (e.clientX - centerX) * 0.4;
    const y = (e.clientY - centerY) * 0.4;

    gsap.to(magneticElementRef.current, {
      x,
      y,
      duration: 0.6,
      ease: 'power3.out'
    });
  };

  const handleMouseLeave = () => {
    if (!magneticElementRef.current) return;
    
    // Physical elastic snap-back
    gsap.to(magneticElementRef.current, {
      x: 0,
      y: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  return (
    <section ref={sectionRef} className="relative w-full h-[100svh] min-h-[600px] bg-[var(--primary-base)] overflow-hidden flex items-center justify-center">
      
      {/* =========================================
         BACKGROUND PARALLAX & MASK LAYER
      ========================================= */}
      <div className="bg-reveal-mask absolute inset-0 w-full h-full will-change-transform z-0">
        
        {/* We use an oversized container (-10% inset) to give the scrub parallax room to move without showing edges */}
        <div ref={bgContainerRef} className="absolute inset-[-10%] w-[120%] h-[120%]">
          <img 
            src="/computer-lab.webp" 
            alt="Advanced Computer Lab" 
            className="bg-parallax-image absolute inset-0 w-full h-full object-cover will-change-transform"
          />
        </div>

        {/* Cinematic Dark Overlay */}
        <div className="absolute inset-0 bg-[var(--primary-base)]/75 mix-blend-multiply backdrop-blur-[2px]"></div>
        {/* Gradient vignette to draw the eye to the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--primary-base)_120%)]"></div>
      </div>

      {/* =========================================
         MASSIVE BACKGROUND TYPOGRAPHY
      ========================================= */}
      <div className="absolute w-full flex items-center justify-center z-0 opacity-[0.03] pointer-events-none select-none overflow-visible">
        <h2 className="bg-massive-text font-sans font-bold uppercase tracking-tighter text-[15vw] leading-none text-[var(--text-light)] whitespace-nowrap will-change-transform">
          COMPUTER LAB • TECHNOLOGY • INFRASTRUCTURE • 
        </h2>
      </div>

      {/* =========================================
         FOREGROUND CONTENT
      ========================================= */}
      <div className="relative z-10 w-full px-5 md:px-12 xl:px-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <span className="tech-label text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-6 md:mb-8 block">
          Advanced Computer Lab
        </span>
        
        <h2 className="tech-heading head-txt text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-[var(--text-light)] mb-12 md:mb-16 max-w-4xl">
          Mastering the Digital Era of Hospitality.
        </h2>

        {/* =========================================
           MAGNETIC CTA BUTTON
           Uses a larger invisible hit-area to trigger the magnetic pull early
        ========================================= */}
        <div 
          ref={magneticAreaRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="magnetic-area relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center cursor-pointer rounded-full"
        >
          {/* The actual visible button that moves inside the area */}
          <Link
            to="/about/computer-lab" 
            ref={magneticElementRef}
            className="group relative flex flex-col items-center justify-center w-36 h-36 md:w-44 md:h-44 rounded-full border border-[var(--text-light)]/20 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[var(--accent)] bg-[var(--background)]/5 hover:bg-[var(--background)]/10 backdrop-blur-md will-change-transform"
          >
            <span className="text-center text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-light)] mb-3 transition-colors duration-500 group-hover:text-[var(--accent)] leading-relaxed">
              Explore <br/> Computer Lab
            </span>
            
            {/* Animated Arrow wrapper */}
            <div className="relative overflow-hidden w-6 h-6 flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 text-[var(--text-light)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full group-hover:text-[var(--accent)] absolute"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              {/* Secondary arrow sliding in */}
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 text-[var(--accent)] -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 absolute"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}