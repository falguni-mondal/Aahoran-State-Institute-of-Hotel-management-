import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import NoticeCarousel from './NoticeCarousel';

// Register the GSAP React hook
gsap.registerPlugin(useGSAP);

export default function Hero() {
  const heroRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Authority Badge Fade
    tl.fromTo(
      '.hero-badge',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    // 2. The Premium Text & Video Reveal (Masked Stagger)
    tl.fromTo(
      '.hero-title-line',
      { y: '110%' },
      { y: '0%', duration: 1, stagger: 0.15, ease: 'power4.out' },
      '-=0.5' 
    );

    // 3. Subtitle & Buttons Fade
    tl.fromTo(
      '.hero-fade-up',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
      '-=0.6'
    );

  }, { scope: heroRef });

  return (
    <section 
      ref={heroRef} 
      className="relative w-full h-screen bg-[var(--primary-base)] text-[var(--text-light)] flex flex-col justify-center overflow-hidden"
    >
      {/* Background Video */}
      <video 
        className="absolute inset-0 w-full h-full object-cover z-0 grayscale opacity-80" 
        autoPlay 
        loop 
        muted 
        playsInline 
        src="/hero.mp4"
      ></video>

      {/* Darkening Overlay */}
      <div className="absolute inset-0 bg-[var(--primary-base)]/80 z-0"></div>

      {/* Radial Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--primary-light),_transparent_60%)] opacity-70 mix-blend-screen z-0"></div>

      {/* Main Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-start mt-12">
        
        {/* Authority Badge */}
        {/* <div className="hero-badge flex items-center space-x-3 mb-8 bg-[var(--primary-light)] border border-[var(--text-light)]/20 px-5 py-2 rounded-sm">
          <span className="micro-text text-[var(--text-light)]">Autonomous Institution</span>
        </div> */}

        {/* The Institution Name */}
        <h1 className="head-txt text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6 uppercase tracking-tight">
          
          {/* First Line: Text + Inline Video Pill */}
          <div className="overflow-hidden pb-2 flex items-center gap-4 md:gap-6">
            <span className="hero-title-line block text-[var(--text-light)]">State Institute of</span>
            
            {/* Small rounded-md element playing the same video */}
            <div className="hero-title-line relative overflow-hidden rounded-md w-20 h-10 md:w-32 md:h-16 lg:w-40 lg:h-20 shadow-xl border border-[var(--text-light)]/20">
              <video 
                className="w-full h-full object-cover grayscale opacity-90" 
                autoPlay 
                loop 
                muted 
                playsInline 
                src="/hero.mp4"
              ></video>
            </div>
          </div>
          
          {/* Second Line */}
          <div className="overflow-hidden pb-2">
            <span className="hero-title-line block text-[var(--text-light)]">Hotel Management</span>
          </div>
        </h1>

        {/* Subtitle */}
        <p className="hero-fade-up max-w-5xl text-lg md:text-xl text-[var(--text-light)]/80 font-sans font-light leading-relaxed mb-10">
          (A Society under Tourism Department, Government of West Bengal, Registration No. S/1L/60653 dated: 20-10-2011)
Fuljhore, Durgapur-713206, District: Paschim Bardhaman
        </p>

        {/* Action Buttons */}
        <div className="hero-fade-up flex flex-wrap items-center gap-4">
          <button className="bg-[var(--text-light)] text-[var(--primary-base)] px-8 py-4 font-sans font-bold text-sm uppercase tracking-widest hover:bg-[var(--primary-light)] hover:text-[var(--text-light)] transition-all duration-300 shadow-lg cursor-pointer">
            Admissions 2026-27
          </button>
          <button className="border border-[var(--text-light)]/30 px-8 py-4 font-sans font-bold text-sm uppercase tracking-widest text-[var(--text-light)] hover:bg-[var(--text-light)]/10 transition-colors duration-300 flex items-center gap-2 cursor-pointer">
            View Prospectus
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Modular Notice Carousel */}
      <NoticeCarousel />
      
    </section>
  );
}