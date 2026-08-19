import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* =========================================
   FOOTER NAVIGATION DATA
========================================= */
const footerNav = [
  {
    title: "Academics & Departments",
    links: [
      { name: "Departments Overview", url: "#", isNew: false },
      { name: "Full Term Courses", url: "#", isNew: false },
      { name: "Short Term Courses", url: "#", isNew: false },
      { name: "Hunar Se Rozgar Tak", url: "#", isNew: false },
      { name: "Our Faculties", url: "#", isNew: false },
    ],
  },
  {
    title: "Campus & Outcomes",
    links: [
      { name: "Placement", url: "#", isNew: false },
      { name: "Campus Facilities", url: "#", isNew: false },
      { name: "Alumni Network", url: "#", isNew: false },
      { name: "Gallery & Events", url: "#", isNew: false },
      { name: "Scholarship", url: "#", isNew: false },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { name: "Notice Board", url: "#", isNew: false },
      { name: "Results", url: "#", isNew: true },
      { name: "Syllabus", url: "#", isNew: true },
      { name: "Study Material", url: "#", isNew: false },
      { name: "Contact Us", url: "#", isNew: false },
    ],
  },
];

const statutoryLinks = [
  { name: "Rules & Regulations", url: "#" },
  { name: "Anti Ragging Policy", url: "#" },
  { name: "NCHMCT", url: "#" },
  { name: "JNU", url: "#" },
];

