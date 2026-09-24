import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import NBDownloadButton from '../notice-board/NBDownloadButton'; 

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   RESULTS DATA
========================================= */
const sessions = [
  { id: 'all', label: 'All Sessions' },
  { id: '23-24', label: '2023 - 24' },
  { id: '22-23', label: '2022 - 23' },
  { id: '20-21', label: '2020 - 21' },
];

const semesters = [
  { id: 'all', label: 'All' },
  { id: '1', label: 'Sem I' },
  { id: '2', label: 'Sem II' },
  { id: '3', label: 'Sem III' },
  { id: '4', label: 'Sem IV' },
  { id: '5', label: 'Sem V' },
  { id: '6', label: 'Sem VI' },
];

const bscResultsData = [
  { id: 2, sessionId: '23-24', semesterId: '2', title: 'Result of SEM 2 of B.Sc. HHA session 2023-24', type: 'Regular', isNew: true },
  { id: 3, sessionId: '23-24', semesterId: '6', title: 'Result of SEM 6 of B.Sc. HHA session 2023-24', type: 'Reappear', isNew: false },
  { id: 4, sessionId: '23-24', semesterId: '3', title: 'Result of SEM 3 of B.Sc. HHA session 2023-24', type: 'Regular', isNew: false, verificationLink: 'Marks Verification Form Semester III' },
  { id: 5, sessionId: '22-23', semesterId: '3', title: 'Result of Semester-3 of B.Sc (H&HA) Program Candidates session 2022-23', type: 'Regular', isNew: false, verificationLink: 'Marks Verification Form SEM III for Regular & Reappear Students 2022-23' },
  { id: 6, sessionId: '22-23', semesterId: '5', title: 'Result of Semester-5 of B.Sc (H&HA) Program Session 2022-23', type: 'Regular', isNew: false, verificationLink: 'Marks Verification Form SEM V for Regular & Reappear Students 2022-23' },
  { id: 7, sessionId: '20-21', semesterId: '1', title: 'Result of SEM I of B.Sc. in H&HA 2021-24', type: 'Regular', isNew: false, verificationLink: 'Marks Verification Form SEM II Regular 2020-21' },
  { id: 8, sessionId: '20-21', semesterId: '3', title: 'Result of SEM III/IV of B.Sc. 2020-21', type: 'Regular', isNew: false, verificationLink: 'Marks Verification Form of B.Sc in H&HA, Semester-III/IV Regular Students' },
];

const diplomaResultsData = [
  { id: 1, sessionId: '23-24', title: 'Result of DFP, Session 2023-24', type: 'Regular', isNew: true, verificationLink: 'Marks Verification Form Diploma 2023-24' },
  { id: 9, sessionId: '22-23', title: 'Result of DFBS, Session 2022-23', type: 'Regular', isNew: false },
  { id: 10, sessionId: '20-21', title: 'Result of DFP, Session 2020-21', type: 'Reappear', isNew: false },
];

