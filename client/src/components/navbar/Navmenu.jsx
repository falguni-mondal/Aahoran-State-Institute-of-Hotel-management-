import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/* =========================================
   NAVIGATION DATA (With Nested Sub-Links)
========================================= */
const navLinks = [
  { 
    name: 'About SIHM', 
    hasDropdown: true,
    subLinks: [
      { name: 'About Us', path: '/about' },
      { name: 'Faculties', path: '#' },
      { name: 'Institute Rules & Regulations', path: '#' },
      { name: 'Computer Lab', path: '#' },
      { name: 'NCHMCT', path: '#' },
      { name: 'JNU', path: '#' },
      { name: 'THIMS', path: '#' },
    ]
  },
  { 
    name: 'Department', 
    hasDropdown: true,
    subLinks: [
      { name: 'Food and Beverage', path: '#' },
      { name: 'Food Production', path: '#' },
      { name: 'Front Office', path: '#' },
      { name: 'House Keeping', path: '#' },
    ]
  },
  { 
    name: 'Academic', 
    hasDropdown: true,
    subLinks: [
      { name: 'Short Term Courses', path: '#' },
      { name: 'Full Term Courses', path: '#' },
      { name: 'Hunar Se Rozgar Tak', path: '#' },
      { name: 'Syllabus', path: '#', badge: 'NEW' },
      { 
        name: 'Study Material', 
        path: '#', 
        hasDropdown: true,
        subLinks: [
          { name: 'SEM II', path: '#' },
          { name: 'SEM IV', path: '#' }
        ]
      },
    ]
  },
  { 
    name: 'Students', 
    hasDropdown: true,
    subLinks: [
      { name: 'Campus facilities', path: '#' },
      { name: 'Placement', path: '#' },
      { name: 'Anti Ragging', path: '#' },
      { name: 'Alumni', path: '#' },
      { 
        name: 'Scholarship', 
        path: '#', 
        hasDropdown: true,
        subLinks: [
          { name: 'NSP', path: '#' },
          { name: 'OASIS', path: '#' },
          { name: 'AIKYASHREE', path: '#' },
          { name: 'WBSCC', path: '#' },
          { name: 'MNSSBY', path: '#' },
        ]
      },
    ]
  },
  { name: 'Notice Board', hasDropdown: false, path: '#' },
  { name: 'Results', hasDropdown: false, path: '#', badge: 'NEW' },
  { 
    name: 'Gallery', 
    hasDropdown: true,
    subLinks: [
      { name: 'Our Campus', path: '#' },
      { name: 'Inaugural Programme', path: '#' },
      { name: 'Freshers Welcome', path: '#' },
      { name: 'Programme and Events', path: '#' },
    ]
  },
  { name: 'Contact', hasDropdown: false, path: '#' },
];

