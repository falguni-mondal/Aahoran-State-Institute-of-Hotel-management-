import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import NBDownloadButton from '../notice-board/NBDownloadButton'; // Reusing our bulletproof button

gsap.registerPlugin(ScrollTrigger);

/* =========================================
   RESULTS DATA (Extracted from Screenshots)
========================================= */
const sessions = [
  { id: 'all', label: 'All Sessions' },
  { id: '23-24', label: '2023 - 24' },
  { id: '22-23', label: '2022 - 23' },
  { id: '20-21', label: '2020 - 21' },
];

const resultsData = [
  { 
    id: 1, 
    sessionId: '23-24', 
    title: 'Result of DFP, Session 2023-24', 
    type: 'Regular', 
    isNew: true, 
    verificationLink: 'Marks Verification Form Diploma 2023-24' 
  },
  { 
    id: 2, 
    sessionId: '23-24', 
    title: 'Result of SEM 2 of B.Sc. HHA session 2023-24', 
    type: 'Regular', 
    isNew: true 
  },
  { 
    id: 3, 
    sessionId: '23-24', 
    title: 'Result of SEM 6 of B.Sc. HHA session 2023-24', 
    type: 'Reappear', 
    isNew: false 
  },
  { 
    id: 4, 
    sessionId: '23-24', 
    title: 'Result of SEM 3 of B.Sc. HHA session 2023-24', 
    type: 'Regular', 
    isNew: false, 
    verificationLink: 'Marks Verification Form Semester III' 
  },
  { 
    id: 5, 
    sessionId: '22-23', 
    title: 'Result of Semester-3 of B.Sc (H&HA) Program Candidates session 2022-23', 
    type: 'Regular', 
    isNew: false, 
    verificationLink: 'Marks Verification Form SEM III for Regular & Reappear Students 2022-23' 
  },
  { 
    id: 6, 
    sessionId: '22-23', 
    title: 'Result of Semester-5 of B.Sc (H&HA) Program Session 2022-23', 
    type: 'Regular', 
    isNew: false, 
    verificationLink: 'Marks Verification Form SEM V for Regular & Reappear Students 2022-23' 
  },
  { 
    id: 7, 
    sessionId: '20-21', 
    title: 'Result of SEM I of B.Sc. in H&HA 2021-24', 
    type: 'Regular', 
    isNew: false, 
    verificationLink: 'Marks Verification Form SEM II Regular 2020-21' 
  },
  { 
    id: 8, 
    sessionId: '20-21', 
    title: 'Result of SEM III/IV of B.Sc. 2020-21', 
    type: 'Regular', 
    isNew: false, 
    verificationLink: 'Marks Verification Form of B.Sc in H&HA, Semester-III/IV Regular Students' 
  },
];

