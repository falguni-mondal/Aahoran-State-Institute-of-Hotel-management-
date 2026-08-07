import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function LabOutro() {
  const outroRef = useRef(null);
  const magneticAreaRef = useRef(null);
  const magneticElementRef = useRef(null);

  // Magnetic Hover Logic
  const handleMouseMove = (e) => {
    if (!magneticAreaRef.current || !magneticElementRef.current) return;
    
    const { left, top, width, height } = magneticAreaRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const x = (e.clientX - centerX) * 0.4;
    const y = (e.clientY - centerY) * 0.4;

    gsap.to(magneticElementRef.current, { x, y, duration: 0.6, ease: 'power3.out' });
  };

  const handleMouseLeave = () => {
    if (!magneticElementRef.current) return;
    gsap.to(magneticElementRef.current, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <section ref={outroRef} className="relative w-full py-32 md:py-48 lg:py-64 bg-[var(--primary-base)] flex flex-col items-center justify-center overflow-hidden z-10">
      
      <div className="relative z-10 flex flex-col items-center text-center px-5 max-w-5xl">
        <h2 className="head-txt text-5xl md:text-6xl lg:text-8xl leading-[0.95] tracking-tighter text-[var(--text-light)] mb-16">
          Equipped for the Future of Hospitality.
        </h2>

        {/* Magnetic CTA Button */}
        <div 
          ref={magneticAreaRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center cursor-pointer rounded-full"
        >
          <Link 
            to="/about" 
            ref={magneticElementRef}
            className="group relative flex flex-col items-center justify-center w-36 h-36 md:w-44 md:h-44 rounded-full border border-[var(--text-light)]/20 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[var(--accent)] bg-[var(--background)]/5 hover:bg-[var(--background)]/10 backdrop-blur-md will-change-transform"
          >
            <span className="text-center text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-light)] mb-3 transition-colors duration-500 group-hover:text-[var(--accent)] leading-relaxed">
              Discover <br/> Campus
            </span>
            
            <div className="relative overflow-hidden w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--text-light)] transition-transform duration-500 group-hover:translate-x-full group-hover:text-[var(--accent)] absolute">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[var(--accent)] -translate-x-full transition-transform duration-500 group-hover:translate-x-0 absolute">
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