import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PageRouter from './routes/PageRouter';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import ScrollManager from './utils/ScrollManager';
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Ensure ScrollTrigger is imported

import AdmissionModal from './components/global/AdmissionModal';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 

  // =========================================
  // STATE TRACKERS (Refs used to prevent re-renders)
  // =========================================
  const isScrolledPast100vh = useRef(false);
  const recruitmentHovered = useRef(false);
  const admissionHovered = useRef(false);

  // =========================================
  // AUTO-OPEN MODAL CONFIGURATION
  // =========================================
  const AUTO_OPEN_START_DATE = new Date('2026-09-18T00:00:00');
  const AUTO_OPEN_END_DATE = new Date('2027-06-30T23:59:59');
  const AUTO_OPEN_DELAY_MS = 1500; 

  useEffect(() => {
    const currentDate = new Date();
    const hasAutoOpened = sessionStorage.getItem('hasAutoOpenedAdmissionModal');

    if (!hasAutoOpened && currentDate >= AUTO_OPEN_START_DATE && currentDate <= AUTO_OPEN_END_DATE) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
        sessionStorage.setItem('hasAutoOpenedAdmissionModal', 'true');
      }, AUTO_OPEN_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, []);

  // Refs for the floating buttons
  const admissionBtnRef = useRef(null);
  const recruitmentBtnRef = useRef(null);

  // =========================================
  // GLOBAL ANIMATIONS (Entrance & Scroll)
  // =========================================
  useGSAP(() => {
    // 1. Initial Entrance Animation
    gsap.to([recruitmentBtnRef.current, admissionBtnRef.current], {
      x: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.15, 
      ease: "expo.out",
      delay: 0.8,
    });

    // 2. Scroll 100vh trigger
    ScrollTrigger.create({
      start: () => window.innerHeight, // Triggers exactly at 100vh
      onEnter: () => {
        isScrolledPast100vh.current = true;
        // Only shrink if the user isn't currently hovering over them
        if (!recruitmentHovered.current) {
          gsap.to(recruitmentBtnRef.current.querySelector(".text-wrapper"), { height: 0, marginTop: 0, opacity: 0, duration: 0.6, ease: "expo.inOut" });
        }
        if (!admissionHovered.current) {
          gsap.to(admissionBtnRef.current.querySelector(".text-wrapper"), { height: 0, marginTop: 0, opacity: 0, duration: 0.6, ease: "expo.inOut" });
        }
      },
      onLeaveBack: () => {
        isScrolledPast100vh.current = false;
        // Always expand them when scrolling back to the top
        gsap.to([
          recruitmentBtnRef.current.querySelector(".text-wrapper"),
          admissionBtnRef.current.querySelector(".text-wrapper")
        ], { height: "auto", marginTop: 12, opacity: 1, duration: 0.6, ease: "expo.inOut" });
      }
    });
  });

  // =========================================
  // HOVER HANDLERS: Recruitment Button
  // =========================================
  const { contextSafe: contextSafeRecruitment } = useGSAP({ scope: recruitmentBtnRef });
  
  const handleRecruitmentEnter = contextSafeRecruitment(() => {
    recruitmentHovered.current = true;
    // Only expand height if we are past 100vh (because above 100vh, it's already open)
    if (isScrolledPast100vh.current) {
      gsap.to(".text-wrapper", { height: "auto", marginTop: 12, opacity: 1, duration: 0.6, ease: "expo.inOut" });
    }
    // Always do the text color slide
    gsap.to(".text-main", { x: "-110%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".text-hover", { x: "0%", duration: 0.6, ease: "expo.inOut" });
  });

  const handleRecruitmentLeave = contextSafeRecruitment(() => {
    recruitmentHovered.current = false;
    // Only shrink height if we are past 100vh
    if (isScrolledPast100vh.current) {
      gsap.to(".text-wrapper", { height: 0, marginTop: 0, opacity: 0, duration: 0.6, ease: "expo.inOut" });
    }
    // Always slide text back
    gsap.to(".text-main", { x: "0%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".text-hover", { x: "110%", duration: 0.6, ease: "expo.inOut" });
  });

  // =========================================
  // HOVER HANDLERS: Admission Button
  // =========================================
  const { contextSafe: contextSafeAdmission } = useGSAP({ scope: admissionBtnRef });
  
  const handleAdmissionEnter = contextSafeAdmission(() => {
    admissionHovered.current = true;
    if (isScrolledPast100vh.current) {
      gsap.to(".text-wrapper", { height: "auto", marginTop: 12, opacity: 1, duration: 0.6, ease: "expo.inOut" });
    }
    gsap.to(".text-main", { x: "-110%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".text-hover", { x: "0%", duration: 0.6, ease: "expo.inOut" });
  });

  const handleAdmissionLeave = contextSafeAdmission(() => {
    admissionHovered.current = false;
    if (isScrolledPast100vh.current) {
      gsap.to(".text-wrapper", { height: 0, marginTop: 0, opacity: 0, duration: 0.6, ease: "expo.inOut" });
    }
    gsap.to(".text-main", { x: "0%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".text-hover", { x: "110%", duration: 0.6, ease: "expo.inOut" });
  });

  const handleRecruitmentClick = () => {
    navigate('/notice-board?category=recruitment#notice-board-top');
  };

  return (
    <div className='w-full max-w-[1920px] mx-auto relative'>
      <ScrollManager />

      <header className='w-full fixed top-0 left-0 z-50 flex justify-center'>
        <Navbar />
      </header>

      <main className='w-full'>
        <PageRouter/>
      </main>

      <Footer />

      {/* =========================================
          GLOBAL FLOATING BUTTONS CONTAINER
      ========================================= */}
      <div className="fixed right-0 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-[60] flex flex-col gap-2">
        
        {/* BUTTON 1: Recruitment */}
        <div
          ref={recruitmentBtnRef}
          style={{ transformOrigin: "right center" }}
          className="translate-x-[100px] opacity-0"
        >
          <button
            onClick={handleRecruitmentClick}
            onMouseEnter={handleRecruitmentEnter}
            onMouseLeave={handleRecruitmentLeave}
            className="group flex flex-col items-center justify-center bg-[var(--background)] text-[var(--primary-base)] p-3.5 md:p-4 rounded-l-sm shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-r-0 border-[var(--primary-base)]/10 cursor-pointer outline-none will-change-[padding]"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 block transition-colors duration-300 group-hover:text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Default state is now OPEN (height: 'auto') */}
            <div 
              className="text-wrapper hidden md:flex justify-center items-center relative overflow-hidden w-[1em] will-change-[height,margin,opacity]"
              style={{ height: "auto", opacity: 1, marginTop: 12 }}
            >
              <span className="text-main whitespace-nowrap font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block">
                Recruitment
              </span>
              <span className="text-hover whitespace-nowrap absolute text-[var(--accent)] font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block translate-x-[110%]">
                Recruitment
              </span>
            </div>
          </button>
        </div>

        {/* BUTTON 2: Admission Query */}
        <div
          ref={admissionBtnRef}
          style={{ transformOrigin: "right center" }}
          className="translate-x-[100px] opacity-0"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            onMouseEnter={handleAdmissionEnter}
            onMouseLeave={handleAdmissionLeave}
            className="group flex flex-col items-center justify-center bg-[var(--background)] text-[var(--primary-base)] p-3.5 md:p-4 rounded-l-sm shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-r-0 border-[var(--primary-base)]/10 cursor-pointer outline-none will-change-[padding]"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <svg
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

            {/* Default state is now OPEN (height: 'auto') */}
            <div 
              className="text-wrapper hidden md:flex justify-center items-center relative overflow-hidden w-[1em] will-change-[height,margin,opacity]"
              style={{ height: "auto", opacity: 1, marginTop: 12 }}
            >
              <span className="text-main whitespace-nowrap font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block">
                Admission Query
              </span>
              <span className="text-hover whitespace-nowrap absolute text-[var(--accent)] font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block translate-x-[110%]">
                Admission Query
              </span>
            </div>
          </button>
        </div>

      </div>

      <AdmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}