export default function Footer() {
  const footerRef = useRef(null);
  const svgRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      
      // 1. The Cascading Waterfall Reveal for all individual items
      gsap.fromTo(
        ".footer-reveal-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. The Premium SVG Draw Animation (Watermark)
      const paths = svgRef.current.querySelectorAll(".svg-path");
      paths.forEach((path) => {
        const length = path.getTotalLength();
        
        gsap.set(path, { 
          strokeDasharray: length, 
          strokeDashoffset: length 
        });
        
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        });
      });

      // 3. Fast cascading reveal for the bottom statutory bar
      gsap.fromTo(
        ".footer-bottom-item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-bottom",
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 4. GSAP expo.inOut Easing for Pure Text Links on Hover
      const hoverLinks = gsap.utils.toArray('.gsap-hover-link');
      
      hoverLinks.forEach((link) => {
        const topText = link.querySelector('.hover-text-top');
        const bottomText = link.querySelector('.hover-text-bottom');

        const tl = gsap.timeline({ paused: true });

        if (topText && bottomText) {
          tl.to([topText, bottomText], { 
            yPercent: -100, 
            duration: 0.75, 
            ease: "expo.inOut" 
          });
        }

        link.addEventListener('mouseenter', () => tl.play());
        link.addEventListener('mouseleave', () => tl.reverse());
      });

    });

    return () => mm.revert();
  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      // THEME: Switched bg to background, text to primary-base, and border to primary-base/15
      className="w-full bg-[#f4f4f4] text-[var(--text-main)] relative z-20 overflow-hidden border-t border-[var(--primary-base)]/15 pt-20 md:pt-28 pb-8"
    >
      {/* 
          The Animated SVG Watermark
      */}
      {/* THEME: Decreased opacity slightly so it doesn't distract too much on the light background */}
      <div className="absolute top-10 right-5 md:top-16 md:right-16 opacity-5 pointer-events-none z-0">
        <svg 
          ref={svgRef} 
          className="w-48 h-48 md:w-80 md:h-80 text-[var(--text-main)]" 
          viewBox="0 0 100 100" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path className="svg-path" d="M10 70 H90" />
          <path className="svg-path" d="M20 70 V75 C20 78.3 33.4 81 50 81 C66.6 81 80 78.3 80 75 V70" />
          <path className="svg-path" d="M20 70 C20 35 33.4 25 50 25 C66.6 25 80 35 80 70" />
          <path className="svg-path" d="M50 17 A4 4 0 1 0 50 25 A4 4 0 1 0 50 17" />
          <path className="svg-path" d="M50 3 L50 11 M46 7 L54 7" />
          <path className="svg-path" d="M17 22 L23 28 M17 28 L23 22" />
          <path className="svg-path" d="M77 22 L83 28 M77 28 L83 22" />
        </svg>
      </div>

      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 mx-auto max-w-[1800px] relative z-10">
        
        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 lg:mb-28">
          
          {/* COLUMN 1: Brand & Contact */}
          {/* THEME: Border color updated */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-10 xl:pr-16 border-b md:border-b-0 border-[var(--primary-base)]/15 pb-10 md:pb-0">
            
            {/* The College Logo */}
            <div className="mb-8 flex flex-col footer-reveal-item">
              {/* THEME: Switched to the dark logo for the light background */}
              <img 
                src="/logo.svg" 
                alt="SIHM Durgapur Logo" 
                className="w-auto h-24 md:h-28 object-contain"
              />
            </div>

            {/* Address */}
            {/* THEME: Text color updated */}
            <p className="text-sm md:text-base text-[var(--text-main)]/70 leading-relaxed mb-8 max-w-sm footer-reveal-item">
              An Autonomous Body under Department of Tourism, Govt. of West Bengal. Affiliated to NCHMCT.
            </p>

            {/* Contact Details */}
            <div className="flex flex-col gap-3 w-full">
              <a href="mailto:contact@sihmdurgapur.org" className="gsap-hover-link group flex items-center gap-3 w-fit footer-reveal-item">
                {/* THEME: Border and text colors updated */}
                <div className="w-8 h-8 rounded-full border border-[var(--primary-base)]/20 flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-colors duration-300">
                  <svg className="w-3.5 h-3.5 text-[var(--text-main)]/70 group-hover:text-[var(--background)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="relative overflow-hidden flex flex-col h-[1.3em]">
                  <span className="hover-text-top text-[var(--text-main)]/80 text-sm tracking-wide h-full flex items-center">
                    contact@sihmdurgapur.org
                  </span>
                  <span className="hover-text-bottom text-[var(--accent)] text-sm tracking-wide h-full flex items-center">
                    contact@sihmdurgapur.org
                  </span>
                </div>
              </a>
              
              <a href="tel:+911234567890" className="gsap-hover-link group flex items-center gap-3 w-fit mt-1 footer-reveal-item">
                {/* THEME: Border and text colors updated */}
                <div className="w-8 h-8 rounded-full border border-[var(--primary-base)]/20 flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-colors duration-300">
                  <svg className="w-3.5 h-3.5 text-[var(--text-main)]/70 group-hover:text-[var(--background)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="relative overflow-hidden flex flex-col h-[1.3em]">
                  <span className="hover-text-top text-[var(--text-main)]/80 text-sm tracking-wide h-full flex items-center">
                    +91 (0) 1234 567 890
                  </span>
                  <span className="hover-text-bottom text-[var(--accent)] text-sm tracking-wide h-full flex items-center">
                    +91 (0) 1234 567 890
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* COLUMNS 2, 3, 4: Navigation Links */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">
            {footerNav.map((col, idx) => (
              <div key={idx} className="flex flex-col">
                {/* THEME: Text color updated */}
                <span className="font-bold text-[11px] xl:text-[12px] uppercase tracking-[0.2em] text-[var(--text-main)]/40 mb-6 block footer-reveal-item">
                  {col.title}
                </span>
                <ul className="flex flex-col gap-4">
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="footer-reveal-item">
                      <a href={link.url} className="gsap-hover-link flex items-center w-fit cursor-pointer">
                        
                        <div className="relative overflow-hidden flex flex-col h-[1.4em]">
                          {/* THEME: Text color updated */}
                          <span className="hover-text-top text-sm md:text-[15px] text-[var(--text-main)]/80 font-medium h-full flex items-center">
                            {link.name}
                          </span>
                          <span className="hover-text-bottom text-sm md:text-[15px] text-[var(--accent)] font-medium h-full flex items-center">
                            {link.name}
                          </span>
                        </div>

                        {/* Dynamic NEW Badge */}
                        {link.isNew && (
                          <div className="ml-3 relative flex h-4 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-40"></span>
                            <span className="relative inline-flex rounded-sm px-1.5 py-[2px] bg-[var(--accent)] text-[var(--background)] text-[8px] font-bold uppercase tracking-wider">
                              New
                            </span>
                          </div>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* ================= BOTTOM STATUTORY BAR ================= */}
        {/* THEME: Border color updated */}
        <div className="footer-bottom flex flex-col lg:flex-row items-center justify-between pt-8 border-t border-[var(--primary-base)]/15 gap-6 lg:gap-0">
          
          {/* Statutory Links */}
          <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
            {statutoryLinks.map((link, idx) => (
              <li key={idx} className="flex items-center footer-bottom-item">
                <a href={link.url} className="gsap-hover-link flex items-center w-fit cursor-pointer">
                  <div className="relative overflow-hidden flex flex-col h-[1.2em]">
                    {/* THEME: Text color updated */}
                    <span className="hover-text-top font-medium text-[10px] xl:text-[11px] uppercase tracking-[0.1em] text-[var(--text-main)]/50 h-full flex items-center">
                      {link.name}
                    </span>
                    <span className="hover-text-bottom font-medium text-[10px] xl:text-[11px] uppercase tracking-[0.1em] text-[var(--accent)] h-full flex items-center">
                      {link.name}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {/* Copyright */}
          <div className="flex items-center shrink-0 footer-bottom-item">
            {/* THEME: Text color updated */}
            <span className="text-xs text-[var(--text-main)]/40 tracking-wide text-center lg:text-right">
              &copy; {new Date().getFullYear()} SIHM Durgapur. All Rights Reserved.
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}