/* =========================================
   SUB-COMPONENT: ResultSection
========================================= */
const ResultSection = ({ sectionId, title, data, hasSemesterFilter }) => {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const lenis = useLenis();

  const [activeSession, setActiveSession] = useState('all');
  const [activeSemester, setActiveSemester] = useState('all');
  const [hoveredResultId, setHoveredResultId] = useState(null);
  const [displayResults, setDisplayResults] = useState(data);

  // Filter Logic
  const applyFilters = (session, semester) => {
    let filtered = data;
    if (session !== 'all') {
      filtered = filtered.filter(res => res.sessionId === session);
    }
    if (hasSemesterFilter && semester !== 'all') {
      filtered = filtered.filter(res => res.semesterId === semester);
    }
    return filtered;
  };

  const handleFilterChange = (newSession, newSemester) => {
    if (newSession === activeSession && newSemester === activeSemester) return;

    const currentItems = listRef.current.querySelectorAll('.result-row');

    if (listRef.current) {
      const currentHeight = listRef.current.offsetHeight;
      gsap.set(listRef.current, { minHeight: currentHeight });
    }

    if (lenis) {
      lenis.scrollTo(`#${sectionId}`, { 
        offset: -100, 
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }

    if (currentItems.length > 0) {
      gsap.to(currentItems, {
        y: -15,
        opacity: 0,
        stagger: 0.02,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setActiveSession(newSession);
          setActiveSemester(newSemester);
          setDisplayResults(applyFilters(newSession, newSemester));
        }
      });
    } else {
      setActiveSession(newSession);
      setActiveSemester(newSemester);
      setDisplayResults(applyFilters(newSession, newSemester));
    }
  };

  useGSAP(() => {
    const newItems = listRef.current.querySelectorAll('.result-row');

    if (newItems.length > 0) {
      gsap.fromTo(newItems, 
        { y: 20, opacity: 0 },
        {
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
        }
      );
    } else {
      gsap.set(listRef.current, { clearProps: "minHeight" });
      if (lenis) lenis.resize();
      ScrollTrigger.refresh();
    }
  }, { dependencies: [displayResults], scope: containerRef });

  return (
    <div id={sectionId} ref={containerRef} className="w-full flex flex-col mb-24 lg:mb-32 last:mb-0">
      
      {/* Section Header */}
      <div className="flex flex-col mb-12 lg:mb-16">
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
          Results Archive
        </span>
        <h2 className="head-txt text-4xl md:text-5xl lg:text-7xl tracking-tighter text-[var(--text-main)] leading-none max-w-5xl">
          {title}
        </h2>
      </div>

      {/* SEMESTER TABS (B.Sc Only) */}
      {hasSemesterFilter && (
        <div className="tabs-container flex flex-col gap-4 mb-8">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40">
            Filter by Semester
          </span>
          
          <div className="flex flex-wrap items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-2">
            {semesters.map((sem) => {
              const isActive = activeSemester === sem.id;
              return (
                <button
                  key={sem.id}
                  onClick={() => handleFilterChange(activeSession, sem.id)}
                  className="group relative outline-none flex items-center py-2 cursor-pointer shrink-0"
                >
                  <span className={`text-xl md:text-2xl lg:text-3xl font-light tracking-tight transition-colors duration-500 ${
                    isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]/40 hover:text-[var(--text-main)]/70'
                  }`}>
                    [ {sem.label} ]
                  </span>
                  
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent)]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL-WIDTH TOP BORDER FOR GRID ALIGNMENT */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-20 items-start border-t border-[var(--primary-base)]/10 pt-10">
        
        {/* ==========================================
            LEFT SIDE: STICKY YEAR FILTERS
        ========================================== */}
        <div className="w-full lg:w-3/12 xl:w-1/4 shrink-0 lg:sticky lg:top-32 flex flex-col mb-8 lg:mb-0">
          <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40 block mb-6">
            Filter by Session
          </span>

          <nav className="flex flex-col gap-2 items-start w-full">
            {sessions.map((session) => {
              const isActive = session.id === activeSession;
              return (
                <button
                  key={session.id}
                  onClick={() => handleFilterChange(session.id, activeSemester)}
                  className="group relative text-left outline-none w-full py-2.5 transition-all duration-300 flex items-center justify-between"
                >
                  {/* Absolute Bleed Background for Sidebar Filters */}
                  <div className={`absolute -inset-x-4 md:-inset-x-6 inset-y-0 rounded-md transition-opacity duration-300 -z-10 ${
                    isActive ? 'bg-[var(--primary-base)]/5 opacity-100' : 'bg-[var(--primary-base)]/5 opacity-0 group-hover:opacity-100'
                  }`}></div>

                  <h3 className={`text-base md:text-lg font-light tracking-tight transition-colors duration-300 ${
                    isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]/50 group-hover:text-[var(--text-main)]/80'
                  }`}>
                    {session.label}
                  </h3>
                  
                  {/* Indicator Dot */}
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ml-4 transition-all duration-300 ${
                    isActive ? 'bg-[var(--accent)] scale-100 opacity-100' : 'bg-transparent scale-50 opacity-0'
                  }`}></span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ==========================================
            RIGHT SIDE: RESULTS LIST
        ========================================== */}
        <div className="w-full lg:w-9/12 xl:w-3/4 flex flex-col">
          
          <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40 block mb-6">
            Available Results
          </span>

          <div ref={listRef} className="flex flex-col relative min-h-[300px] border-t border-[var(--primary-base)]/10">
            {displayResults.length > 0 ? (
              displayResults.map((result, index) => {
                const serialNumber = String(index + 1).padStart(2, '0');
                const isDimmed = hoveredResultId !== null && hoveredResultId !== result.id;

                return (
                  <article
                    key={result.id}
                    onMouseEnter={() => setHoveredResultId(result.id)}
                    onMouseLeave={() => setHoveredResultId(null)}
                    // Border strict logic, hover bleed handled by absolute inset
                    className={`result-row relative group flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-16 py-8 md:py-10 lg:py-14 border-b border-[var(--primary-base)]/10 cursor-pointer outline-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isDimmed ? 'opacity-30 blur-[1px]' : 'opacity-100 blur-0'
                    }`}
                  >
                    {/* Absolute Bleed Background */}
                    <div className="absolute -inset-x-4 md:-inset-x-6 inset-y-0 rounded-md transition-opacity duration-300 -z-10 bg-[var(--primary-base)]/5 opacity-0 group-hover:opacity-100 pointer-events-none"></div>

                    <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[7rem] md:text-[12rem] font-bold text-[var(--text-main)]/[0.03] select-none pointer-events-none group-hover:scale-110 group-hover:text-[var(--text-main)]/[0.05] transition-all duration-700 ease-out origin-left -z-10">
                      {serialNumber}
                    </div>

                    <div className="relative z-10 flex flex-col items-start gap-4 w-full pr-0 md:pr-12">
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm ${
                          result.type === 'Regular' 
                            ? 'bg-[var(--primary-base)]/5 text-[var(--text-main)] border border-[var(--primary-base)]/10'
                            : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30'
                        }`}>
                          {result.type}
                        </span>
                        {result.isNew && (
                          <span className="px-3 py-1.5 border border-[var(--accent)] text-[var(--accent)] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                            New Result
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl md:text-2xl lg:text-3xl leading-[1.4] md:leading-[1.4] tracking-tight font-light text-[var(--text-main)] group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                        {result.title}
                      </h3>

                      {result.verificationLink && (
                        <a 
                          href="#" 
                          className="group/link flex items-center gap-2 mt-2 group-hover:translate-x-2 transition-transform duration-500 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        >
                          <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span className="font-sans text-[11px] md:text-sm text-[var(--text-main)]/70 font-medium tracking-wide underline decoration-[var(--primary-base)]/20 decoration-1 underline-offset-4 group-hover/link:text-[var(--accent)] group-hover/link:decoration-[var(--accent)] transition-colors duration-300">
                            {result.verificationLink}
                          </span>
                        </a>
                      )}
                    </div>

                    <div className="relative z-10 shrink-0 self-start md:self-auto mt-6 md:mt-0">
                      <NBDownloadButton />
                    </div>

                  </article>
                );
              })
            ) : (
              <div className="py-16 md:py-24 text-center flex flex-col items-center justify-center border-b border-[var(--primary-base)]/10">
                <span className="text-6xl md:text-8xl text-[var(--text-main)]/10 mb-6">∅</span>
                <p className="font-sans text-lg md:text-xl font-light tracking-tight text-[var(--text-main)]/40">
                  No results published for this selection yet.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

/* =========================================
   MAIN EXPORT COMPONENT
========================================= */
export default function ResultsContent() {
  return (
    <section className="w-full bg-[var(--background)] relative z-20 pt-16 md:pt-24 lg:pt-32 pb-20 md:pb-28 border-t border-[var(--primary-base)]/10">
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {/* SECTION 1: B.Sc. HHA */}
        <ResultSection 
          sectionId="results-bsc"
          title="B.Sc. in Hospitality & Hotel Administration"
          data={bscResultsData}
          hasSemesterFilter={true}
        />

        {/* SECTION 2: Diploma Courses */}
        <ResultSection 
          sectionId="results-diploma"
          title="Diploma Courses"
          data={diplomaResultsData}
          hasSemesterFilter={false}
        />

      </div>
    </section>
  );
}