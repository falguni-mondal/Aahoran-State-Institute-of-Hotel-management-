import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const facilitiesData = [
  {
    id: "01",
    title: "Sprawling Campus",
    img: "/campus-facility.webp",
    gridClass: "col-span-1 md:col-span-2 lg:col-span-8",
  },
  {
    id: "02",
    title: "Events at SIHM",
    img: "/events-facility.webp",
    gridClass: "col-span-1 md:col-span-1 lg:col-span-4",
  },
  {
    id: "03",
    title: "Infrastructure",
    img: "/infrastructure-facility.webp",
    gridClass: "col-span-1 md:col-span-1 lg:col-span-4",
  },
  {
    id: "04",
    title: "Campus Facilities",
    img: "/sports-facility.webp",
    gridClass: "col-span-1 md:col-span-1 lg:col-span-4",
  },
  {
    id: "05",
    title: "Regular Seminars & Exchange",
    img: "/seminar-facility.webp",
    gridClass: "col-span-1 md:col-span-2 lg:col-span-4",
  },
];

/* =========================================
   INDIVIDUAL FACILITY CARD
========================================= */
const FacilityCard = ({ facility, index, activeIndex, setActiveIndex, setHoveredCard }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  
  const isActive = activeIndex === index;
  const isAnyActive = activeIndex !== null;
  const isDimmed = isAnyActive && !isActive;

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // Subtle parallax effect on the image
    gsap.to(imageRef.current, {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    // Mobile/Tablet Scroll-Triggered Active State
    mm.add("(max-width: 1023px)", () => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
        onLeave: () => setActiveIndex(null),
        onLeaveBack: () => setActiveIndex(null),
      });
    });

    return () => mm.revert();
  }, { scope: cardRef });

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setActiveIndex(index);
      setHoveredCard(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setActiveIndex(null);
      setHoveredCard(false);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative w-full h-[45vh] md:h-[50vh] lg:h-[45vh] xl:h-[50vh] bg-[var(--background)] overflow-hidden cursor-pointer ${facility.gridClass}`}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* 
            1. The Base Image 
            Default: 60% Grayscale (Matte)
            Active: 0% Grayscale (Full Color)
            Dimmed: 100% Grayscale + Blur + Opacity Drop
        */}
        <img
          ref={imageRef}
          src={facility.img}
          alt={facility.title}
          className={`absolute -top-[10%] left-0 w-full h-[120%] object-cover transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu origin-center
            ${isActive 
              ? "scale-105 blur-none grayscale-0 opacity-100" 
              : isDimmed 
                ? "scale-100 blur-[2px] grayscale-[50%] opacity-60" 
                : "scale-100 blur-none grayscale-[50%] opacity-100"
            }
          `}
        />
        
        {/* 
            2. The Editorial Lens Filter
            A sheer navy overlay that unifies the grid color palette. 
            Dissolves completely on hover to reward the interaction with true color.
        */}
        <div 
          className={`absolute inset-0 bg-[var(--primary-base)]/15 transition-opacity duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isActive ? "opacity-0" : "opacity-100"}
          `}
        ></div>
      </div>

      {/* Sleek Dark Gradient Overlay (Fades out when dimmed to clean up the UI) */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-[700ms] ease-out pointer-events-none
          ${isDimmed ? "opacity-0" : "opacity-100"}
        `}
      ></div>

      {/* Top-Left Index */}
      <div 
        className={`absolute top-6 left-6 z-20 flex items-center gap-4 pointer-events-none transition-all duration-[700ms] transform-gpu
          ${isDimmed ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}
        `}
      >
        <span className="font-sans font-semibold text-[10px] xl:text-xs tracking-[0.2em] text-white/90">
          {facility.id}
        </span>
        <div className={`h-[1px] bg-white transition-all duration-700 ${isActive ? "w-12 opacity-100" : "w-8 opacity-50"}`}></div>
      </div>

      {/* Bottom Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex items-end justify-between z-20 pointer-events-none overflow-hidden">
        
        <h3 
          className={`head-txt text-2xl md:text-3xl xl:text-[2rem] text-white leading-tight tracking-tight transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu max-w-[75%]
            ${isDimmed ? "translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"}
          `}
        >
          {facility.title}
        </h3>

        {/* Glassmorphism Arrow Button */}
        <div 
          className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu
            ${isDimmed ? "translate-y-[120%] opacity-0 bg-transparent" : isActive ? "translate-y-0 opacity-100 bg-[var(--accent)] border-[var(--accent)]" : "translate-y-0 opacity-100 bg-white/10"}
          `}
        >
          <svg 
            className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]
              ${isActive ? "-rotate-45 text-[var(--primary-base)]" : "rotate-0 text-white"}
            `} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>

      </div>
    </div>
  );
};

