import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLenis } from 'lenis/react';

gsap.registerPlugin(useGSAP);

export default function FacultyModal({ isOpen, onClose, onExited, faculty }) {
  const lenis = useLenis();
  const modalWrapperRef = useRef(null);
  const modalBgRef = useRef(null);
  const modalContentRef = useRef(null);
  const actualDpRef = useRef(null);
  const cloneImgRef = useRef(null);

  // Lock Lenis smooth scroll and document body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = 'unset';
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, lenis]);

  // Handle ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useGSAP(
    () => {
      if (!faculty) return;
      const { originRect } = faculty;

      if (isOpen) {
        // 1. OPEN ANIMATION SEQUENCE
        gsap.set(modalWrapperRef.current, { autoAlpha: 1 });
        gsap.to(modalBgRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        });

        // Fade in the modal content container
        gsap.fromTo(
          modalContentRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.2 }
        );

        // Continuous Image Flight Morph
        if (originRect && actualDpRef.current && cloneImgRef.current) {
          gsap.set(actualDpRef.current, { opacity: 0 });

          // Position clone directly over the triggering card
          gsap.set(cloneImgRef.current, {
            top: originRect.top,
            left: originRect.left,
            width: originRect.width,
            height: originRect.height,
            borderRadius: '2px',
            opacity: 1,
          });

          requestAnimationFrame(() => {
            if (!actualDpRef.current) return;
            const targetRect = actualDpRef.current.getBoundingClientRect();

            gsap.to(cloneImgRef.current, {
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
              borderRadius: '50%',
              duration: 0.85,
              ease: 'expo.inOut',
              onComplete: () => {
                gsap.set(actualDpRef.current, { opacity: 1 });
                gsap.set(cloneImgRef.current, { opacity: 0 });
              },
            });
          });
        }

        // Stagger profile info in after the image arrives
        gsap.fromTo(
          '.modal-stagger',
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'expo.out',
            delay: 0.4,
          }
        );
      } else if (!isOpen && faculty) {
        // 2. CLOSE ANIMATION SEQUENCE
        if (originRect && actualDpRef.current && cloneImgRef.current) {
          const targetRect = actualDpRef.current.getBoundingClientRect();

          gsap.set(cloneImgRef.current, {
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: '50%',
            opacity: 1,
          });
          gsap.set(actualDpRef.current, { opacity: 0 });

          gsap.to(cloneImgRef.current, {
            top: originRect.top,
            left: originRect.left,
            width: originRect.width,
            height: originRect.height,
            borderRadius: '2px',
            duration: 0.8,
            ease: 'expo.inOut',
          });
        }

        gsap.to('.modal-stagger', {
          x: 10,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
        gsap.to(modalContentRef.current, {
          opacity: 0,
          duration: 0.4,
          delay: 0.1,
        });
        gsap.to(modalBgRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(modalWrapperRef.current, { autoAlpha: 0 });
            if (onExited) onExited();
          },
        });
      }
    },
    { scope: modalWrapperRef, dependencies: [isOpen, faculty] }
  );

  // Micro-interaction for Close Button
  const closeBtnRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: closeBtnRef });

  const handleCloseHover = contextSafe(() => {
    gsap.to(closeBtnRef.current, {
      rotate: 90,
      scale: 1.1,
      duration: 0.4,
      ease: 'back.out(1.5)',
    });
  });

  const handleCloseLeave = contextSafe(() => {
    gsap.to(closeBtnRef.current, {
      rotate: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
  });

  const mentorImage = faculty?.image || '/nchmct-bg.webp';
  const mentorAchievements = Array.isArray(faculty?.achievements)
    ? faculty.achievements
    : [];

  return (
    <div
      ref={modalWrapperRef}
      className="fixed inset-0 z-[100] flex items-center justify-center invisible opacity-0 p-4 sm:p-6 md:p-8 lg:p-12"
      role="dialog"
      aria-modal="true"
    >
      {/* Blurred Dark Backdrop */}
      <div
        ref={modalBgRef}
        onClick={onClose}
        className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md opacity-0 cursor-pointer"
      />

      {/* Modal Content Box */}
      <div
        ref={modalContentRef}
        className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col items-start gap-8 overflow-y-auto rounded-sm border border-[var(--primary-base)]/10 bg-[var(--background)] p-6 shadow-2xl opacity-0 sm:p-8 md:max-w-3xl md:flex-row md:gap-12 md:p-12 lg:max-w-4xl lg:gap-16 lg:p-16 2xl:max-w-5xl"
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          onMouseEnter={handleCloseHover}
          onMouseLeave={handleCloseLeave}
          className="absolute right-4 top-4 z-20 cursor-pointer p-2 text-[var(--text-muted)] outline-none transition-colors hover:text-[var(--accent)] md:right-6 md:top-6"
          aria-label="Close mentor modal"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {faculty && (
          <>
            {/* LEFT COLUMN: Target Circular DP */}
            <div className="mx-auto shrink-0 md:mx-0">
              <div
                ref={actualDpRef}
                className="relative mt-2 h-32 w-32 opacity-0 sm:h-36 sm:w-36 md:mt-0 md:h-44 md:w-44 lg:h-48 lg:w-48 2xl:h-52 2xl:w-52"
              >
                <div className="absolute inset-0 scale-110 rounded-full border border-[var(--accent)]/30" />
                <img
                  src={mentorImage}
                  alt={faculty.name}
                  className="h-full w-full rounded-full object-cover shadow-lg"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Profile Narrative */}
            <div className="flex w-full flex-col pt-1 text-left sm:pt-2 md:pt-4">
              <h3 className="modal-stagger head-txt mb-2 text-2xl leading-tight tracking-tight text-[var(--text-main)] sm:text-3xl md:mb-3 md:text-4xl lg:text-5xl">
                {faculty.name}
              </h3>

              <span className="modal-stagger mb-6 block font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] sm:text-xs md:mb-8">
                {faculty.role}
              </span>

              {/* Full Width Divider */}
              <div className="modal-stagger mb-6 h-[1px] w-full bg-[var(--primary-base)]/10 md:mb-8" />

              <div className="modal-stagger w-full">
                <span className="mb-4 block font-sans text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/40 md:mb-6">
                  Key Achievements & Highlights
                </span>

                {mentorAchievements.length > 0 ? (
                  <ul className="flex w-full flex-col gap-4 md:gap-5">
                    {mentorAchievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-3 sm:gap-4">
                        <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-80" />
                        <p className="font-sans text-sm font-light leading-relaxed text-[var(--text-main)]/80 md:text-base">
                          {achievement}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-sans text-xs italic text-[var(--text-main)]/50 sm:text-sm">
                    Distinguished academic mentor supporting practical training and professional hospitality excellence.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* THE FLYING CLONE IMAGE */}
      {faculty && (
        <img
          ref={cloneImgRef}
          src={mentorImage}
          alt="Transition Element"
          className="pointer-events-none fixed z-[120] object-cover opacity-0 shadow-2xl"
        />
      )}
    </div>
  );
}