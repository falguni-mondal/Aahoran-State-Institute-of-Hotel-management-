import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const pillarsData = [
  {
    id: "01",
    title: "NCHMCT",
    kicker: "Ministry of Tourism, Govt. of India",
    desc: "National Council for Hotel Management & Catering Technology is an autonomous body centrally regulating academics for B.Sc. Hospitality & Hotel Administration.",
    img: "/nchmct-bg.webp",
  },
  {
    id: "02",
    title: "Our Faculty",
    kicker: "Industry-Trained Experts",
    desc: "SIHM Durgapur houses a well-groomed, highly educated team of faculties dedicated to the profession, bringing years of direct exposure and experience from 5-star luxury hotels.",
    img: "/faculty-bg.webp",
  },
  {
    id: "03",
    title: "Our Alumni",
    kicker: "A Global Professional Network",
    desc: "We expect to find SIHM’s Alumni Association a valuable resource and support tool throughout our professional life and beyond, enjoying the benefits of a global community.",
    img: "/alumni-bg.webp",
  },
];

/* =========================================
   INDIVIDUAL PILLAR CARD COMPONENT
========================================= */
const PillarCard = ({ pillar }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const textContainerRef = useRef(null);
  const btnRef = useRef(null);
  const hoverTl = useRef(null); // Stores the desktop hover timeline
  const iconRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();
    const words = textContainerRef.current.querySelectorAll('.curtain-word');
    const image = imageRef.current;
    const btn = btnRef.current;
    const icon = iconRef.current;

    // 1. Dynamically Group Words into Lines based on their physical position
    let lines = [];
    if (words.length) {
      let currentLine = [];
      let lastTop = words[0].offsetTop;

      words.forEach((word) => {
        if (word.offsetTop !== lastTop) {
          lines.push(currentLine);
          currentLine = [];
          lastTop = word.offsetTop;
        }
        currentLine.push(word);
      });
      lines.push(currentLine);
    }

    // 2. DESKTOP / LARGE SCREENS (Hover Interaction)
    mm.add("(min-width: 1024px)", () => {
      // Setup the timeline but keep it paused until hovered
      hoverTl.current = gsap.timeline({ paused: true });

      // Image fade and scale
      hoverTl.current.to(image, { opacity: 0.35, scale: 1, duration: 0.4, ease: "power3.out" }, 0);
      
      // Icon rotation
      hoverTl.current.to(icon, { rotate: 90, color: "#C5A880", duration: 0.3, ease: "expo.out" }, 0);

      // Curtain Reveal - Staggering the lines
      lines.forEach((lineChars, lineIndex) => {
        hoverTl.current.to(
          lineChars,
          { y: "0%", duration: 0.7, ease: "expo.out" },
          lineIndex * 0.08 // Stagger delay between lines
        );
      });

      // Button Entrance
      hoverTl.current.fromTo(
        btn, 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.2, ease: "expo.out" }, 
        "-=0.2"
      );
    });

    // 3. MOBILE / TABLET (Scroll Interaction)
    mm.add("(max-width: 1023px)", () => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 60%",
          end: "bottom 40%",
        }
      });

      scrollTl.to(image, { opacity: 0.25, scale: 1, duration: 0.4, ease: "power3.out" }, 0);
      scrollTl.to(icon, { rotate: 90, color: "#C5A880", duration: 0.3, ease: "expo.out" }, 0);
      
      lines.forEach((lineChars, lineIndex) => {
        scrollTl.to(
          lineChars,
          { y: "0%", duration: 0.4, ease: "expo.out" },
          lineIndex * 0.08
        );
      });

      scrollTl.fromTo(
        btn, 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.2, ease: "expo.out" }, 
        "-=0.2"
      );
    });

    return () => mm.revert();
  }, { scope: cardRef });

  // Desktop Hover Handlers
  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024 && hoverTl.current) hoverTl.current.play();
  };
  
  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024 && hoverTl.current) hoverTl.current.reverse();
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex-1 flex flex-col justify-end p-8 md:p-12 xl:p-16 border-b lg:border-b-0 lg:border-r border-[var(--text-light)]/15 overflow-hidden cursor-crosshair min-h-[60vh] lg:min-h-full group/card"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[var(--primary-base)]">
        <img 
          ref={imageRef}
          src={pillar.img} 
          alt={pillar.title}
          // Starts scaled up and highly transparent. GSAP handles the animation.
          className="w-full h-full object-cover opacity-0 lg:opacity-0 scale-110 mix-blend-luminosity will-change-transform"
        />
        {/* Protection Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-base)] via-[var(--primary-base)]/50 to-transparent opacity-90 lg:opacity-100 transition-opacity duration-700"></div>
      </div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* Top Header */}
        <div className="w-full flex justify-between items-start mb-24 lg:mb-0">
          <span className="font-sans font-light text-2xl xl:text-3xl text-[#C5A880] transition-opacity duration-500">
            {pillar.id}
          </span>
          <svg 
            ref={iconRef}
            className="w-5 h-5 text-[var(--text-light)]/30 will-change-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" />
          </svg>
        </div>

        {/* Bottom Content Area */}
        <div className="flex flex-col items-start w-full">
          
          <span className="font-sans font-bold text-[9px] md:text-[10px] xl:text-[11px] uppercase tracking-[0.2em] text-[#C5A880] mb-4 block">
            {pillar.kicker}
          </span>
          
          <h3 className="head-txt text-5xl md:text-6xl xl:text-7xl 2xl:text-[5rem] leading-none tracking-tight mb-6 lg:mb-8 text-[var(--text-light)]">
            {pillar.title}
          </h3>

          {/* Curtain Reveal Description Container */}
          <div ref={textContainerRef} className="w-full mb-8">
            {pillar.desc.split(" ").map((word, wIdx) => (
              <span key={wIdx} className="inline-flex overflow-hidden mr-[0.25em] align-top py-0.5">
                <span className="curtain-word translate-y-[100%] font-sans text-sm md:text-base xl:text-lg text-[var(--text-light)]/70 leading-relaxed will-change-transform block">
                  {word}
                </span>
              </span>
            ))}
          </div>

          {/* Ghost Button CTA */}
          <button 
            ref={btnRef}
            // Opacity 0 initially so it doesn't show before GSAP commands it to
            className="opacity-0 group/btn relative overflow-hidden flex items-center gap-3 border border-[var(--text-light)]/30 hover:border-[var(--text-light)] px-6 py-3 rounded-sm cursor-pointer outline-none transition-colors duration-500"
          >
            <div className="absolute inset-0 w-full h-full bg-[var(--text-light)] translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
            <span className="relative z-10 text-[var(--text-light)] group-hover/btn:text-[var(--primary-base)] transition-colors duration-500 font-sans text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.15em]">
              Explore More
            </span>
            <svg 
              className="relative z-10 w-3.5 h-3.5 text-[var(--text-light)] group-hover/btn:text-[var(--primary-base)] group-hover/btn:translate-x-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          
        </div>
      </div>
    </div>
  );
};

/* =========================================
   MAIN SECTION COMPONENT
========================================= */
export default function Pillars() {
  const sectionRef = useRef(null);

  // Initial Section Entrance Scroll Animation
  useGSAP(() => {
    gsap.fromTo(
      ".pillar-card-wrapper",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[var(--primary-base)] text-[var(--text-light)] relative z-10"
    >
      <div className="w-full flex flex-col lg:flex-row min-h-[100vh] lg:min-h-[85vh]">
        {pillarsData.map((pillar, index) => (
          <div key={pillar.id} className="pillar-card-wrapper flex-1 flex flex-col">
            <PillarCard pillar={pillar} />
          </div>
        ))}
      </div>
    </section>
  );
}