/* =========================================
   MAIN SECTION COMPONENT
========================================= */
export default function Facilities() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cursorRef = useRef(null);
  
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(false);

  // GSAP quickTo for zero-latency cursor tracking
  const xTo = useRef(null);
  const yTo = useRef(null);

  useGSAP(() => {
    // Header Entrance Animation
    gsap.fromTo(
      headerRef.current.querySelectorAll('.facility-word'),
      { y: "120%", rotateZ: 2 },
      {
        y: "0%",
        rotateZ: 0,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      }
    );

    // Force exact center alignment for the GSAP cursor
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

    // Initialize ultra-fast mouse tracking 
    xTo.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3.out" });
    yTo.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3.out" });

  }, { scope: sectionRef });

  const handleMouseMoveGlobal = (e) => {
    if (window.innerWidth >= 1024 && xTo.current && yTo.current) {
      xTo.current(e.clientX);
      yTo.current(e.clientY);
    }
  };

  return (
    <section 
      ref={sectionRef} 
      onMouseMove={handleMouseMoveGlobal}
      className="w-full bg-[var(--background)] pt-24 md:pt-32 xl:pt-40 2xl:pt-48 pb-12 relative z-10"
    >
      {/* 
        =========================================
        THE FROSTED GLASS MAGNETIC CURSOR
        =========================================
      */}
      <div 
        ref={cursorRef}
        className={`hidden lg:flex fixed top-0 left-0 w-24 h-24 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-[var(--primary-base)] select-none items-center justify-center z-[99999] pointer-events-none origin-center shadow-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu
          ${hoveredCard ? "opacity-100 scale-100" : "opacity-0 scale-50"}
        `}
      >
        <span className="font-sans font-bold text-[10px] xl:text-[11px] uppercase tracking-[0.2em] leading-none text-center">
          Explore
        </span>
      </div>

      {/* Section Header */}
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mb-12 md:mb-16 lg:mb-20">
        <div ref={headerRef} className="flex flex-col items-start w-full">
          <div className="w-12 h-1 bg-[var(--accent)] mb-6"></div>
          <span className="font-sans font-bold text-xs xl:text-sm 2xl:text-base uppercase tracking-[0.2em] text-[var(--primary-base)]/60 mb-4 block">
            Infrastructure & Environment
          </span>
          <h2 className="head-txt text-5xl md:text-6xl lg:text-[5rem] xl:text-[6rem] 2xl:text-[7rem] text-[var(--primary-base)] leading-[1.05] tracking-tight max-w-3xl">
            <div className="overflow-hidden pb-2">
              <span className="facility-word block origin-bottom-left will-change-transform">Experience our</span>
            </div>
            <div className="overflow-hidden pb-4">
              <span className="facility-word block origin-bottom-left will-change-transform italic font-light text-[var(--accent)]">Facilities.</span>
            </div>
          </h2>
        </div>
      </div>

      {/* THE MODERN BENTO GRID */}
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pb-4 lg:pb-6 2xl:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 xl:gap-6 w-full">
          {facilitiesData.map((facility, index) => (
            <FacilityCard 
              key={facility.id} 
              facility={facility} 
              index={index} 
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              setHoveredCard={setHoveredCard}
            />
          ))}
        </div>
      </div>
      
    </section>
  );
}