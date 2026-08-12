import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ARPromise() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      // 1. Reveal the small label
      tl.fromTo('.promise-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
      
      // 2. Stagger fade up the large serif statement
      .fromTo('.promise-word',
        { opacity: 0, y: 30, rotateX: 10 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.1, ease: 'power3.out' },
        "-=0.4"
      )
      
      // 3. Fade up the reassuring paragraph
      .fromTo('.promise-text',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        "-=0.6"
      )
      
      // 4. Draw the signature organically (Vanilla GSAP stroke animation)
      .fromTo('.signature-path',
        { strokeDasharray: 1000, strokeDashoffset: 1000 },
        { strokeDashoffset: 0, duration: 2.5, ease: 'power2.inOut' },
        "-=0.5"
      )
      .fromTo('.signature-label',
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        "-=1.5"
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-24 md:py-32 lg:py-48 bg-[var(--background)] border-t border-[var(--primary-base)]/10 flex justify-center items-center overflow-hidden"
    >
      
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-[var(--primary-base)]/[0.02] pointer-events-none"></div>

      <div className="relative w-full max-w-5xl flex flex-col items-center text-center z-10">
        
        <span className="promise-label text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-8 md:mb-12 block">
          Our Guarantee to Parents & Students
        </span>
        
        {/* Elegant Serif Statement */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-[var(--primary-base)] leading-tight tracking-tight mb-12 md:mb-16 flex flex-wrap justify-center gap-x-3 md:gap-x-4 lg:gap-x-5">
          <span className="promise-word block">A</span>
          <span className="promise-word block">safe</span>
          <span className="promise-word block">haven</span>
          <span className="promise-word block">for</span>
          <span className="promise-word block italic text-[var(--accent)]">your</span>
          <span className="promise-word block">ambitions.</span>
        </h2>

        {/* Detailed Reassurance Paragraph */}
        <p className="promise-text text-base md:text-lg lg:text-xl font-light text-[var(--primary-base)]/75 leading-relaxed max-w-3xl mb-16 md:mb-24">
          Leaving home to pursue higher education is a monumental step. We understand the anxieties that come with it. At the State Institute of Hotel Management, Durgapur, the physical, mental, and emotional safety of our students is not just a priority—it is our absolute mandate. We maintain a strictly monitored, highly secure campus environment where ragging of any form is aggressively rooted out, ensuring our students can focus entirely on their craft and their future.
        </p>

        {/* Animated Signature / Stamp of Authority */}
        <div className="flex flex-col items-center">
          <svg 
            className="w-48 md:w-64 h-auto text-[var(--primary-base)]/80 mb-4" 
            viewBox="0 0 400 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              className="signature-path" 
              d="M10,80 C30,70 50,40 70,30 C90,20 100,50 120,60 C140,70 150,30 170,20 C190,10 200,60 220,70 C240,80 250,40 270,30 C290,20 310,70 330,80 C350,90 370,50 390,40" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              className="signature-path" 
              d="M50,90 L350,90" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeDasharray="4 4"
            />
          </svg>
          <span className="signature-label text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--primary-base)]/50">
            Office of the Principal, SIHM Durgapur
          </span>
        </div>

      </div>
      
    </section>
  );
}