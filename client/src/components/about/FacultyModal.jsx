import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function FacultyModal({ isOpen, onClose, onExited, faculty }) {
  const modalWrapperRef = useRef(null);
  const modalBgRef = useRef(null);
  const modalContentRef = useRef(null);
  const actualDpRef = useRef(null);
  const cloneImgRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useGSAP(() => {
    if (!faculty) return;
    const { originRect } = faculty;

    if (isOpen) {
      // 1. OPEN ANIMATION SEQUENCE
      gsap.set(modalWrapperRef.current, { autoAlpha: 1 });
      gsap.to(modalBgRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" });
      
      // Fade in the modal box
      gsap.fromTo(modalContentRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );

      // The Continuous Image Flight
      if (originRect && actualDpRef.current && cloneImgRef.current) {
        gsap.set(actualDpRef.current, { opacity: 0 }); // Hide the destination DP
        
        // Set the clone exactly over the original card image
        gsap.set(cloneImgRef.current, {
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          height: originRect.height,
          borderRadius: "2px", // Matches tailwind rounded-sm
          opacity: 1
        });

        // Wait 1 tick for the modal layout to render, then fly the clone to it
        requestAnimationFrame(() => {
          if (!actualDpRef.current) return;
          const targetRect = actualDpRef.current.getBoundingClientRect();
          
          gsap.to(cloneImgRef.current, {
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            borderRadius: "50%", // Morph into circle
            duration: 0.85,
            ease: "expo.inOut",
            onComplete: () => {
              gsap.set(actualDpRef.current, { opacity: 1 }); // Reveal real DP
              gsap.set(cloneImgRef.current, { opacity: 0 }); // Hide clone
            }
          });
        });
      }

      // Stagger the text in after the image arrives
      gsap.fromTo(".modal-stagger",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "expo.out", delay: 0.4 }
      );

    } else if (!isOpen && faculty) {
      // 2. CLOSE ANIMATION SEQUENCE
      if (originRect && actualDpRef.current && cloneImgRef.current) {
        const targetRect = actualDpRef.current.getBoundingClientRect();
        
        // Swap real DP for clone
        gsap.set(cloneImgRef.current, {
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
          borderRadius: "50%",
          opacity: 1
        });
        gsap.set(actualDpRef.current, { opacity: 0 });

        // Fly back to the card
        gsap.to(cloneImgRef.current, {
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          height: originRect.height,
          borderRadius: "2px",
          duration: 0.8,
          ease: "expo.inOut"
        });
      }

      // Fade out content and background, then unmount
      gsap.to(".modal-stagger", { x: 10, opacity: 0, duration: 0.3, ease: "power2.in" });
      gsap.to(modalContentRef.current, { opacity: 0, duration: 0.4, delay: 0.1 });
      gsap.to(modalBgRef.current, { 
        opacity: 0, 
        duration: 0.6, 
        delay: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(modalWrapperRef.current, { autoAlpha: 0 });
          if (onExited) onExited();
        }
      });
    }
  }, [isOpen, faculty]);

  // Micro-interaction for Close Button
  const closeBtnRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: closeBtnRef });
  
  const handleCloseHover = contextSafe(() => {
    gsap.to(closeBtnRef.current, { rotate: 90, scale: 1.1, duration: 0.4, ease: "back.out(1.5)" });
  });
  const handleCloseLeave = contextSafe(() => {
    gsap.to(closeBtnRef.current, { rotate: 0, scale: 1, duration: 0.4, ease: "power2.out" });
  });

  return (
    <div ref={modalWrapperRef} className="fixed inset-0 z-[100] flex items-center justify-center invisible opacity-0 p-5 md:p-8">
      
      {/* Blurred Dark Backdrop */}
      <div ref={modalBgRef} onClick={onClose} className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md opacity-0 cursor-pointer"></div>

      {/* 
          Modal Content Box 
          UPDATED: Switched to flex-row and increased max-width for the split structure 
      */}
      <div ref={modalContentRef} className="relative z-10 w-full max-w-3xl lg:max-w-4xl bg-[var(--background)] rounded-sm shadow-2xl p-8 md:p-12 lg:p-16 border border-[var(--primary-base)]/10 flex flex-col md:flex-row items-start gap-10 md:gap-14 lg:gap-16 opacity-0">
        
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          onMouseEnter={handleCloseHover}
          onMouseLeave={handleCloseLeave}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-2 outline-none cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {faculty && (
          <>
            {/* 
                LEFT COLUMN: The Invisible Target for the DP 
                UPDATED: Larger image size, flex-shrink-0 to maintain structure
            */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div ref={actualDpRef} className="relative w-36 h-36 md:w-48 md:h-48 opacity-0 mt-4 md:mt-0">
                <div className="absolute inset-0 rounded-full border border-[var(--accent)]/30 scale-110"></div>
                <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover rounded-full shadow-lg" />
              </div>
            </div>

            {/* 
                RIGHT COLUMN: Content 
                UPDATED: Everything is purely left-aligned now
            */}
            <div className="flex flex-col w-full text-left pt-2 md:pt-4">
              
              <h3 className="modal-stagger head-txt text-3xl md:text-4xl lg:text-5xl text-[var(--text-main)] mb-3 tracking-tight leading-none">
                {faculty.name}
              </h3>
              
              <span className="modal-stagger font-sans font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--accent)] mb-8 block">
                {faculty.role}
              </span>

              {/* Full Width Divider */}
              <div className="modal-stagger w-full h-[1px] bg-[var(--primary-base)]/10 mb-8"></div>

              <div className="modal-stagger w-full">
                <span className="font-sans font-semibold text-xs uppercase tracking-widest text-[var(--text-main)]/40 mb-6 block">
                  Key Achievements & Highlights
                </span>
                
                <ul className="flex flex-col gap-5 w-full">
                  {faculty.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0 opacity-80"></div>
                      <p className="font-sans text-sm md:text-base font-light text-[var(--text-main)]/80 leading-relaxed">
                        {achievement}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </>
        )}
      </div>

      {/* THE FLYING CLONE IMAGE (Sits completely outside the modal layout) */}
      {faculty && (
        <img 
          ref={cloneImgRef}
          src={faculty.image}
          alt="Transition Element"
          className="fixed z-[120] object-cover opacity-0 pointer-events-none shadow-2xl"
        />
      )}
    </div>
  );
}