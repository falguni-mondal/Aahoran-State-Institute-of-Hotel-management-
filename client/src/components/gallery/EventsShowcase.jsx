import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GalleryLightbox from './GalleryLightbox'; // Reusing our bulletproof lightbox!

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   MOCK DATA: EVENT CATEGORIES & IMAGES
========================================= */
const eventCategories = [
  { id: 'culinary', label: 'Culinary Training Program For Army Mess Cooks' },
  { id: 'sports', label: 'Sports Day' },
  { id: 'quiz', label: 'All India School Level Quiz Competition' },
  { id: 'award', label: 'Award and Recognition' },
  { id: 'expert', label: 'Expert Session' },
  { id: 'independence', label: 'Independence Day Celebrations 2018' },
  { id: 'tourism', label: 'World Tourism Day' },
];

const aspects = ['vertical', 'horizontal', 'square'];
const getAspect = (index) => aspects[index % aspects.length];

const eventsData = {
  culinary: Array.from({ length: 5 }).map((_, i) => ({ id: `culinary-${i}`, url: `/events/culinary_${i + 1}.webp`, alt: 'Army Mess Cooks Training', aspect: getAspect(i) })),
  sports: Array.from({ length: 4 }).map((_, i) => ({ id: `sports-${i}`, url: `/events/sports_${i + 1}.webp`, alt: 'Sports Day Event', aspect: getAspect(i + 1) })),
  quiz: Array.from({ length: 5 }).map((_, i) => ({ id: `quiz-${i}`, url: `/events/quiz_${i + 1}.webp`, alt: 'All India Quiz Competition', aspect: getAspect(i + 2) })),
  award: Array.from({ length: 4 }).map((_, i) => ({ id: `award-${i}`, url: `/events/award_${i + 1}.webp`, alt: 'Award and Recognition Ceremony', aspect: getAspect(i) })),
  expert: Array.from({ length: 4 }).map((_, i) => ({ id: `expert-${i}`, url: `/events/expert_${i + 1}.webp`, alt: 'Expert Guest Session', aspect: getAspect(i + 1) })),
  independence: Array.from({ length: 5 }).map((_, i) => ({ id: `ind-${i}`, url: `/events/independence_${i + 1}.webp`, alt: 'Independence Day 2018', aspect: getAspect(i + 2) })),
  tourism: Array.from({ length: 4 }).map((_, i) => ({ id: `tourism-${i}`, url: `/events/tourism_${i + 1}.webp`, alt: 'World Tourism Day', aspect: getAspect(i) })),
};

export default function EventsShowcase() {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Global Mouse State for the single bulletproof cursor
  const mousePos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const xMove = useRef(null);
  const yMove = useRef(null);

  // Initialize GSAP quickTo
  useEffect(() => {
    xMove.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3.out" });
    yMove.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3.out" });
  }, []);

  // Universal Hit-Test Function
  const checkHoverState = () => {
    if (!cursorRef.current || mousePos.current.x < 0) return;

    const el = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
    const isOverImage = el?.closest('.showcase-item');

    if (isOverImage && !selectedImage) {
      if (!isHovering.current) {
        isHovering.current = true;
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)", overwrite: "auto" });
      }
    } else {
      if (isHovering.current) {
        isHovering.current = false;
        gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "power3.in", overwrite: "auto" });
      }
    }
  };

  // Bind Global Listeners
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      xMove.current?.(e.clientX - 40);
      yMove.current?.(e.clientY - 40);
      checkHoverState();
    };
    
    const handleScroll = () => checkHoverState();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedImage]);

  // Entrance Animations for all images
  useGSAP(() => {
    const items = gsap.utils.toArray('.showcase-item');
    
    items.forEach((item) => {
      gsap.fromTo(item, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-[var(--background)] z-20 pb-32 cursor-default">
      
      {/* 
          SINGLE GLOBAL CURSOR 
          Because we aren't using transforms to shift massive wrappers anymore, 
          this position: fixed element will remain perfectly stable.
      */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-[80px] h-[80px] bg-[var(--accent)] text-[var(--text-main)] rounded-full flex items-center justify-center font-sans text-[10px] font-bold tracking-[0.2em] pointer-events-none z-[100] scale-0 opacity-0 mix-blend-difference"
        style={{ transformOrigin: 'center center' }}
      >
        VIEW
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {eventCategories.map((category, index) => {
          const serialNumber = String(index + 1).padStart(2, '0');
          const images = eventsData[category.id] || [];

          return (
            <div 
              key={category.id} 
              className="flex flex-col lg:flex-row items-start gap-12 lg:gap-24 py-16 md:py-24 border-t border-[var(--primary-base)]/15 first:border-t-0"
            >
              
              {/* ==========================================
                  LEFT: STICKY EVENT TYPOGRAPHY
              ========================================== */}
              <div className="w-full lg:w-[35%] shrink-0 lg:sticky lg:top-32 flex flex-col gap-6">
                <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                  Exhibition No. {serialNumber}
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight leading-[1.1] text-[var(--text-main)]">
                  {category.label}
                </h2>
              </div>

              {/* ==========================================
                  RIGHT: MASONRY EVENT GALLERY
              ========================================== */}
              <div className="w-full lg:w-[65%]">
                {/* We use standard CSS columns instead of Flex/Grid for true masonry without Javascript calculations */}
                <div className="columns-1 md:columns-2 gap-5 md:gap-8 w-full">
                  {images.map((img) => (
                    <div 
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className="showcase-item group relative break-inside-avoid mb-5 md:mb-8 cursor-none overflow-hidden"
                    >
                      <div className="relative w-full h-full bg-[var(--text-main)]/5 overflow-hidden rounded-sm">
                        <img 
                          src={img.url} 
                          alt={img.alt} 
                          loading="lazy"
                          className="w-full h-auto object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}

      </div>

      {/* LIGHTBOX COMPONENT */}
      <GalleryLightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      
    </section>
  );
}