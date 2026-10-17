import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import NBDownloadButton from './NBDownloadButton';
import { getPublicNotices } from '../../api/noticeApi';

gsap.registerPlugin(ScrollTrigger);

/* =========================================
   CATEGORIES & FALLBACK MOCK DATA
========================================= */
const categories = [
  { id: 'all', label: 'All Notices' },
  { id: 'student', label: 'Student Directives' },
  { id: 'exam', label: 'Examinations' },
  { id: 'office', label: 'Office Circulars' },
  { id: 'placement', label: 'Training & Placement' },
  { id: 'tender', label: 'Tender Notices' },
  { id: 'recruitment', label: 'Recruitment' },
];

const fallbackNoticesData = [
  {
    id: 'fallback-2',
    categoryId: 'tender',
    date: '06/10/2026',
    title: 'Notice Inviting Quotation for Supply and Delivery of Students’ Uniform',
    isNew: true,
    url: '/files/notices/tenders/notice_Inviting_Quotation_for_Supply_and_Delivery_of_Students_Uniform.pdf',
  },
  {
    id: 'fallback-1',
    categoryId: 'tender',
    date: '05/10/2026',
    title: 'Cancellation of NIQ for making, supply and delivery of Students’ Uniform',
    isNew: true,
    url: '/files/notices/tenders/cancellation_Of_NIQ_for_making_supply_and_delivery_of_Students_Uniform.pdf',
  },
];

