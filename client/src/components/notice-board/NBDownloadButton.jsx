import React, { useRef } from 'react';
import gsap from 'gsap';

export default function NBDownloadButton() {
  const buttonRef = useRef(null);
  const flairRef = useRef(null); 
  const textRef = useRef(null);
  const iconRef = useRef(null);

  // Handle precise coordinate tracking on mouse enter
  const handleMouseEnter = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    
    // Calculate mouse position, fallback to center if event drops coordinates on scroll
    const clientX = e.clientX ?? (rect.left + rect.width / 2);
    const clientY = e.clientY ?? (rect.top + rect.height / 2);
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 1. Instantly snap the hidden circle's center to the mouse position
    gsap.set(flairRef.current, { left: x, top: y, scale: 0, xPercent: -50, yPercent: -50 });
    
    // 2. Expand the circle massively to cover the button (overwrite kills conflicting animations)
    gsap.to(flairRef.current, { scale: 3, duration: 0.5, ease: "power3.out", overwrite: true });
    
    // 3. Simultaneously invert the text and icon colors to ensure visibility
    gsap.to([textRef.current, iconRef.current], { color: "var(--background)", duration: 0.2, overwrite: true });
  };

  // Handle precise coordinate tracking on mouse leave
  const handleMouseLeave = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    
    // Calculate exit position, fallback to center if event drops coordinates on scroll
    const clientX = e.clientX ?? (rect.left + rect.width / 2);
    const clientY = e.clientY ?? (rect.top + rect.height / 2);
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 1. Shrink the circle back to zero, while moving it towards the exit coordinate
    gsap.to(flairRef.current, { 
      left: x, 
      top: y, 
      scale: 0, 
      duration: 0.5, 
      ease: "power3.out",
      overwrite: true 
    });

    // 2. Revert the text and icon colors back to normal
    gsap.to([textRef.current, iconRef.current], { color: "var(--accent)", duration: 0.3, overwrite: true });
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden flex items-center justify-center gap-2 border border-[var(--accent)]/20 px-5 py-3 md:px-6 md:py-3.5 rounded-full outline-none transition-colors duration-300 w-full md:w-auto shrink-0 cursor-pointer"
    >
      {/* 
          DIRECTIONAL FLAIR FILL 
          (Absolute, huge dimensions, pointer-events-none so it doesn't interrupt hovering)
      */}
      <span
        ref={flairRef}
        className="pointer-events-none absolute w-[200px] h-[200px] bg-[var(--accent)] rounded-full z-0"
        style={{ transform: 'scale(0)' }}
      ></span>

      {/* Button Icon */}
      <svg 
        ref={iconRef}
        className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--accent)] relative z-10" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      
      {/* Button Text */}
      <span 
        ref={textRef}
        className="font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--accent)] relative z-10"
      >
        Download
      </span>
    </button>
  );
}