export default function ResultsContent() {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const isFirstRender = useRef(true); 
  
  const lenis = useLenis();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSession = searchParams.get('session') || sessions[0].id;
  const [hoveredResultId, setHoveredResultId] = useState(null);
  
  const [displayResults, setDisplayResults] = useState(() => {
    return activeSession === 'all' 
      ? resultsData 
      : resultsData.filter(res => res.sessionId === activeSession);
  });

  useEffect(() => {
    const newData = activeSession === 'all' 
      ? resultsData 
      : resultsData.filter(res => res.sessionId === activeSession);
    setDisplayResults(newData);
  }, [activeSession]);

  const handleSessionChange = (newSessionId) => {
    if (newSessionId === activeSession) return;

    const currentItems = listRef.current.querySelectorAll('.result-row');

    // 1. HEIGHT LOCK
    if (listRef.current) {
      const currentHeight = listRef.current.offsetHeight;
      gsap.set(listRef.current, { minHeight: currentHeight });
    }

    // 2. SCROLL FIX WITH LENIS
    if (lenis && containerRef.current) {
      lenis.scrollTo(containerRef.current, { offset: -100, duration: 1.2 });
    }

    // 3. ANIMATE OUT
    if (currentItems.length > 0) {
      gsap.to(currentItems, {
        y: 30,
        opacity: 0,
        stagger: 0.02,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => setSearchParams({ session: newSessionId })
      });
    } else {
      setSearchParams({ session: newSessionId });
    }
  };

  useGSAP(() => {
    ScrollTrigger.refresh();

    if (!isFirstRender.current && lenis && containerRef.current) {
      lenis.scrollTo(containerRef.current, { offset: -100, duration: 1.2 });
    }
    isFirstRender.current = false;

    const newItems = listRef.current.querySelectorAll('.result-row');

    if (newItems.length > 0) {
      gsap.set(newItems, { y: -30, opacity: 0 });

      gsap.to(newItems, {
        y: 0,
        opacity: 1,
        stagger: 0.04,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(listRef.current, { clearProps: "minHeight" });
          if (lenis) lenis.resize();
          ScrollTrigger.refresh();
        }
      });
    } else {
      gsap.set(listRef.current, { clearProps: "minHeight" });
      if (lenis) lenis.resize();
      ScrollTrigger.refresh();
    }
  }, { dependencies: [displayResults], scope: listRef });

  return (
    <section ref={containerRef} className="w-full bg-[var(--background)] relative z-20">
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        
        {/* ==========================================
            LEFT SIDE: STICKY ACADEMIC FILTERS
        ========================================== */}
        <div className="w-full lg:w-[30%] shrink-0 lg:sticky lg:top-32 flex flex-col gap-12">
          
          <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] border-b border-[var(--primary-base)]/10 pb-4">
            Filter by Session
          </span>

          <nav className="flex flex-col gap-4 md:gap-6 items-start">
            {sessions.map((session) => {
              const isActive = session.id === activeSession;
              return (
                <button
                  key={session.id}
                  onClick={() => handleSessionChange(session.id)}
                  className="group relative text-left outline-none"
                >
                  <h3 className={`text-4xl md:text-5xl lg:text-6xl font-light tracking-tight transition-colors duration-500 ${
                    isActive 
                      ? 'text-[var(--primary-base)]' 
                      : 'text-[var(--primary-base)]/30 hover:text-[var(--primary-base)]/60'
                  }`}>
                    {session.label}
                  </h3>
                  
                  <div className={`absolute -bottom-2 left-0 h-[1px] bg-[var(--accent)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-1/4'
                  }`}></div>
                </button>
              );
            })}
          </nav>

        </div>

        {/* ==========================================
            RIGHT SIDE: CINEMATIC RESULTS ARCHIVE
        ========================================== */}
        <div ref={listRef} className="w-full lg:w-[70%] flex flex-col border-t border-[var(--primary-base)]/15 relative">
          {displayResults.length > 0 ? (
            displayResults.map((result, index) => {
              
              const serialNumber = String(index + 1).padStart(2, '0');
              const isDimmed = hoveredResultId !== null && hoveredResultId !== result.id;

              return (
                <article
                  key={result.id}
                  onMouseEnter={() => setHoveredResultId(result.id)}
                  onMouseLeave={() => setHoveredResultId(null)}
                  className={`result-row relative group flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 py-12 md:py-16 border-b border-[var(--primary-base)]/15 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isDimmed ? 'opacity-20 blur-[2px]' : 'opacity-100 blur-0'
                  }`}
                >
                  {/* Massive Faint Serial Number Watermark */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[8rem] md:text-[14rem] font-bold text-[var(--primary-base)]/[0.03] select-none pointer-events-none group-hover:scale-110 group-hover:text-[var(--primary-base)]/[0.05] transition-all duration-700 ease-out origin-left -z-10">
                    {serialNumber}
                  </div>

                  {/* Result Content */}
                  <div className="relative z-10 flex flex-col items-start gap-4 w-full pr-0 md:pr-8">
                    
                    {/* Tags: Regular/Reappear & New */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm ${
                        result.type === 'Regular' 
                          ? 'bg-[var(--primary-base)]/5 text-[var(--primary-base)] border border-[var(--primary-base)]/20'
                          : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30'
                      }`}>
                        {result.type}
                      </span>
                      {result.isNew && (
                        <span className="px-2 py-1 border border-green-600/40 bg-green-600/10 text-green-700 text-[8px] font-bold uppercase tracking-[0.2em] rounded-sm">
                          New Result
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-3xl lg:text-4xl leading-[1.3] tracking-tight font-light text-[var(--primary-base)] group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                      {result.title}
                    </h2>

                    {/* Marks Verification Sub-Link */}
                    {result.verificationLink && (
                      <a 
                        href="#" 
                        className="group/link flex items-center gap-2 mt-2 group-hover:translate-x-2 transition-transform duration-500 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      >
                        <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="font-sans text-[11px] md:text-xs text-[var(--primary-base)]/70 font-medium tracking-wide underline decoration-[var(--primary-base)]/20 decoration-1 underline-offset-4 group-hover/link:text-[var(--accent)] group-hover/link:decoration-[var(--accent)] transition-colors duration-300">
                          {result.verificationLink}
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Download Action Component */}
                  <div className="relative z-10 shrink-0 md:pl-4 self-start md:self-auto mt-6 md:mt-0">
                    <NBDownloadButton />
                  </div>

                </article>
              );
            })
          ) : (
            <div className="py-32 text-center flex flex-col items-center justify-center">
              <span className="text-6xl md:text-8xl text-[var(--primary-base)]/10 mb-6">∅</span>
              <p className="font-sans text-xl md:text-2xl font-light tracking-tight text-[var(--primary-base)]/40">
                No results published for this session yet.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}