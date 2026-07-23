import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import NoticeCarousel from "../NoticeCarousel";
import AdmissionForm from "./AdmissionForm"; // Import the new form component

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const heroRef = useRef(null);
  
  // State for the sliding form drawer
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Dynamic Date Logic
  const currentYear = new Date().getFullYear();
  // Get the last two digits of the next year (e.g., 2026 -> 27)
  const nextYearShort = (currentYear + 1).toString().slice(-2);
  const dynamicAdmissionText = `Admissions ${currentYear}-${nextYearShort}`;

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".hero-badge",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );

      tl.fromTo(
        ".hero-title-line",
        { y: "110%" },
        { y: "0%", duration: 1, stagger: 0.15, ease: "power4.out" },
        "-=0.5",
      );

      tl.fromTo(
        ".hero-fade-up",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=0.6",
      );
      
      // Floating button entrance
      tl.fromTo(
        ".floating-query-btn",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" },
        "-=0.4"
      );
    },
    { scope: heroRef },
  );

  return (
    <>
      <section
        ref={heroRef}
        className="relative w-full h-screen bg-[var(--primary-base)] text-[var(--text-light)] flex flex-col justify-center overflow-hidden"
      >

        {/* BG Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 grayscale opacity-100"
          autoPlay
          loop
          muted
          playsInline
          src="/hero.mp4"
        ></video>

        <div className="absolute inset-0 bg-[var(--primary-base)]/90 z-0"></div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--primary-light),_transparent_60%)] opacity-70 mix-blend-screen z-0"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-start mt-12">
          
          <h1 className="head-txt text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6 uppercase tracking-tight">
            <div className="overflow-hidden pb-2 flex items-center gap-4 md:gap-6">
              <span className="hero-title-line block text-[var(--text-light)]">
                State Institute of
              </span>
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

            <div className="overflow-hidden pb-2">
              <span className="hero-title-line block text-[var(--text-light)]">
                Hotel Management
              </span>
            </div>
          </h1>

          <p className="hero-fade-up max-w-5xl text-lg md:text-xl text-[var(--text-light)]/80 font-sans font-light leading-relaxed mb-10">
            (A Society under Tourism Department, Government of West Bengal,
            Registration No. S/1L/60653 dated: 20-10-2011) Fuljhore,
            Durgapur-713206, District: Paschim Bardhaman
          </p>

          <div className="hero-fade-up flex flex-wrap items-center gap-4">
            {/* The Dynamic Button Text */}
            <button className="bg-[var(--text-light)] text-[var(--primary-base)] px-8 py-4 font-sans font-bold text-sm uppercase tracking-widest hover:bg-[var(--primary-light)] hover:text-[var(--text-light)] transition-all duration-300 shadow-lg cursor-pointer">
              {dynamicAdmissionText}
            </button>
            <button className="border border-[var(--text-light)]/30 px-8 py-4 font-sans font-bold text-sm uppercase tracking-widest text-[var(--text-light)] hover:bg-[var(--text-light)]/10 transition-colors duration-300 flex items-center gap-2 cursor-pointer">
              View Prospectus
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Elevated Floating Action Button (Replaces the old clipart button) */}
        <button 
          onClick={() => setIsFormOpen(true)}
          className="floating-query-btn fixed bottom-24 right-6 md:right-12 z-50 bg-[var(--text-light)] text-[var(--primary-base)] pl-4 pr-6 py-3 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer border border-white/40"
        >
          <div className="bg-[var(--primary-base)]/10 rounded-full p-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span className="font-sans font-bold text-xs uppercase tracking-widest">
            Admission Query
          </span>
        </button>

        <NoticeCarousel />
      </section>

      {/* Render the Drawer completely outside the flow */}
      <AdmissionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}