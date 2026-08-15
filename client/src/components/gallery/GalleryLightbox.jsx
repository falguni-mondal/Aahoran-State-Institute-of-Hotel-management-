import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function GalleryLightbox({ image, onClose }) {
  const overlayRef = useRef(null);
  const imgWrapperRef = useRef(null);
  const closeBtnRef = useRef(null);
  const captionRef = useRef(null);

  // 1. Lock Body Scroll when open
  useEffect(() => {
    if (image) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [image]);

  // 2. Escape Key Listener for Accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && image) triggerClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image]);

  // 3. Entrance Animation
  useGSAP(() => {
    if (image) {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      // Fade in the dark blurred background
      tl.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.6 }
      )
      // Scale up and fade in the image
      .fromTo(imgWrapperRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      )
      // Drift in the close button and caption
      .fromTo([closeBtnRef.current, captionRef.current],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.6"
      );
    }
  }, { dependencies: [image] });

  // 4. Smooth Exit Animation
  const triggerClose = () => {
    const tl = gsap.timeline({ 
      onComplete: onClose, // Only unmount component AFTER animation finishes
      defaults: { ease: 'power3.inOut' } 
    });

    tl.to([imgWrapperRef.current, closeBtnRef.current, captionRef.current], {
      scale: 0.98,
      opacity: 0,
      y: 10,
      duration: 0.4
    })
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.4
    }, "-=0.2");
  };

  // If no image is selected, don't render anything
  if (!image) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 md:p-8 lg:p-12"
      onClick={triggerClose} // Clicking the background closes it
    >
      
      {/* ==========================================
          MINIMALIST CLOSE BUTTON
      ========================================== */}
      <button 
        ref={closeBtnRef}
        onClick={(e) => {
          e.stopPropagation(); // Prevents double-firing from the background click
          triggerClose();
        }}
        className="absolute top-6 right-6 md:top-8 md:right-10 lg:top-10 lg:right-12 group flex items-center gap-3 cursor-pointer outline-none z-50"
      >
        <span className="font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5F5F5] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hidden md:block">
          Close
        </span>
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#F5F5F5]/20 flex items-center justify-center transition-colors duration-500 group-hover:bg-[#F5F5F5]/10 group-hover:border-[#F5F5F5]/40">
          <span className="absolute w-4 md:w-5 h-[1px] bg-[#F5F5F5] rotate-45 transition-transform duration-500 group-hover:rotate-[135deg]"></span>
          <span className="absolute w-4 md:w-5 h-[1px] bg-[#F5F5F5] -rotate-45 transition-transform duration-500 group-hover:-rotate-[135deg]"></span>
        </div>
      </button>

      {/* ==========================================
          IMAGE CONTAINER
      ========================================== */}
      <div 
        ref={imgWrapperRef}
        className="relative max-w-full max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Clicking the image itself prevents closing
      >
        {/* The high-res image */}
        <img 
          src={image.url} 
          alt={image.alt} 
          className="w-auto h-auto max-w-full max-h-[80vh] object-contain shadow-2xl shadow-black/50"
        />
        
        {/* Editorial Caption */}
        <div 
          ref={captionRef}
          className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-4"
        >
          <span className="w-6 h-[1px] bg-[#F5F5F5]/30"></span>
          <span className="font-sans text-[10px] md:text-[11px] font-medium tracking-[0.15em] uppercase text-[#F5F5F5]/70">
            {image.alt || "Campus Architecture"}
          </span>
          <span className="w-6 h-[1px] bg-[#F5F5F5]/30"></span>
        </div>
      </div>

    </div>
  );
}