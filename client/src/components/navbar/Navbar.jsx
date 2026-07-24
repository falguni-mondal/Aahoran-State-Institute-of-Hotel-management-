import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Navbar() {
  const navContainerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle the frosted glass background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance Animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.fromTo(
      '.nav-logo',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5 }
    ).fromTo(
      '.nav-link-item',
      { y: -15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.05 },
      "<0.2" // Overlaps with the logo animation immediately
    );
  }, { scope: navContainerRef });

  const navLinks = [
    { name: 'About SIHM', hasDropdown: true },
    { name: 'Department', hasDropdown: true },
    { name: 'Academic', hasDropdown: true },
    { name: 'Students', hasDropdown: true },
    { name: 'Notice Board', hasDropdown: false },
    { name: 'Results', hasDropdown: false, badge: 'NEW' },
    { name: 'Gallery', hasDropdown: true },
    { name: 'Contact', hasDropdown: false },
  ];

  return (
    <nav
      ref={navContainerRef}
      className={`relative w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex items-center justify-between transition-all duration-500 ${
        isScrolled ? 'py-3' : 'py-4 md:py-5 lg:py-6 xl:py-8 2xl:py-10'
      }`}
    >
      {/* Dynamic Frosted Background Panel */}
      <div 
        className={`absolute inset-0 -z-10 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[var(--primary-base)]/95 backdrop-blur-md border-b border-[var(--text-light)]/10 shadow-2xl' 
            : 'bg-transparent border-transparent'
        }`}
      ></div>

      {/* 1. Logo Section (Responsive widths up to 2xl) */}
      <div className="nav-logo flex flex-col cursor-pointer group shrink-0">
        <img 
          className='w-[90px] md:w-[100px] lg:w-[115px] xl:w-[130px] 2xl:w-[150px] transition-all duration-500' 
          src="/logo_white.svg" 
          alt="SIHM Logo" 
        />
      </div>

      {/* 2. Desktop Navigation & CTAs */}
      <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 2xl:space-x-10">
        
        {/* Main Links */}
        <ul className="flex items-center space-x-6 xl:space-x-8 2xl:space-x-10">
          {navLinks.map((link, index) => (
            <li key={index} className="nav-link-item relative group cursor-pointer flex items-center">
              <span className="font-sans text-[9px] lg:text-[10px] xl:text-[11px] 2xl:text-[12px] uppercase tracking-[0.1em] font-semibold text-[var(--text-light)]/80 group-hover:text-[var(--text-light)]/100 transition-colors duration-300">
                {link.name}
              </span>
              
              {link.hasDropdown && (
                <svg 
                  className="w-2.5 h-2.5 xl:w-3 xl:h-3 ml-1.5 text-[var(--text-light)]/50 group-hover:text-[var(--text-light)]/90 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}

              {/* Responsive Badge Positioning */}
              {link.badge && (
                <span className="absolute -top-2.5 xl:-top-3 -right-5 xl:-right-6 bg-[var(--text-light)] text-[var(--primary-base)] text-[7px] xl:text-[8px] font-bold px-1 xl:px-1.5 py-0.5 rounded-sm">
                  {link.badge}
                </span>
              )}

              <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-[var(--text-light)] transition-all duration-300 group-hover:w-full"></span>
            </li>
          ))}
        </ul>

        {/* Vertical Separator */}
        <div className="nav-link-item w-[1px] h-4 xl:h-5 bg-[var(--text-light)]/20"></div>

        {/* Desktop Pay Fee CTA - Sharp, Premium Liquid Fill Design */}
        <button className="nav-link-item group relative overflow-hidden flex items-center gap-2 border border-[var(--text-light)]/40 hover:border-[var(--text-light)] px-5 xl:px-6 py-2 xl:py-2.5 cursor-pointer outline-none transition-colors duration-500">
          
          {/* Background Sweep Element - Guided by a cinematic cubic-bezier curve */}
          <div className="absolute inset-0 w-full h-full bg-[var(--text-light)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
          
          {/* Text - Inverts color on hover for maximum contrast */}
          <span className="relative z-10 text-[var(--text-light)] group-hover:text-[var(--primary-base)] transition-colors duration-500 font-sans text-[9px] xl:text-[10px] 2xl:text-[11px] font-bold uppercase tracking-[0.15em]">
            Pay Fee
          </span>
          
          {/* Icon - Shifts right and inverts color */}
          <svg 
            className="relative z-10 w-3 h-3 xl:w-3.5 xl:h-3.5 text-[var(--text-light)] group-hover:text-[var(--primary-base)] group-hover:translate-x-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

      </div>

      {/* 3. Mobile Navigation Controls */}
      <div className="lg:hidden flex items-center gap-4 md:gap-6 shrink-0">
        
        {/* Mobile Pay Fee CTA - Mirrors the premium liquid fill design */}
        <button className="nav-link-item group relative overflow-hidden flex items-center justify-center border border-[var(--text-light)]/40 hover:border-[var(--text-light)] px-4 md:px-5 py-1.5 md:py-2 cursor-pointer outline-none transition-colors duration-500">
          <div className="absolute inset-0 w-full h-full bg-[var(--accent)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
          <span className="relative z-10 text-[var(--text-light)] group-hover:text-[var(--primary-base)] transition-colors duration-500 font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em]">
            Pay Fee
          </span>
        </button>

        {/* Mobile Menu Toggle (Hamburger) */}
        <div className="nav-link-item flex flex-col justify-center gap-1.5 cursor-pointer p-2">
          <span className="w-6 md:w-7 h-[1px] bg-[var(--text-light)] block transition-all"></span>
          <span className="w-6 md:w-7 h-[1px] bg-[var(--text-light)] block transition-all"></span>
          <span className="w-4 md:w-5 h-[1px] bg-[var(--text-light)] block self-end transition-all"></span>
        </div>

      </div>
    </nav>
  );
}