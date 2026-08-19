import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GalleryLightbox from './GalleryLightbox';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GalleryGrid({ images }) {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Global Mouse State
  const mousePos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const xMove = useRef(null);
  const yMove = useRef(null);

  // Initialize GSAP quickTo for extreme performance
  useEffect(() => {
    xMove.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3.out" });
    yMove.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3.out" });
  }, []);

  // Universal Hit-Test Function
  const checkHoverState = () => {
    if (!cursorRef.current || mousePos.current.x < 0) return;

    // Grab exactly what element is under the static/moving coordinates
    const el = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
    
    // Check if that element is inside a gallery item
    const isOverImage = el?.closest('.gallery-item');

    // If Lightbox is open, the overlay will block the hit-test naturally
    if (isOverImage) {
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
      xMove.current?.(e.clientX - 40); // Offset by 40px to center the 80x80 cursor
      yMove.current?.(e.clientY - 40);
      checkHoverState();
    };

    const handleScroll = () => {
      // Forces the check even if the mouse is totally static while scrolling
      checkHoverState();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Force reset cursor if Lightbox is opened
  useEffect(() => {
    if (selectedImage) {
      isHovering.current = false;
      gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3, overwrite: "auto" });
    }
  }, [selectedImage]);

  // Scroll Entrance Animations
  useGSAP(() => {
    const items = gsap.utils.toArray('.gallery-item');

    // 1. Entrance Reveal
    items.forEach((item) => {
      gsap.fromTo(item, 
        { opacity: 0, y: 60 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%", 
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 2. Subtle Organic Parallax
    let mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      gsap.to('.gallery-item:nth-child(even)', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-[var(--background)] z-20 py-16 md:py-24 lg:py-32 cursor-default">
      
      {/* 
          CUSTOM "VIEW" CURSOR 
          Fixed to viewport, ignores pointer events so it doesn't block hitting elements underneath
      */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-[80px] h-[80px] bg-[var(--accent)] text-[var(--text-light)] rounded-full flex items-center justify-center font-sans text-[10px] font-bold tracking-[0.2em] pointer-events-none z-[100] scale-0 opacity-0"
        style={{ transformOrigin: 'center center' }}
      >
        VIEW
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {/* ASYMMETRIC MASONRY LAYOUT */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 md:gap-8 lg:gap-12 w-full">
          {images.map((img) => (
            <div 
              key={img.id}
              onClick={() => setSelectedImage(img)}
              // Notice we have completely removed onMouseEnter/Leave here
              className="gallery-item group relative break-inside-avoid mb-5 md:mb-8 lg:mb-12 cursor-none overflow-hidden"
            >
              <div className="relative w-full h-full bg-[var(--text-main)]/5 overflow-hidden rounded-sm">
                
                <img 
                  src={img.url} 
                  alt={img.alt} 
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />

                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* LIGHTBOX COMPONENT */}
      <GalleryLightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      
    </section>
  );
}