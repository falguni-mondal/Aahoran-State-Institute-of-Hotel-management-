import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Hero from "../components/home/hero/Hero";
import AdmissionModal from "../components/home/AdmissionModal";
import About from "../components/home/About";
import Pillars from "../components/home/Pillars";
import Academics from "../components/home/Academics";
import PrincipalMessage from "../components/home/PrincipalMessage";
import Facilities from "../components/home/Facilities";
import Partners from "../components/home/Partners";
import Placements from "../components/home/Placements";

gsap.registerPlugin(useGSAP);

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref for the floating button interaction
  const queryBtnRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: queryBtnRef });

  // Initial Entrance Animation
  useGSAP(() => {
    gsap.to(queryBtnRef.current, {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "expo.out",
      delay: 0.8,
    });
  });

  // Hover Entrance
  const handleMouseEnter = contextSafe(() => {
    // Slide text in on the X-axis
    gsap.to(".query-text-main", {
      x: "-110%",
      duration: 0.6,
      ease: "expo.inOut",
    });
    gsap.to(".query-text-hover", {
      x: "0%",
      duration: 0.6,
      ease: "expo.inOut",
    });
  });

  // Hover Exit
  const handleMouseLeave = contextSafe(() => {
    // Slide text back out on the X-axis
    gsap.to(".query-text-main", { x: "0%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".query-text-hover", {
      x: "110%",
      duration: 0.6,
      ease: "expo.inOut",
    });
  });

  return (
    <div id="homepage" className="w-full min-h-screen relative overflow-x-clip">
      {/* Hero Section */}
      <Hero />

      {/* Floating Admission Query Button */}
      <div
        ref={queryBtnRef}
        // Critical: anchors the transform to the right edge so it scales outward correctly
        style={{ transformOrigin: "right center" }}
        className="fixed right-0 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-40 translate-x-[100px] opacity-0"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex items-center gap-3 bg-[var(--text-light)] text-[var(--primary-base)] py-5 px-3 md:py-8 md:px-3 rounded-l-sm shadow-[0_10px_40px_rgba(0,0,0,0.1)] cursor-pointer outline-none"
        >
          {/* Static Icon Zone - No interactions */}
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </div>

          {/* Vertical Text Zone - Bound strictly with w-[1em] and translating on X */}
          <div className="hidden md:flex justify-center items-center relative overflow-hidden w-[1em]">
            <span className="query-text-main font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block">
              Admission Query
            </span>
            <span className="query-text-hover absolute font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block translate-x-[110%]">
              Admission Query
            </span>
          </div>
        </button>
      </div>

      {/* Page-Level Modal */}
      <AdmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <About />

      <Pillars />

      <Academics />

      <PrincipalMessage />

      <Facilities />

      <Placements />

      <Partners />
    </div>
  );
};

export default Home;
