import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navmenu from './Navmenu';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   NAVIGATION DATA (With Nested Sub-Links)
========================================= */
const navLinks = [
  { 
    name: 'About SIHM', 
    hasDropdown: true,
    subLinks: [
      { name: 'Our Profile', url: '#' },
      { name: 'Faculties', url: '#' },
      { name: 'Institute Rules & Regulations', url: '#' },
      { name: 'Computer Lab', url: '#' },
      { name: 'NCHMCT', url: '#' },
      { name: 'JNU', url: '#' },
      { name: 'THIMS', url: '#' },
    ]
  },
  { 
    name: 'Department', 
    hasDropdown: true,
    subLinks: [
      { name: 'Food and Beverage', url: '#' },
      { name: 'Food Production', url: '#' },
      { name: 'Front Office', url: '#' },
      { name: 'House Keeping', url: '#' },
    ]
  },
  { 
    name: 'Academic', 
    hasDropdown: true,
    subLinks: [
      { name: 'Short Term Courses', url: '#' },
      { name: 'Full Term Courses', url: '#' },
      { name: 'Hunar Se Rozgar Tak', url: '#' },
      { name: 'Syllabus', url: '#', badge: 'NEW' },
      { 
        name: 'Study Material', 
        url: '#', 
        hasDropdown: true,
        subLinks: [
          { name: 'SEM II', url: '#' },
          { name: 'SEM IV', url: '#' }
        ]
      },
    ]
  },
  { 
    name: 'Students', 
    hasDropdown: true,
    subLinks: [
      { name: 'Campus facilities', url: '#' },
      { name: 'Placement', url: '#' },
      { name: 'Anti Ragging', url: '#' },
      { name: 'Alumni', url: '#' },
      { 
        name: 'Scholarship', 
        url: '#', 
        hasDropdown: true,
        subLinks: [
          { name: 'NSP', url: '#' },
          { name: 'OASIS', url: '#' },
          { name: 'AIKYASHREE', url: '#' },
          { name: 'WBSCC', url: '#' },
          { name: 'MNSSBY', url: '#' },
        ]
      },
    ]
  },
  { name: 'Notice Board', hasDropdown: false },
  { name: 'Results', hasDropdown: false, badge: 'NEW' },
  { 
    name: 'Gallery', 
    hasDropdown: true,
    subLinks: [
      { name: 'Our Campus', url: '#' },
      { name: 'Inaugural Programme', url: '#' },
      { name: 'Freshers Welcome', url: '#' },
      { name: 'Programme and Events', url: '#' },
    ]
  },
  { name: 'Contact', hasDropdown: false },
];

