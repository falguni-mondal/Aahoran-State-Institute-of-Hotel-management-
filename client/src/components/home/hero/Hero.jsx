import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NoticeCarousel from "../NoticeCarousel"; 

gsap.registerPlugin(useGSAP);

// Extracted the CTA button into its own GSAP component for scoped physics
function HeroCTA({ text }) {
  const btnRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: btnRef });

  const handleMouseEnter = contextSafe(() => {
    // Only animating the text, icon remains completely static
    gsap.to(".cta-text-main", { y: "-110%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".cta-text-hover", { y: "0%", duration: 0.6, ease: "expo.inOut" });
  });

  const handleMouseLeave = contextSafe(() => {
    // Reversing the text animation
    gsap.to(".cta-text-main", { y: "0%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".cta-text-hover", { y: "110%", duration: 0.6, ease: "expo.inOut" });
  });

  return (
    <button 
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-[var(--background)] text-[var(--primary-base)] font-semibold text-xs uppercase tracking-[0.15em] shadow-lg cursor-pointer flex items-stretch h-13"
    >
      {/* Text Zone */}
      <div className="flex items-center justify-center px-10 relative overflow-hidden">
        <div className="relative overflow-hidden h-[1em] leading-none flex items-center justify-center">
          <span className="cta-text-main block">{text}</span>
          <span className="cta-text-hover absolute block translate-y-[110%]">{text}</span>
        </div>
      </div>
      
      {/* Icon Zone - Completely static single SVG */}
      <div className="border-l border-[var(--primary-base)]/20 px-4 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="block">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  );
}

export default function Hero() {
  const heroRef = useRef(null);

  // Dynamic Year Calculation
  const currentYear = new Date().getFullYear();
  const nextYearShort = (currentYear + 1).toString().slice(-2);
  const dynamicAdmissionText = `ADMISSIONS ${currentYear}-${nextYearShort}`;

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        ".hero-title-line",
        { y: "125%", rotateZ: 2 },
        { y: "0%", rotateZ: 0, duration: 1.5, stagger: 0.1 }
      );

      tl.fromTo(
        ".hero-fade-up",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
        "<0.4"
      );
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen bg-[var(--primary-base)] text-[var(--text-light)] flex flex-col justify-center overflow-hidden"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
        autoPlay
        loop
        muted
        playsInline
        src="/hero.mp4"
      ></video>

      <div className="absolute inset-0 bg-[var(--primary-base)]/80 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--primary-light),_transparent_60%)] opacity-70 mix-blend-screen z-0"></div>

      <div className="relative z-10 w-full mx-auto px-5 md:px-12 lg:px-12 flex flex-col items-start mt-12">
        
        {/* Mobile Heading */}
        <h1 className="lg:hidden head-txt text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6 uppercase tracking-tight w-full">
          <div className="w-full overflow-hidden pb-2 flex flex-wrap items-center gap-4 md:gap-6">
            <span className="hero-title-line block text-[var(--text-light)] origin-bottom-left">
              State Institute of
            </span>
            <div className="hero-title-line relative overflow-hidden rounded-md w-20 h-10 md:w-32 md:h-16 lg:w-40 lg:h-20 shadow-xl border border-[var(--text-light)]/20 origin-bottom-left">
              <video className="w-full h-full object-cover grayscale opacity-100" autoPlay loop muted playsInline src="/hero.mp4"></video>
            </div>
            <span className="hero-title-line block text-[var(--text-light)] origin-bottom-left">
              Hotel Management
            </span>
          </div>
        </h1>

        {/* Desktop Heading */}
        <h1 className="hidden lg:block head-txt text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6 uppercase tracking-tight">
          <div className="overflow-hidden pb-2 flex items-center gap-4 md:gap-6">
            <span className="hero-title-line block text-[var(--text-light)] origin-bottom-left">
              State Institute of
            </span>
            <div className="hero-title-line relative overflow-hidden rounded-md w-20 h-10 md:w-32 md:h-16 lg:w-40 lg:h-20 shadow-xl border border-[var(--text-light)]/20 origin-bottom-left">
              <video className="w-full h-full object-cover grayscale opacity-90" autoPlay loop muted playsInline src="/hero.mp4"></video>
            </div>
          </div>
          <div className="overflow-hidden pb-2">
            <span className="hero-title-line block text-[var(--text-light)] origin-bottom-left">
              Hotel Management
            </span>
          </div>
        </h1>

        {/* Subtitle */}
        <p className="hero-fade-up max-w-5xl text-lg md:text-xl text-[var(--text-light)]/80 font-sans font-light leading-relaxed mb-10">
          (A Society under Tourism Department, Government of West Bengal,
          Registration No. S/1L/60653 dated: 20-10-2011) Fuljhore,
          Durgapur-713206, District: Paschim Bardhaman
        </p>

        {/* Action Buttons */}
        <div className="hero-fade-up flex flex-wrap items-center gap-4">
          <HeroCTA text={dynamicAdmissionText} />
          <HeroCTA text="VIEW PROSPECTUS" />
        </div>
      </div>

      <NoticeCarousel />
    </section>
  );
}