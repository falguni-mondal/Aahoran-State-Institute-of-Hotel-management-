import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react'; 
import NBDownloadButton from './NBDownloadButton';

gsap.registerPlugin(ScrollTrigger);

/* =========================================
   MOCK DATA 
========================================= */
const categories = [
  { id: 'all', label: 'All Notices' },
  { id: 'student', label: 'Student Directives' },
  { id: 'exam', label: 'Examinations' },
  { id: 'office', label: 'Office Circulars' },
  { id: 'placement', label: 'Training & Placement' },
  { id: 'tender', label: 'Tender Notices' },
];

const noticesData = [
  { id: 1, categoryId: 'student', date: '07/05/2026', title: 'Fee Structure for Diploma Courses for the Academic Year 2026-27', isNew: true },
  { id: 2, categoryId: 'student', date: '07/05/2026', title: 'Fee Structure for B.Sc HHA Academic Program (Batch 2026-29)', isNew: true },
  { id: 3, categoryId: 'exam', date: '17/11/2025', title: 'Academic Time Table for Semester-6 of 3 Years B.Sc in HHA Students', isNew: false },
  { id: 4, categoryId: 'exam', date: '26/08/2025', title: 'Notice for deposit of Semester fees towards Semester-1 of B Sc in HHA', isNew: false },
  { id: 5, categoryId: 'office', date: '26/08/2025', title: 'Notice for deposit of Semester fees towards Diploma students', isNew: false },
  { id: 6, categoryId: 'office', date: '01/05/2026', title: 'Campus Facility Update: New Library Hours and Regulations', isNew: true },
  { id: 7, categoryId: 'placement', date: '12/04/2026', title: 'Pre-Placement Talk: Taj Group of Hotels Executive Training', isNew: false },
  { id: 8, categoryId: 'tender', date: '05/03/2026', title: 'Invitation of Quotation for Kitchen Equipment Procurement', isNew: false },
];

export default function NBContent() {
  const listRef = useRef(null);
  const lenis = useLenis();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || categories[0].id;
  const [hoveredNoticeId, setHoveredNoticeId] = useState(null);
  
  const [displayNotices, setDisplayNotices] = useState(() => {
    return activeCategory === 'all' 
      ? noticesData 
      : noticesData.filter(notice => notice.categoryId === activeCategory);
  });

  useEffect(() => {
    const newData = activeCategory === 'all' 
      ? noticesData 
      : noticesData.filter(notice => notice.categoryId === activeCategory);
    setDisplayNotices(newData);
  }, [activeCategory]);

  const handleCategoryChange = (newCategoryId) => {
    if (newCategoryId === activeCategory) return;

    const currentItems = listRef.current.querySelectorAll('.nb-row');

    // 1. HEIGHT LOCK
    if (listRef.current) {
      const currentHeight = listRef.current.offsetHeight;
      gsap.set(listRef.current, { minHeight: currentHeight });
    }

    // 2. SMOOTH SCROLL TO ID
    if (lenis) {
      lenis.scrollTo('#notice-board-top', { 
        offset: -100, 
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }

    // 3. ANIMATE OUT & SET ROUTER STATE (The Fix applied here)
    if (currentItems.length > 0) {
      gsap.to(currentItems, {
        y: 20,
        opacity: 0,
        stagger: 0.02,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setSearchParams(
            { category: newCategoryId }, 
            { replace: true, state: { noScroll: true } }
          );
        }
      });
    } else {
      setSearchParams(
        { category: newCategoryId }, 
        { replace: true, state: { noScroll: true } }
      );
    }
  };

  useGSAP(() => {
    const newItems = listRef.current.querySelectorAll('.nb-row');

    if (newItems.length > 0) {
      gsap.set(newItems, { y: -20, opacity: 0 });

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
  }, { dependencies: [displayNotices], scope: listRef });

  return (
    <section id="notice-board-top" className="w-full bg-[var(--background)] relative z-20">
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        
        {/* ==========================================
            LEFT SIDE: STICKY TYPOGRAPHIC FILTERS
        ========================================== */}
        <div className="w-full lg:w-[30%] shrink-0 lg:sticky lg:top-32 flex flex-col gap-12">
          
          <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] border-b border-[var(--primary-base)]/10 pb-4">
            Filter by Category
          </span>

          <nav className="flex flex-col gap-4 md:gap-6 items-start">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className="group relative text-left outline-none"
                >
                  <h3 className={`text-3xl md:text-4xl lg:text-5xl font-light tracking-tight transition-colors duration-500 ${
                    isActive 
                      ? 'text-[var(--primary-base)]' 
                      : 'text-[var(--primary-base)]/30 hover:text-[var(--primary-base)]/60'
                  }`}>
                    {cat.label}
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
            RIGHT SIDE: CINEMATIC NOTICE LIST
        ========================================== */}
        <div ref={listRef} className="w-full lg:w-[70%] flex flex-col border-t border-[var(--primary-base)]/15 relative">
          {displayNotices.length > 0 ? (
            displayNotices.map((notice, index) => {
              
              const serialNumber = String(index + 1).padStart(2, '0');
              const isDimmed = hoveredNoticeId !== null && hoveredNoticeId !== notice.id;

              return (
                <article
                  key={notice.id}
                  onMouseEnter={() => setHoveredNoticeId(notice.id)}
                  onMouseLeave={() => setHoveredNoticeId(null)}
                  className={`nb-row relative group flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 py-12 md:py-16 border-b border-[var(--primary-base)]/15 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isDimmed ? 'opacity-20 blur-[2px]' : 'opacity-100 blur-0'
                  }`}
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[8rem] md:text-[14rem] font-bold text-[var(--primary-base)]/[0.03] select-none pointer-events-none group-hover:scale-110 group-hover:text-[var(--primary-base)]/[0.05] transition-all duration-700 ease-out origin-left -z-10">
                    {serialNumber}
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-4 md:gap-12 w-full pr-0 md:pr-8">
                    
                    <div className="shrink-0 md:w-32 flex flex-col gap-2 md:pt-2">
                      <span className="font-mono text-xs md:text-sm tracking-wider text-[var(--primary-base)]/50">
                        {notice.date}
                      </span>
                      {notice.isNew && (
                        <span className="w-fit px-2 py-0.5 border border-[var(--accent)] text-[var(--accent)] text-[8px] font-bold uppercase tracking-[0.2em] rounded-full">
                          New Update
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl leading-[1.2] tracking-tight font-light text-[var(--primary-base)] group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                      {notice.title}
                    </h2>

                  </div>

                  <div className="relative z-10 shrink-0 md:pl-4 self-start md:self-auto">
                    <NBDownloadButton />
                  </div>

                </article>
              );
            })
          ) : (
            <div className="py-32 text-center flex flex-col items-center justify-center">
              <span className="text-6xl md:text-8xl text-[var(--primary-base)]/10 mb-6">∅</span>
              <p className="font-sans text-xl md:text-2xl font-light tracking-tight text-[var(--primary-base)]/40">
                No active records in this category.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}