export default function Navbar() {
  const navContainerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle the frosted glass background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance Animations (Restricted to Desktop Only)
  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
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
    });

    return () => mm.revert();
  }, { scope: navContainerRef });

  return (
    <div className="w-full relative z-50">
      <nav
        ref={navContainerRef}
        className={`relative w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex items-center justify-between transition-all duration-500 ${
          isScrolled || isMobileMenuOpen ? 'py-3' : 'py-4 md:py-5 lg:py-6 xl:py-8 2xl:py-10'
        }`}
      >
        {/* Dynamic Frosted Background Panel */}
        <div 
          className={`absolute inset-0 -z-10 transition-all duration-500 ${
            isScrolled || isMobileMenuOpen
              ? 'bg-[var(--primary-base)]/95 backdrop-blur-md border-b border-[var(--text-light)]/10 shadow-2xl' 
              : 'bg-transparent border-transparent'
          }`}
        ></div>

        {/* 1. Logo Section */}
        <div className="nav-logo flex flex-col cursor-pointer group shrink-0 relative z-50">
          <img 
            className='w-[90px] md:w-[100px] lg:w-[115px] xl:w-[130px] 2xl:w-[150px] transition-all duration-500' 
            src="/logo_white.svg" 
            alt="SIHM Logo" 
          />
        </div>

        {/* 2. Desktop Navigation & CTAs */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 2xl:space-x-10 h-full">
          
          {/* Main Links */}
          <ul className="flex items-center space-x-6 xl:space-x-8 2xl:space-x-10 h-full" id='main-nav'>
            {navLinks.map((link, index) => (
              <li key={index} className="nav-link-item relative group cursor-pointer flex items-center h-full py-2">
                
                <div className="flex items-center">
                  <span className="font-sans text-[9px] lg:text-[10px] xl:text-[11px] 2xl:text-[12px] uppercase tracking-[0.1em] font-semibold text-[var(--text-light)]/80 group-hover:text-[var(--text-light)]/100 transition-colors duration-300">
                    {link.name}
                  </span>
                  
                  {link.hasDropdown && (
                    <svg 
                      className="w-2.5 h-2.5 xl:w-3 xl:h-3 ml-1.5 text-[var(--text-light)]/50 group-hover:text-[var(--text-light)]/90 transition-all duration-300 group-hover:rotate-180" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}

                  {link.badge && (
                    <span className="absolute -top-1.5 xl:-top-2 -right-5 xl:-right-6 bg-[var(--text-light)] text-[var(--primary-base)] text-[7px] xl:text-[8px] font-bold px-1 xl:px-1.5 py-0.5 rounded-sm">
                      {link.badge}
                    </span>
                  )}

                  <span className="absolute -bottom-0 left-0 w-0 h-[1px] bg-[var(--text-light)] transition-all duration-300 group-hover:w-full"></span>
                </div>

                {/* 
                  First Level Minimalist Floating Dropdown 
                */}
                {link.hasDropdown && (
                  <div className="absolute top-[100%] left-0 pt-6 opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] z-50 w-max hidden lg:block">
                    <div className="bg-[var(--primary-base)]/95 backdrop-blur-md border border-[var(--text-light)]/10 shadow-2xl rounded-sm p-3 xl:p-4 flex flex-col gap-1.5 min-w-[220px]">
                      {link.subLinks.map((sub, subIdx) => (
                        <div key={subIdx} className="group/nested relative">
                          <a href={sub.url} className="flex items-center justify-between w-full cursor-pointer px-3 py-2 rounded-sm hover:bg-[var(--text-light)]/5 transition-colors duration-300">
                            <span className="font-sans text-[12px] xl:text-[13px] font-medium text-[var(--text-light)]/80 group-hover/nested:text-[var(--accent)] transition-colors duration-300">
                              {sub.name}
                            </span>
                            
                            <div className="flex items-center">
                              {sub.badge && (
                                <span className="ml-3 bg-[var(--accent)] text-[var(--primary-base)] text-[8px] font-bold uppercase tracking-wider px-1.5 py-[1px] rounded-sm">
                                  {sub.badge}
                                </span>
                              )}
                              
                              {sub.hasDropdown && (
                                <svg className="w-3 h-3 ml-3 text-[var(--text-light)]/30 group-hover/nested:text-[var(--accent)] transition-all duration-300 -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              )}
                            </div>
                          </a>

                          {/* 
                            Second Level Nested Floating Dropdown 
                          */}
                          {sub.hasDropdown && (
                            <div className="absolute top-0 left-[100%] pl-2 opacity-0 -translate-x-2 pointer-events-none group-hover/nested:opacity-100 group-hover/nested:translate-x-0 group-hover/nested:pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] z-50 w-max">
                              <div className="bg-[var(--primary-base)]/95 backdrop-blur-md border border-[var(--text-light)]/10 shadow-2xl rounded-sm p-3 xl:p-4 flex flex-col gap-1.5 min-w-[180px]">
                                {sub.subLinks.map((nestedSub, nestedIdx) => (
                                  <a key={nestedIdx} href={nestedSub.url} className="group/deep flex items-center justify-between w-full cursor-pointer px-3 py-2 rounded-sm hover:bg-[var(--text-light)]/5 transition-colors duration-300">
                                    <span className="font-sans text-[12px] xl:text-[13px] font-medium text-[var(--text-light)]/80 group-hover/deep:text-[var(--accent)] transition-colors duration-300">
                                      {nestedSub.name}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Vertical Separator */}
          <div className="nav-link-item w-[1px] h-4 xl:h-5 bg-[var(--text-light)]/20"></div>

          {/* Desktop Pay Fee CTA */}
          <button className="nav-link-item group relative overflow-hidden flex items-center gap-2 border border-[var(--text-light)]/40 hover:border-[var(--text-light)] px-5 xl:px-6 py-2 xl:py-2.5 cursor-pointer outline-none transition-colors duration-500">
            <div className="absolute inset-0 w-full h-full bg-[var(--text-light)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
            <span className="relative z-10 text-[var(--text-light)] group-hover:text-[var(--primary-base)] transition-colors duration-500 font-sans text-[9px] xl:text-[10px] 2xl:text-[11px] font-bold uppercase tracking-[0.15em]">
              Pay Fee
            </span>
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
        <div className="lg:hidden flex items-center gap-4 md:gap-6 shrink-0 relative z-50">
          
          <button className="nav-link-item group relative overflow-hidden flex items-center justify-center border border-[var(--text-light)]/40 hover:border-[var(--text-light)] px-4 md:px-5 py-1.5 md:py-2 cursor-pointer outline-none transition-colors duration-500">
            <div className="absolute inset-0 w-full h-full bg-[var(--accent)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
            <span className="relative z-10 text-[var(--text-light)] group-hover:text-[var(--primary-base)] transition-colors duration-500 font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em]">
              Pay Fee
            </span>
          </button>

          {/* Mobile Menu Toggle (Morphing 2-Line Hamburger -> Cross) */}
          <div 
            className="nav-link-item relative w-6 md:w-7 h-5 flex flex-col justify-center items-center cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span 
              className={`absolute w-full h-[1.5px] bg-[var(--text-light)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'
              }`}
            ></span>
            <span 
              className={`absolute w-full h-[1.5px] bg-[var(--text-light)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'
              }`}
            ></span>
          </div>

        </div>
      </nav>

      {/* RENDER THE FULL-SCREEN MOBILE MENU */}
      <Navmenu isOpen={isMobileMenuOpen} />
    </div>
  );
}