export default function NBContent() {
  const listRef = useRef(null);
  const lenis = useLenis();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || categories[0].id;
  const [hoveredNoticeId, setHoveredNoticeId] = useState(null);

  const [allNotices, setAllNotices] = useState([]);
  const [displayNotices, setDisplayNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live notices from Backend API on mount
  useEffect(() => {
    let isMounted = true;

    const loadNotices = async () => {
      setIsLoading(true);
      const liveNotices = await getPublicNotices('all');

      if (!isMounted) return;

      // If API call fails (null), fallback to local mock data; otherwise use live DB data
      const resolvedNotices =
        liveNotices !== null ? liveNotices : fallbackNoticesData;

      setAllNotices(resolvedNotices);
      setIsLoading(false);
    };

    loadNotices();

    return () => {
      isMounted = false;
    };
  }, []);

  // Re-compute displayed notices whenever activeCategory or allNotices changes
  useEffect(() => {
    const filtered =
      activeCategory === 'all'
        ? allNotices
        : allNotices.filter((notice) => notice.categoryId === activeCategory);

    setDisplayNotices(filtered);
  }, [activeCategory, allNotices]);

  // ==========================================
  // CROSS-PAGE HASH ROUTING FIX
  // ==========================================
  useEffect(() => {
    if (location.hash && lenis) {
      const timeoutId = setTimeout(() => {
        lenis.scrollTo(location.hash, {
          offset: -100,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [location.hash, lenis]);

  const handleCategoryChange = (newCategoryId) => {
    if (newCategoryId === activeCategory) return;

    const currentItems = listRef.current
      ? listRef.current.querySelectorAll('.nb-row')
      : [];

    if (listRef.current) {
      const currentHeight = listRef.current.offsetHeight;
      gsap.set(listRef.current, { minHeight: currentHeight });
    }

    if (lenis) {
      lenis.scrollTo('#notice-board-top', {
        offset: -100,
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
          setSearchParams(
            { category: newCategoryId },
            { replace: true, state: { noScroll: true } }
          );
        },
      });
    } else {
      setSearchParams(
        { category: newCategoryId },
        { replace: true, state: { noScroll: true } }
      );
    }
  };

  useGSAP(
    () => {
      if (!listRef.current || isLoading) return;
      const newItems = listRef.current.querySelectorAll('.nb-row');

      if (newItems.length > 0) {
        gsap.set(newItems, { y: 20, opacity: 0 });

        gsap.to(newItems, {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => {
            if (listRef.current) {
              gsap.set(listRef.current, { clearProps: 'minHeight' });
            }
            if (lenis) lenis.resize();
            ScrollTrigger.refresh();
          },
        });
      } else {
        gsap.set(listRef.current, { clearProps: 'minHeight' });
        if (lenis) lenis.resize();
        ScrollTrigger.refresh();
      }
    },
    { dependencies: [displayNotices, isLoading], scope: listRef }
  );

  return (
    <section
      id="notice-board-top"
      className="w-full bg-[var(--background)] relative z-20 pt-16 md:pt-24 lg:pt-32 pb-20 md:pb-28"
    >
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* FULL-WIDTH TOP BORDER FOR GRID ALIGNMENT */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-20 items-start border-t border-[var(--primary-base)]/10 pt-10">
          {/* ==========================================
              LEFT SIDE: STICKY TYPOGRAPHIC FILTERS
          ========================================== */}
          <div className="w-full lg:w-3/12 xl:w-1/4 shrink-0 lg:sticky lg:top-32 flex flex-col mb-8 lg:mb-0">
            <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40 block mb-6">
              Filter by Category
            </span>

            <nav className="flex flex-col gap-2 items-start w-full">
              {categories.map((cat) => {
                const isActive = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className="group relative text-left outline-none w-full py-2.5 transition-all duration-300 flex items-center justify-between"
                  >
                    {/* Absolute Bleed Background for Sidebar Filters */}
                    <div
                      className={`absolute -inset-x-4 md:-inset-x-6 inset-y-0 rounded-md transition-opacity duration-300 -z-10 ${
                        isActive
                          ? 'bg-[var(--primary-base)]/5 opacity-100'
                          : 'bg-[var(--primary-base)]/5 opacity-0 group-hover:opacity-100'
                      }`}
                    ></div>

                    {/* Adjusted text sizing and weight for active state */}
                    <h3
                      className={`tracking-tight transition-all duration-300 ${
                        isActive
                          ? 'text-lg md:text-xl font-medium text-[var(--text-main)]'
                          : 'text-base md:text-lg font-light text-[var(--text-main)]/50 group-hover:text-[var(--text-main)]/80'
                      }`}
                    >
                      {cat.label}
                    </h3>

                    {/* Indicator Dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ml-4 transition-all duration-300 ${
                        isActive
                          ? 'bg-[var(--accent)] scale-100 opacity-100'
                          : 'bg-transparent scale-50 opacity-0'
                      }`}
                    ></span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ==========================================
              RIGHT SIDE: CINEMATIC NOTICE LIST
          ========================================== */}
          <div className="w-full lg:w-9/12 xl:w-3/4 flex flex-col">
            <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40 block mb-6">
              Active Notices
            </span>

            <div
              ref={listRef}
              className="flex flex-col relative min-h-[300px] border-t border-[var(--primary-base)]/10"
            >
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={`nb-skeleton-${idx}`}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-8 md:py-10 lg:py-14 border-b border-[var(--primary-base)]/10 animate-pulse"
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-12 w-full">
                      <div className="w-24 h-5 bg-[var(--primary-base)]/10 rounded" />
                      <div className="w-full max-w-xl h-8 bg-[var(--primary-base)]/10 rounded" />
                    </div>
                    <div className="w-32 h-11 bg-[var(--primary-base)]/10 rounded-full shrink-0" />
                  </div>
                ))
              ) : displayNotices.length > 0 ? (
                displayNotices.map((notice, index) => {
                  const targetKey = notice._id || notice.id || index;
                  const serialNumber = String(index + 1).padStart(2, '0');
                  const isDimmed =
                    hoveredNoticeId !== null && hoveredNoticeId !== targetKey;

                  return (
                    <article
                      key={targetKey}
                      onMouseEnter={() => setHoveredNoticeId(targetKey)}
                      onMouseLeave={() => setHoveredNoticeId(null)}
                      className={`nb-row relative group flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 py-8 md:py-10 lg:py-14 xl:py-18 2xl:py-24 border-b border-[var(--primary-base)]/10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isDimmed ? 'opacity-30 blur-[1px]' : 'opacity-100 blur-0'
                      }`}
                    >
                      {/* Absolute Bleed Background */}
                      <div className="absolute -inset-x-4 md:-inset-x-6 inset-y-0 rounded-md transition-opacity duration-300 -z-10 bg-[var(--primary-base)]/5 opacity-0 group-hover:opacity-100 pointer-events-none"></div>

                      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[7rem] md:text-[12rem] font-bold text-[var(--text-main)]/[0.03] select-none pointer-events-none group-hover:scale-110 group-hover:text-[var(--text-main)]/[0.05] transition-all duration-700 ease-out origin-left -z-10">
                        {serialNumber}
                      </div>

                      <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-4 md:gap-12 w-full pr-0 md:pr-8">
                        <div className="shrink-0 md:w-32 flex flex-col gap-2 md:pt-2">
                          <span className="font-mono text-xs md:text-sm tracking-wider text-[var(--primary-base)]/70">
                            {notice.date}
                          </span>
                          {notice.isNew && (
                            <span className="w-fit px-2 py-0.5 border border-[var(--accent)] text-[var(--accent)] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                              New Update
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl md:text-2xl lg:text-3xl leading-[1.2] tracking-tight font-light text-[var(--text-main)] group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                          {notice.title}
                        </h2>
                      </div>

                      <div className="relative z-10 shrink-0 w-full md:w-auto md:pl-4 self-start md:self-auto">
                        <NBDownloadButton url={notice.url} />
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="py-16 md:py-24 text-center flex flex-col items-center justify-center border-b border-[var(--primary-base)]/10">
                  <span className="text-6xl md:text-8xl text-[var(--text-main)]/10 mb-6">
                    ∅
                  </span>
                  <p className="font-sans text-lg md:text-xl font-light tracking-tight text-[var(--text-main)]/40">
                    No active records in this category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}