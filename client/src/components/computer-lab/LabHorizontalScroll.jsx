import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const labFeatures = [
  {
    id: "01",
    title: "Capacity & Scale",
    desc: "The Institute has a well-equipped state-of-the-art Computer Lab which can accommodate at least thirty-five students at a time."
  },
  {
    id: "02",
    title: "Individual Focus",
    desc: "Individual PC stations help enable the faculty to focus on the learning outcomes of each student separately and to provide corrective coaching for the desired level of practice and perfection."
  },
  {
    id: "03",
    title: "A/V Integration",
    desc: "LCD Projectors, Multimedia, Overhead Projectors, CDs on each subject area – these are some of the audio-visual aids used extensively by the faculty to ensure a more effective learning environment for the students."
  },
  {
    id: "04",
    title: "Faculty Expertise",
    desc: "The members of faculty undergo training courses and programmes like Direct Training Skills, Design of Training, Training Needs Analysis, Computer courses offered by NCHMCT, etc to ensure a need-based training which can translate into meaningful and effective performance."
  }
];

export default function LabHorizontalScroll() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const getScrollAmount = () => -(trackRef.current.scrollWidth - window.innerWidth);

    gsap.to(trackRef.current, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${trackRef.current.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true 
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-[100svh] bg-[var(--background)] text-[var(--text-main)] overflow-hidden">
      
      <div className="h-full w-full flex items-center">
        
        <div 
          ref={trackRef} 
          className="flex flex-row w-max h-full will-change-transform"
        >
          {labFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="w-screen h-full shrink-0 flex items-center justify-center px-10 md:px-16 lg:px-24"
            >
              <div className="max-w-5xl w-full flex flex-col md:flex-row items-start gap-12 md:gap-16 lg:gap-24 relative mt-16 md:mt-0">
                
                <div className="absolute -top-20 md:-top-20 lg:-top-32 -left-2 md:-left-10 z-0 select-none pointer-events-none">
                  <span className="font-sans font-bold text-[120px] md:text-[180px] lg:text-[250px] leading-none tracking-tighter text-[var(--text-main)]/5">
                    {feature.id}
                  </span>
                </div>

                <div className="relative z-10 md:w-1/3 pt-6 md:pt-12">
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 block">
                    Core Feature
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
                    {feature.title}.
                  </h2>
                </div>

                <div className="relative z-10 md:w-2/3 md:pt-12">
                  <p className="text-lg md:text-2xl lg:text-3xl font-light leading-[1.6] md:leading-[1.7] text-[var(--text-main)]/80">
                    {feature.desc}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}