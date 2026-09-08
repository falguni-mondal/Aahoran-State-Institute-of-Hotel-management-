import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   POLICIES DATA
========================================= */
const policiesData = [
  {
    id: "attendance",
    title: "Attendance Rules",
    items: [
      "The student is expected to attend 100% classes. However, below 75% attendance, the student is not eligible to appear for term end examination.",
      "Attendance at lectures, practical and tutorials shall be counted from the date of commencement of teaching after summer vacation.",
      "When on account of bonafide illness, supported by a Medical Certification from a Registered Medical Practitioner, produced by the candidate at the time of illness immediately thereafter, or for any other reason deemed sufficient by the Head of the Institution the total attendance of a candidate falls short, up to a maximum of 10 percent of the total working days, the Head of the Institution shall be competent to condone such deficiency in attendance and permit such a candidate of appearing for the examination if otherwise eligible.",
      "Notwithstanding the forwarding of forms of applications for admission to examination and payment of examinations fees through Examination Seat Numbers by the National Council, the Head of the Institution and allocation of Examination Seat Numbers by the National Council, the Head of the Institution shall be competent to withdraw such applications in respect of those candidates who do not fulfill conditions laid down, at any time before the commencement of examination and to disallow those candidates from appearing for the examination."
    ]
  },
  {
    id: "uniform",
    title: "Uniform & Grooming",
    // Custom render for the 50/50 symmetrical split
    isSplit: true,
    boys: [
      "College black Trousers & white full sleeve shirts, belt.",
      "The shirt should be tucked in. Sleeves of the shirt should never be rolled up.",
      "Well-polished Formal black shoes (Oxford black) and black socks.",
      "No piercings allowed.",
      "Tattoos not allowed.",
      "Hair should be neatly cropped. No fancy hairstyles permitted.",
      "Should be cleanly shaven.",
      "Nails should be clipped."
    ],
    girls: [
      "College black Trousers & white full sleeve shirts, belt.",
      "The shirt should be tucked in. Sleeves of the shirt should never be rolled up.",
      "Formal Oxford black shoes for Food Production classes. Black Ballerina shoes and socks for the rest of the classes.",
      "Hair should be tied in a bun with a black hairnet and black hairclips.",
      "Mehendi and tattoos not allowed.",
      "Only one set of ear piercings (studs) allowed.",
      "Formal jewelery (watch/bracelet/ring) can be worn, except for food production practical classes.",
      "Nails should be clipped."
    ]
  },
  {
    id: "fees",
    title: "Fee Structure",
    // NEW: Image configuration for the fee structure
    image: {
      src: "/fee-structure.webp",
      alt: "SIHM Durgapur Fee Structure",
      fileName: "SIHM_Fee_Structure.webp"
    },
    items: [
      "Fees are payable in advance. All fees are payable through online Banking facility, both digested & non digested (paid by auto-generated e-challan through Demand Draft), as available at the Institute's website www.wbsihm.in."
    ]
  },
  {
    id: "medical",
    title: "Medical Facilities",
    items: [
      "Working in the hotel industry demands not only a sound mind but a robust health also. To ensure that a student remains healthy all through his learning period, a qualified medical practitioner visits the Institute twice a week.",
      "The doctor is available at the hostels on the weekends too. In case of any sudden illness, he is always available on call.",
      "Standard First aid facility is also made available to the students in the practical labs."
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
          // Start when the top of the section hits the middle of the viewport
          start: "top 50%", 
          // End when the bottom of the section hits the middle of the viewport
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) {
              // Reset all links to inactive state
              navLinks.forEach(link => {
                link.classList.remove('text-[var(--accent)]', 'translate-x-4');
                link.classList.add('text-[var(--text-main)]/30');
              });

              // Apply active state to the current link
              navLinks[index].classList.remove('text-[var(--text-main)]/30');
              navLinks[index].classList.add('text-[var(--accent)]', 'translate-x-4');
            }
          }
        });
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  // Smooth scroll handler for the index links
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for the sticky header if you add one later, or just general padding
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--background)] text-[var(--text-main)] py-24 md:py-32 lg:py-48">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px] flex flex-col lg:flex-row gap-16 lg:gap-24 xl:gap-32">
        
        {/* =========================================
           LEFT COLUMN: Sticky Navigation Index (Desktop Only)
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
        <div className="w-full lg:w-9/12 xl:w-3/4 flex flex-col">
          
          {/* Mobile Label (Hidden on Desktop) */}
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
                
                {/* Section Title */}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tighter mb-10 md:mb-16">
                  {policy.title}.
                </h3>

                {/* =========================================
                   CONDITIONAL RENDER: Standard List vs Uniform Split
                ========================================= */}
                
                {policy.isSplit ? (
                  /* 50/50 Symmetrical Split for Uniforms */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
                    
                    {/* Boys Column */}
                    <div className="flex flex-col">
                      
                      {/* BOYS UNIFORM IMAGE */}
                      <div className="w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm mb-8 bg-[var(--primary-base)]/5 border border-[var(--primary-base)]/10">
                         <img 
                            src="/uniform-boy.webp" 
                            alt="Proper Uniform for Boys" 
                            className="w-full h-full object-cover object-center grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                         />
                      </div>

                      <span className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-[var(--text-main)]/50 mb-8 border-b border-[var(--primary-base)]/10 pb-4">
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

                      {/* GIRLS UNIFORM IMAGE */}
                      <div className="w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm mb-8 bg-[var(--primary-base)]/5 border border-[var(--primary-base)]/10">
                         <img 
                            src="/uniform-girl.webp" 
                            alt="Proper Uniform for Girls" 
                            className="w-full h-full object-cover object-center grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                         />
                      </div>

                      <span className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-[var(--text-main)]/50 mb-8 border-b border-[var(--primary-base)]/10 pb-4">
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
                  /* Standard List for Attendance, Fees, Medical */
                  <div className="flex flex-col">
                    {/* =========================================
                        NEW: IMAGE INJECTION LOGIC (For Fee Structure)
                    ========================================= */}
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
                          {/* Custom minimal bullet point */}
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