import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import PageRouter from './routes/PageRouter';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import ScrollManager from './utils/ScrollManager';

import AdmissionModal from './components/global/AdmissionModal';

gsap.registerPlugin(useGSAP);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 

  // =========================================
  // AUTO-OPEN MODAL CONFIGURATION
  // Easily change these dates (Format: YYYY-MM-DD)
  // =========================================
  const AUTO_OPEN_START_DATE = new Date('2026-09-18T00:00:00');
  const AUTO_OPEN_END_DATE = new Date('2027-06-30T23:59:59');
  const AUTO_OPEN_DELAY_MS = 1500; // 1.5 seconds delay

  useEffect(() => {
    const currentDate = new Date();
    // Check if it has already been auto-opened in this session
    const hasAutoOpened = sessionStorage.getItem('hasAutoOpenedAdmissionModal');

    // Only trigger if within the date window AND it hasn't opened yet this session
    if (!hasAutoOpened && currentDate >= AUTO_OPEN_START_DATE && currentDate <= AUTO_OPEN_END_DATE) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
        // Record that it has opened so it doesn't pop up again on refresh/navigation
        sessionStorage.setItem('hasAutoOpenedAdmissionModal', 'true');
      }, AUTO_OPEN_DELAY_MS);

      // Cleanup the timer if the component unmounts before it fires
      return () => clearTimeout(timer);
    }
  }, []);

  // Refs for the floating buttons
  const admissionBtnRef = useRef(null);
  const recruitmentBtnRef = useRef(null);

  // Initial Entrance Animation for BOTH floating buttons
  useGSAP(() => {
    gsap.to([recruitmentBtnRef.current, admissionBtnRef.current], {
      x: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.15, // Stagger them in nicely
      ease: "expo.out",
      delay: 0.8,
    });
  });

  // Hover Handlers for Admission Button
  const { contextSafe: contextSafeAdmission } = useGSAP({ scope: admissionBtnRef });
  const handleAdmissionEnter = contextSafeAdmission(() => {
    gsap.to(".admission-text-main", { x: "-110%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".admission-text-hover", { x: "0%", duration: 0.6, ease: "expo.inOut" });
  });
  const handleAdmissionLeave = contextSafeAdmission(() => {
    gsap.to(".admission-text-main", { x: "0%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".admission-text-hover", { x: "110%", duration: 0.6, ease: "expo.inOut" });
  });

  // Hover Handlers for Recruitment Button
  const { contextSafe: contextSafeRecruitment } = useGSAP({ scope: recruitmentBtnRef });
  const handleRecruitmentEnter = contextSafeRecruitment(() => {
    gsap.to(".recruitment-text-main", { x: "-110%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".recruitment-text-hover", { x: "0%", duration: 0.6, ease: "expo.inOut" });
  });
  const handleRecruitmentLeave = contextSafeRecruitment(() => {
    gsap.to(".recruitment-text-main", { x: "0%", duration: 0.6, ease: "expo.inOut" });
    gsap.to(".recruitment-text-hover", { x: "110%", duration: 0.6, ease: "expo.inOut" });
  });

  // Routing Handler for Recruitment
  const handleRecruitmentClick = () => {
    // Navigate to Notice Board with the exact category param AND the section hash
    navigate('/notice-board?category=recruitment#notice-board-top');
  };

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
          GLOBAL FLOATING BUTTONS CONTAINER
      ========================================= */}
      <div className="fixed right-0 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-[60] flex flex-col gap-2">
        
        {/* BUTTON 1: Recruitment (Routes to Notice Board) */}
        <div
          ref={recruitmentBtnRef}
          style={{ transformOrigin: "right center" }}
          className="translate-x-[100px] opacity-0"
        >
          <button
            onClick={handleRecruitmentClick}
            onMouseEnter={handleRecruitmentEnter}
            onMouseLeave={handleRecruitmentLeave}
            className="group flex items-center gap-3 bg-[var(--background)] text-[var(--primary-base)] py-5 px-3 md:py-8 md:px-3 rounded-l-sm shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-r-0 border-[var(--primary-base)]/10 cursor-pointer outline-none"
          >
            {/* Briefcase Icon for Recruitment */}
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

            <div className="hidden md:flex justify-center items-center relative overflow-hidden w-[1em]">
              <span className="recruitment-text-main font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block">
                Recruitment
              </span>
              <span className="recruitment-text-hover absolute text-[var(--accent)] font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block translate-x-[110%]">
                Recruitment
              </span>
            </div>
          </button>
        </div>

        {/* BUTTON 2: Admission Query (Opens Modal) */}
        <div
          ref={admissionBtnRef}
          style={{ transformOrigin: "right center" }}
          className="translate-x-[100px] opacity-0"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            onMouseEnter={handleAdmissionEnter}
            onMouseLeave={handleAdmissionLeave}
            className="group flex items-center gap-3 bg-[var(--background)] text-[var(--primary-base)] py-5 px-3 md:py-8 md:px-3 rounded-l-sm shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-r-0 border-[var(--primary-base)]/10 cursor-pointer outline-none"
          >
            {/* Pencil/Edit Icon for Admission */}
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

            <div className="hidden md:flex justify-center items-center relative overflow-hidden w-[1em]">
              <span className="admission-text-main font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block">
                Admission Query
              </span>
              <span className="admission-text-hover absolute text-[var(--accent)] font-sans font-semibold text-[10px] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180 block translate-x-[110%]">
                Admission Query
              </span>
            </div>
          </button>
        </div>

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