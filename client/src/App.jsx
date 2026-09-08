import React, { useState, useRef } from 'react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PageRouter from './routes/PageRouter';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import ScrollManager from './utils/ScrollManager';

// Import the Modal (Make sure this path matches your folder structure)
import AdmissionModal from './components/home/AdmissionModal';

gsap.registerPlugin(useGSAP);

const App = () => {
  // Global Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref and GSAP setup for the floating button interaction
  const queryBtnRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: queryBtnRef });

  // Initial Entrance Animation for the floating button
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
    gsap.to(".query-text-main", { x: "-110%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".query-text-hover", { x: "0%", duration: 0.6, ease: "expo.inOut" });
  });

  // Hover Exit
  const handleMouseLeave = contextSafe(() => {
    gsap.to(".query-text-main", { x: "0%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".query-text-hover", { x: "110%", duration: 0.6, ease: "expo.inOut" });
  });

  return (
    <div className='w-full max-w-[1920px] mx-auto relative'>
      <ScrollManager />

      <header className='w-full fixed top-0 left-0 z-50 flex justify-center'>
        <Navbar />
      </header>

      {/* Main Routing Area */}
      <main className='w-full'>
        <PageRouter/>
      </main>

      <Footer />

      {/* =========================================
          GLOBAL FLOATING ADMISSION BUTTON 
      ========================================= */}
      <div
        ref={queryBtnRef}
        style={{ transformOrigin: "right center" }}
        className="fixed right-0 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-[60] translate-x-[100px] opacity-0"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // ADDED 'group' class here to detect the hover state for the child elements
          className="group flex items-center gap-3 bg-[var(--background)] text-[var(--primary-base)] py-5 px-3 md:py-8 md:px-3 rounded-l-sm shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-r-0 border-[var(--primary-base)]/10 cursor-pointer outline-none"
        >
          {/* Static Icon Zone */}
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <svg
              // ADDED smooth transition and group-hover text color change here
              className="w-5 h-5 block transition-colors duration-300 group-hover:text-[var(--accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </div>

          {/* Vertical Text Zone */}
          <div className="hidden md:flex justify-center items-center relative overflow-hidden w-[1em]">
            <span className="query-text-main font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block">
              Admission Query
            </span>
            <span className="query-text-hover absolute text-[var(--accent)] font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block translate-x-[110%]">
              Admission Query
            </span>
          </div>
        </button>
      </div>

      {/* =========================================
          GLOBAL MODAL COMPONENT 
      ========================================= */}
      <AdmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
    </div>
  );
}

export default App;