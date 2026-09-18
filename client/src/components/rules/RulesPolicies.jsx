import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   NEW SUB-COMPONENT: UniformCard
   A highly premium, editorial mask-reveal 
   with parallax depth for the image transition.
========================================= */
const UniformCard = ({ frontSrc, alt }) => {
  const [isActive, setIsActive] = useState(false);
  
  const containerRef = useRef(null);
  const frontMaskRef = useRef(null);
  const frontImgRef = useRef(null);
  const backImgRef = useRef(null);

  const backSrc = frontSrc.replace('-front', '-back');
  const { contextSafe } = useGSAP({ scope: containerRef });

  // Set initial state for the back image so it's ready to scale down
  useGSAP(() => {
    gsap.set(backImgRef.current, { scale: 1.15, yPercent: -5 });
  }, { scope: containerRef });

  // The sleek Parallax Reveal Animation
  const toggleReveal = contextSafe((showBack) => {
    if (showBack) {
      // Reveal Back Image
      gsap.to(frontMaskRef.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" });
      gsap.to(frontImgRef.current, { scale: 1.1, yPercent: 5, duration: 1, ease: "expo.inOut" });
      gsap.to(backImgRef.current, { scale: 1, yPercent: 0, duration: 1, ease: "expo.inOut" });
    } else {
      // Restore Front Image
      gsap.to(frontMaskRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut" });
      gsap.to(frontImgRef.current, { scale: 1, yPercent: 0, duration: 1, ease: "expo.inOut" });
      gsap.to(backImgRef.current, { scale: 1.15, yPercent: -5, duration: 1, ease: "expo.inOut" });
    }
  });

  // Desktop Hover Handlers
  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) toggleReveal(true);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) toggleReveal(false);
  };

  // Mobile/Tablet Click Handler
  const handleMobileClick = () => {
    if (window.innerWidth < 1024) {
      const nextState = !isActive;
      setIsActive(nextState);
      toggleReveal(nextState);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full aspect-[3/4] md:aspect-[4/5] mb-8 relative overflow-hidden rounded-sm cursor-pointer lg:cursor-default group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMobileClick}
    >
      {/* BACK IMAGE LAYER (Always visible, sits at the bottom) */}
      <div className="absolute inset-0 w-full h-full bg-[#e8e8e8]">
        <img
          ref={backImgRef}
          src={backSrc}
          alt={`${alt} Back View`}
          className="w-full h-full object-cover object-center grayscale-[20%]"
        />
      </div>

      {/* FRONT IMAGE LAYER (Uses a GSAP clip-path to wipe away) */}
      <div
        ref={frontMaskRef}
        className="absolute inset-0 w-full h-full bg-[var(--background)] z-10"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <img
          ref={frontImgRef}
          src={frontSrc}
          alt={alt}
          className="w-full h-full object-cover object-center grayscale-[20%]"
        />
      </div>

      {/* Minimal UI Indicators */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none overflow-hidden">
        <div className="bg-[var(--background)]/90 backdrop-blur-md border border-[var(--primary-base)]/10 text-[var(--text-main)] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="hidden lg:block">Hover to view back</span>
          <span className="block lg:hidden">Tap to view back</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================
   POLICIES DATA
========================================= */
const policiesData = [
  {
    id: "attendance",
    title: "Attendance Rules",
    items: [
      <>The student is expected to attend 100% classes. However, as per NCHMCT and JNU norms, to appear in the end semester examinations, <strong className="font-semibold text-[var(--text-main)]">a minimum of 75% attendance is mandatory</strong>.</>,
      "Attendance at lectures, practical and tutorials shall be counted from the date of commencement of teaching.",
      "A shortage of attendance up to maximum 10% of the total working days may be condoned by the Head of the Institution on grounds of bonafide illness supported from a registered medical practitioner or any other sufficient reason, subject to the candidate being otherwise eligible to appear for the examination.",
      "Even if the National Council or the Head of the Institution has already accepted the examination application, collected the examination fee, and given the candidate an Examination Seat Number, the Head of the Institution can still cancel the application if the candidate does not meet the required conditions. This can be done at any time before the examination starts, and the candidate can be stopped from appearing in the examination."
    ]
  },
  {
    id: "uniform",
    title: "Uniform & Grooming",
    isSplit: true,
    boys: [
      "College black Trousers & white full sleeve shirts, black belt.",
      "The shirt should be tucked in. Sleeves of the shirt should never be rolled up.",
      "Well-polished Formal black shoes (Oxford black) and black socks.",
      "No piercings allowed.",
      "Tattoos not allowed.",
      "Hair should be neatly trimmed. No fancy hairstyles permitted.",
      "Should be cleanly shaven.",
      "Only steel/black straps allowed for Wrist Watches.",
      "Nails should be clipped."
    ],
    girls: [
      "College black Trousers & white full sleeve shirts, black belt.",
      "The shirt should be tucked in. Sleeves of the shirt should never be rolled up.",
      "Formal Oxford black shoes for Food Production classes. Black Ballerina shoes and socks for the rest of the classes.",
      "Hair should be tied in a bun with a black hairnet and black hairclips.",
      "Mehendi and tattoos are not allowed.",
      "Only one set of ear piercings (studs) allowed.",
      "Formal jewelery (bracelet/ring) can be worn, except for food production practical classes.",
      "Only steel/black straps allowed for Wrist Watches.",
      "Nails should be clipped."
    ]
  },
  {
    id: "fees",
    title: "Fee Structure",
    image: {
      src: "/fee-structure.webp",
      alt: "SIHM Durgapur Fee Structure",
      fileName: "SIHM_Fee_Structure.webp"
    },
    items: [
      "Fees are payable in advance. All fees can be payable through online Banking facility, demand draft, RTGS & NEFT, and UPI/QR. Cash and Cheque are not not accepted."
    ]
  },
  {
    id: "medical",
    title: "Medical Facilities",
    items: [
      "Standard First aid facility is available for the students.",
      "On call doctor availabe in case of any emergency."
    ]
  }
];

export default function RulesPolicies() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const sections = gsap.utils.toArray('.policy-section');
      const navLinks = gsap.utils.toArray('.nav-link');

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 50%", 
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) {
              navLinks.forEach(link => {
                link.classList.remove('text-[var(--accent)]', 'translate-x-4');
                link.classList.add('text-[var(--text-main)]/30');
              });

              navLinks[index].classList.remove('text-[var(--text-main)]/30');
              navLinks[index].classList.add('text-[var(--accent)]', 'translate-x-4');
            }
          }
        });
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--background)] text-[var(--text-main)] py-24 md:py-32 lg:py-48">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px] flex flex-col lg:flex-row gap-16 lg:gap-24 xl:gap-32">
        
        {/* =========================================
            LEFT COLUMN: Sticky Navigation Index
        ========================================= */}
        <div className="hidden lg:flex lg:w-3/12 xl:w-1/4 flex-col lg:sticky lg:top-40 lg:h-fit relative z-10">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-10 block">
            02 / Specific Policies
          </span>
          
          <nav className="flex flex-col gap-6">
            {policiesData.map((policy) => (
              <a 
                key={`nav-${policy.id}`}
                href={`#${policy.id}`}
                onClick={(e) => handleScroll(e, policy.id)}
                className="nav-link text-xl xl:text-2xl font-light tracking-tight text-[var(--text-main)]/30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[var(--accent)]"
              >
                {policy.title}
              </a>
            ))}
          </nav>
        </div>

        {/* =========================================
            RIGHT COLUMN: Content Sections
        ========================================= */}
        <div className="w-full lg:w-9/12 xl:w-3/4 flex flex-col text-justify">
          
          <span className="lg:hidden text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-12 block">
            02 / Specific Policies
          </span>

          <div className="flex flex-col">
            {policiesData.map((policy) => (
              <div 
                key={policy.id} 
                id={policy.id}
                className="policy-section flex flex-col border-t border-[var(--primary-base)]/15 pt-12 pb-24 md:pt-16 md:pb-32"
              >
                
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tighter mb-10 md:mb-16">
                  {policy.title}
                </h3>

                {policy.isSplit ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
                    
                    {/* Boys Column */}
                    <div className="flex flex-col">
                      <UniformCard 
                        frontSrc="/images/uniform/uniform-boy-front.webp" 
                        alt="Proper Uniform for Boys"
                      />
                      <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-[0.2em] text-[var(--text-main)]/50 mb-8 border-b border-[var(--primary-base)]/10 pb-4">
                        For Boys
                      </span>
                      <ul className="flex flex-col gap-6">
                        {policy.boys.map((item, idx) => (
                          <li key={`boy-${idx}`} className="flex items-start gap-4 text-base md:text-lg font-light text-[var(--text-main)]/80 leading-relaxed">
                            <span className="text-[var(--accent)] mt-1.5 opacity-60">—</span>
                            <p>{item}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Girls Column */}
                    <div className="flex flex-col">
                      <UniformCard 
                        frontSrc="/images/uniform/uniform-girl-front.webp" 
                        alt="Proper Uniform for Girls"
                      />
                      <span className="font-sans font-bold text-xs xl:text-sm uppercase tracking-[0.2em] text-[var(--text-main)]/50 mb-8 border-b border-[var(--primary-base)]/10 pb-4">
                        For Girls
                      </span>
                      <ul className="flex flex-col gap-6">
                        {policy.girls.map((item, idx) => (
                          <li key={`girl-${idx}`} className="flex items-start gap-4 text-base md:text-lg font-light text-[var(--text-main)]/80 leading-relaxed">
                            <span className="text-[var(--accent)] mt-1.5 opacity-60">—</span>
                            <p>{item}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col">
                    {policy.image && (
                      <div className="mb-12 flex flex-col items-start">
                        <div className="w-full max-w-4xl overflow-hidden rounded-sm bg-[var(--primary-base)]/5 border border-[var(--primary-base)]/10 mb-6">
                          <img 
                            src={policy.image.src} 
                            alt={policy.image.alt} 
                            className="w-full h-auto object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                        <a 
                          href={policy.image.src} 
                          download={policy.image.fileName}
                          className="group flex items-center gap-3 bg-[var(--accent)] text-[var(--text-light)] px-6 md:px-8 py-3 md:py-4 rounded-sm cursor-pointer outline-none hover:bg-orange-600 transition-colors duration-300 shadow-[0_4px_14px_rgba(232,93,4,0.3)]"
                        >
                          <span className="font-sans font-bold text-[10px] md:text-xs uppercase tracking-[0.15em]">
                            Download Document
                          </span>
                          <svg 
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                          </svg>
                        </a>
                      </div>
                    )}

                    <ul className="flex flex-col gap-8 md:gap-10">
                      {policy.items.map((item, idx) => (
                        <li key={`item-${idx}`} className="flex items-start gap-4 md:gap-6">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2.5 shrink-0 opacity-60"></div>
                          <p className="text-lg md:text-xl lg:text-2xl font-light text-[var(--text-main)]/80 leading-[1.6] md:leading-[1.7]">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}