/* =========================================
   ACCORDION ITEM COMPONENT
   Handles the GSAP height expansion and CSS nested grids
========================================= */
const AccordionItem = ({ link, isOpen, onClick, closeMenu }) => {
  const contentRef = useRef(null);
  const accordionTl = useRef(null);
  const [activeNested, setActiveNested] = useState(null);

  useGSAP(() => {
    // Set initial state
    gsap.set(contentRef.current, { height: 0, overflow: 'hidden' });
    
    // Build the specific timeline for this accordion
    accordionTl.current = gsap.timeline({ paused: true })
      .to(contentRef.current, { 
        height: 'auto', 
        duration: 0.6, 
        ease: 'expo.inOut' 
      })
      .fromTo(contentRef.current.querySelectorAll('.mobile-sub-link'),
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        "-=0.3" // Overlap so links appear while height is expanding
      );
  }, { scope: contentRef });

  // Play or reverse based on active state
  useEffect(() => {
    if (isOpen) {
      accordionTl.current.play();
    } else {
      accordionTl.current.reverse();
      // Reset nested accordion when main closes
      setTimeout(() => setActiveNested(null), 600);
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col border-b border-[var(--text-light)]/10">
      {/* Accordion Header / Trigger */}
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 md:py-6 outline-none text-left group"
      >
        <span className="head-txt text-3xl md:text-4xl lg:text-5xl tracking-tight text-[var(--text-light)] group-hover:text-[var(--accent)] transition-colors duration-300">
          {link.name}
        </span>
        
        {/* Animated +/- Icon */}
        <div className="relative w-4 h-4 md:w-5 md:h-5 flex items-center justify-center shrink-0 ml-4">
          <span className="absolute w-full h-[2px] bg-[var(--text-light)] group-hover:bg-[var(--accent)] transition-all duration-500 rounded-full"></span>
          <span className={`absolute w-full h-[2px] bg-[var(--text-light)] group-hover:bg-[var(--accent)] transition-all duration-500 rounded-full ${isOpen ? 'rotate-0' : 'rotate-90'}`}></span>
        </div>
      </button>

      {/* Accordion Content (Sub-links & Nested Accordions) */}
      <div ref={contentRef} className="will-change-transform">
        <ul className="flex flex-col gap-2 pb-6 pt-2 pl-4 border-l border-[var(--text-light)]/20 ml-2">
          {link.subLinks.map((sub, idx) => (
            <li key={idx} className="mobile-sub-link flex flex-col">
              
              {sub.hasDropdown ? (
                /* Nested Accordion for 3rd Level Links */
                <>
                  <button 
                    onClick={() => setActiveNested(activeNested === idx ? null : idx)}
                    className="flex items-center justify-between w-full group/nested py-2 outline-none text-left"
                  >
                    <span className="font-sans text-sm md:text-base font-medium text-[var(--text-light)]/80 group-hover/nested:text-[var(--accent)] transition-colors duration-300">
                      {sub.name}
                    </span>
                    <svg className={`w-3.5 h-3.5 text-[var(--text-light)]/40 group-hover/nested:text-[var(--accent)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeNested === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* CSS Grid ensures flawless, native-feeling expansion on mobile without GSAP height conflicts */}
                  <div className={`grid transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeNested === idx ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <ul className="flex flex-col gap-3 pl-4 border-l border-[var(--text-light)]/10 ml-1.5 mt-2">
                        {sub.subLinks.map((nestedSub, nIdx) => (
                          <li key={nIdx}>
                            <Link to={nestedSub.path} onClick={closeMenu} className="font-sans text-[13px] md:text-sm text-[var(--text-light)]/60 hover:text-[var(--accent)] transition-colors block py-1">
                              {nestedSub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                /* Standard Sub-link */
                <Link to={sub.path} onClick={closeMenu} className="flex items-center w-fit group py-2 outline-none">
                  <span className="font-sans text-sm md:text-base font-medium text-[var(--text-light)]/80 group-hover:text-[var(--accent)] transition-colors duration-300">
                    {sub.name}
                  </span>
                  
                  {sub.badge && (
                    <span className="ml-3 bg-[var(--accent)] text-[var(--primary-base)] text-[8px] md:text-[9px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded-sm">
                      {sub.badge}
                    </span>
                  )}
                </Link>
              )}

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* =========================================
   MAIN NAVMENU COMPONENT
========================================= */
export default function Navmenu({ isOpen, closeMenu }) {
  const menuRef = useRef(null);
  const mainTl = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useGSAP(() => {
    // Setup the main entrance/exit timeline for the full-screen menu
    mainTl.current = gsap.timeline({ paused: true })
      .fromTo(menuRef.current,
        { yPercent: -100, borderRadius: "0 0 30% 30%" },
        { yPercent: 0, borderRadius: "0% 0% 0% 0%", duration: 0.8, ease: 'expo.inOut' }
      )
      .fromTo('.mobile-nav-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
        "-=0.4"
      );
  }, { scope: menuRef });

  // Trigger main animation based on isOpen prop
  useEffect(() => {
    if (isOpen) {
      mainTl.current.play();
    } else {
      mainTl.current.reverse();
      // Reset accordion state after menu closes completely
      setTimeout(() => setActiveIndex(null), 800); 
    }
  }, [isOpen]);

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div 
      ref={menuRef}
      className="fixed inset-0 w-full h-[100dvh] bg-[var(--primary-base)] z-40 overflow-y-auto invisible"
      style={{ visibility: isOpen ? 'visible' : 'hidden' }}
    >
      <div className="w-full px-5 md:px-8 lg:px-12 pt-28 pb-20 mx-auto max-w-[800px] flex flex-col min-h-full">
        
        <span className="font-sans font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-light)]/40 mb-8 block mobile-nav-item">
          Menu
        </span>

        <nav className="flex flex-col w-full">
          {navLinks.map((link, index) => (
            <div key={index} className="mobile-nav-item">
              {link.hasDropdown ? (
                <AccordionItem 
                  link={link} 
                  isOpen={activeIndex === index}
                  onClick={() => handleAccordionClick(index)}
                  closeMenu={closeMenu}
                />
              ) : (
                /* Top Level Links (No Dropdown) */
                <Link 
                  to={link.path}
                  onClick={closeMenu}
                  className="w-full flex items-center justify-between py-5 md:py-6 border-b border-[var(--text-light)]/10 outline-none group"
                >
                  <span className="head-txt text-3xl md:text-4xl lg:text-5xl tracking-tight text-[var(--text-light)] group-hover:text-[var(--accent)] transition-colors duration-300">
                    {link.name}
                  </span>
                  {link.badge && (
                    <span className="bg-[var(--accent)] text-[var(--primary-base)] text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Area inside Mobile Menu */}
        <div className="mt-auto pt-16 flex flex-col gap-6 mobile-nav-item">
          <div className="flex flex-col gap-2">
            <span className="font-sans font-bold text-[10px] uppercase tracking-[0.2em] text-[var(--text-light)]/40 block">
              Contact Us
            </span>
            <a href="mailto:contact@sihmdurgapur.org" className="font-sans text-sm text-[var(--text-light)]/80 hover:text-[var(--accent)] transition-colors w-fit">
              contact@sihmdurgapur.org
            </a>
            <a href="tel:+911234567890" className="font-sans text-sm text-[var(--text-light)]/80 hover:text-[var(--accent)] transition-colors w-fit">
              +91 (0) 1234 567 890
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}