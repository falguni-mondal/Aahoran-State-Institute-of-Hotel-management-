import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FBGallery() {
  const galleryRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // Only apply parallax on tablet and desktop where columns are side-by-side
    mm.add("(min-width: 768px)", () => {
      // Left column goes slightly slower
      gsap.to('.col-1', {
        yPercent: 15,
        ease: "none",
        scrollTrigger: { trigger: galleryRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
      });

      // Right column goes slightly faster (parallax effect)
      gsap.to('.col-2', {
        yPercent: -15,
        ease: "none",
        scrollTrigger: { trigger: galleryRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });

    return () => mm.revert();
  }, { scope: galleryRef });

  return (
    <section ref={galleryRef} className="w-full bg-[var(--background)] py-20 md:py-28 lg:py-36 xl:py-48 overflow-hidden">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">
        
        <div className="flex flex-col items-center text-center mb-16 md:mb-24 lg:mb-32">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 block">
            Visual Tasting
          </span>
          <h2 className="head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[var(--primary-base)] tracking-tighter">
            Gallery.
          </h2>
        </div>

        {/* Masonry Grid Setup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 lg:gap-12">
          
          {/* Column 1 */}
          <div className="col-1 flex flex-col gap-5 md:gap-8 lg:gap-12 md:-mt-12">
            <div className="w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-[var(--primary-base)]/5">
              <img src="/fb-plating.webp" alt="Culinary Plating" className="w-full h-full object-cover" />
            </div>
            <div className="w-full aspect-[4/3] overflow-hidden bg-[var(--primary-base)]/5">
              <img src="/fb-service.webp" alt="Service" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Column 2 */}
          <div className="col-2 flex flex-col gap-5 md:gap-8 lg:gap-12 md:pt-24">
            <div className="w-full aspect-[4/3] overflow-hidden bg-[var(--primary-base)]/5">
              <img src="/fb-ambience.webp" alt="Restaurant Ambience" className="w-full h-full object-cover" />
            </div>
            <div className="w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-[var(--primary-base)]/5">
              <img src="/fb-mixology.webp" alt="Mixology" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}