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

  // Entrance Animations (Tightened for fluid staggered entrance)
  useGSAP(() => {
    // Shared easing for synchronization with Hero
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
      className={`w-full px-5 md:px-12 flex items-center justify-between transition-all duration-500 ${
        isScrolled ? 'py-3' : 'py-6'
      }`}
    >
      {/* Dynamic Background Panel for Scrolled State */}
      <div 
        className={`absolute inset-0 -z-10 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[var(--primary-base)]/95 backdrop-blur-md border-b border-[var(--text-light)]/10 shadow-2xl' 
            : 'bg-transparent border-transparent'
        }`}
      ></div>

      {/* 1. Logo Section */}
      <div className="nav-logo flex flex-col cursor-pointer group">
        <img className='w-[100px] lg:w-[130px]' src="/logo_white.svg" alt="SIHM Logo" />
      </div>

      {/* 2. Desktop Navigation Links */}
      <ul className="hidden lg:flex items-center space-x-8">
        {navLinks.map((link, index) => (
          <li key={index} className="nav-link-item relative group cursor-pointer flex items-center">
            <span className="font-sans text-[11px] uppercase tracking-[0.1em] font-semibold text-[var(--text-light)]/80 group-hover:text-[var(--text-light)]/100 transition-colors duration-300">
              {link.name}
            </span>
            
            {link.hasDropdown && (
              <svg 
                className="w-3 h-3 ml-1.5 text-[var(--text-light)]/50 group-hover:text-[var(--text-light)]/90 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            )}

            {link.badge && (
              <span className="absolute -top-3 -right-6 bg-[var(--text-light)] text-[var(--primary-base)] text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                {link.badge}
              </span>
            )}

            <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-[var(--text-light)] transition-all duration-300 group-hover:w-full"></span>
          </li>
        ))}
      </ul>

      {/* 3. Mobile Menu Toggle */}
      <div className="nav-link-item lg:hidden flex flex-col justify-center gap-1.5 cursor-pointer p-2">
        <span className="w-6 h-[1px] bg-[var(--text-light)] block"></span>
        <span className="w-6 h-[1px] bg-[var(--text-light)] block"></span>
        <span className="w-4 h-[1px] bg-[var(--text-light)] block self-end"></span>
      </div>
    </nav>
  );
}