import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { useLenis } from 'lenis/react';
import FacultyModal from './FacultyModal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   FACULTY DATA 
========================================= */
const facultyData = [
  { name: "Dr. Santanu Dasgupta", role: "Principal", image: "/nchmct-bg.webp", achievements: ["Ph.D. in Hospitality Administration", "25+ Years of Academic Leadership", "Published 15+ Research Papers"] },
  { name: "Mr. Ananda Shankar Ojha", role: "Senior Lecturer", image: "/nchmct-bg.webp", achievements: ["Master's in Tourism Management", "Advanced Food Production Specialist", "Best Educator Award 2022"] },
  { name: "Ms. Banani Mondal", role: "Senior Lecturer", image: "/nchmct-bg.webp", achievements: ["Expert in Accommodation Operations", "Certified Hospitality Trainer (CHT)"] },
  { name: "Mr. Somnath Bandyopadhyay", role: "Lecturer", image: "/nchmct-bg.webp", achievements: ["F&B Management Specialist", "Ex-Manager at Taj Group", "Certified Mixologist"] },
  { name: "Mr. Saptarshi Banerjee", role: "Lecturer", image: "/nchmct-bg.webp", achievements: ["Degree in Culinary Arts", "10+ Years in Luxury Cruise Lines"] },
  { name: "Mr. Soumen Sarkar", role: "Lecturer", image: "/nchmct-bg.webp", achievements: ["Front Office Operations Expert", "Revenue Management Certified"] },
  { name: "Mr. Abhishek Bhattacharya", role: "Assistant Lecturer", image: "/nchmct-bg.webp", achievements: ["Bakery & Confectionery Specialist", "Gold Medalist - NCHMCT"] },
  { name: "Mr. Shouribrata Chakraborty", role: "Assistant Lecturer", image: "/nchmct-bg.webp", achievements: ["Hospitality Marketing Strategist", "Expert in Guest Relations"] },
  { name: "Mr. Suman Ghosh", role: "Assistant Lecturer", image: "/nchmct-bg.webp", achievements: ["Advanced F&B Service", "Focuses on sustainable hospitality"] },
];

export default function AboutFaculty() {
  const sectionRef = useRef(null);
  const location = useLocation();
  const lenis = useLenis();
  
  // States for the Continuous FLIP Modal
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ==========================================
  // CROSS-PAGE HASH ROUTING FIX 
  // ==========================================
  useEffect(() => {
    // If the URL has #faculty and Lenis is initialized
    if (location.hash === '#faculty' && lenis) {
      // 500ms delay ensures GSAP has finished painting the DOM and calculating heights
      const timer = setTimeout(() => {
        lenis.scrollTo('#faculty', { 
          offset: -80, // Adjust this offset if your navbar covers the heading
          duration: 1.5, 
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
        });
      }, 500); 

      return () => clearTimeout(timer);
    }
  }, [location.hash, lenis]);

  // Grab the exact screen coordinates of the clicked image for the modal animation
  const handleCardClick = (e, faculty) => {
    const rect = e.currentTarget.querySelector('.faculty-img-mask').getBoundingClientRect();
    setSelectedFaculty({ ...faculty, originRect: rect });
    setIsModalOpen(true);
  };

  useGSAP(() => {
    const paragraphs = gsap.utils.toArray('.split-paragraph');
    let splitInstances = [];

    paragraphs.forEach((para) => {
      const split = new SplitType(para, { types: 'lines', lineClass: 'split-line' });
      splitInstances.push(split);
      split.lines.forEach((line) => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'block'; 
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
    });

    let mm = gsap.matchMedia();
    mm.add({ isDesktop: "(min-width: 1024px)", isMobile: "(max-width: 1023px)" }, (context) => {
      let { isDesktop } = context.conditions;

      gsap.fromTo('.faculty-header-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.faculty-header-item', start: isDesktop ? "top 80%" : "top 90%", toggleActions: "play none none reverse" } }
      );

      splitInstances.forEach((split, index) => {
        gsap.fromTo(split.lines,
          { yPercent: 100 }, 
          { yPercent: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: paragraphs[index], start: isDesktop ? "top 85%" : "top 95%", toggleActions: "play none none reverse" } }
        );
      });

      const facultyGridTl = gsap.timeline({ scrollTrigger: { trigger: '.faculty-grid', start: isDesktop ? "top 90%" : "top 95%" } });

      facultyGridTl.fromTo('.faculty-img-mask',
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", stagger: 0.1 }
      );
      facultyGridTl.fromTo('.faculty-img',
        { scale: 1.3 },
        { scale: 1, duration: 1.6, ease: "expo.inOut", stagger: 0.1, clearProps: "transform" }, "-=1.6" 
      );
      facultyGridTl.fromTo('.faculty-info',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=1.2" 
      );
    });

    return () => { 
      mm.revert(); 
      splitInstances.forEach(instance => instance.revert()); 
    };
  }, { scope: sectionRef });

  return (
    <section id="faculty" ref={sectionRef} className="relative w-full bg-[var(--background)] text-[var(--text-main)] pt-12 pb-32 md:pt-16 md:pb-40 lg:pt-20 lg:pb-48 border-y border-[var(--primary-base)]/10">
      
      {/* GLOBAL MODAL RENDER */}
      <FacultyModal 
        isOpen={isModalOpen} 
        faculty={selectedFaculty} 
        onClose={() => setIsModalOpen(false)} 
        onExited={() => setSelectedFaculty(null)} 
      />

      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto max-w-[1800px]">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 md:mb-24">
          <div className="flex flex-col lg:max-w-2xl xl:max-w-3xl">
            <div className="faculty-header-item">
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4 lg:mb-6 block">
                Our Mentors
              </span>
              <h2 className="head-txt text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tighter mb-8 lg:mb-10">
                Academic <br className="hidden md:block"/> Leadership
              </h2>
            </div>
            
            <div className="flex flex-col gap-6">
              <p className="split-paragraph text-base md:text-lg lg:text-xl font-light text-[var(--text-main)]/80 leading-[1.7]">
                The mentors are exposed in direct teaching skills, they are well versed to design the training program and will be able to transfer the knowledge to the students.
              </p>
              <p className="split-paragraph text-base md:text-lg lg:text-xl font-light text-[var(--text-main)]/80 leading-[1.7]">
                The mentors are also keeping updated information about the industry, its changes and modify the teaching accordingly. They are also involved in Research & Development producing journals and periodicals and be able to provide necessary guidance to the students.
              </p>
            </div>
          </div>
        </div>

        <div className="faculty-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-16 gap-x-8 lg:gap-x-12 pt-16 md:pt-20 border-t border-[var(--primary-base)]/15">
          {facultyData.map((faculty, index) => {
            
            // Check if THIS specific card is currently open in the modal
            const isCurrentlyOpen = isModalOpen && selectedFaculty?.name === faculty.name;

            return (
              <div 
                key={index} 
                onClick={(e) => handleCardClick(e, faculty)}
                className="faculty-card group flex flex-col cursor-pointer"
              >
                
                <div className="faculty-img-mask relative w-full aspect-[3/4] mb-6 overflow-hidden rounded-sm bg-[var(--primary-base)]/5 will-change-transform">
                  <img 
                    src={faculty.image} 
                    alt={faculty.name} 
                    className={`faculty-img w-full h-full object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grayscale-0 group-hover:scale-105 will-change-transform ${isCurrentlyOpen ? 'opacity-0' : 'opacity-90 group-hover:opacity-100'}`}
                  />
                  <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.05)] pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>
                  
                  {/* Micro-interaction Hover Badge */}
                  <div className="absolute bottom-4 left-4 bg-[var(--background)]/90 backdrop-blur-sm text-[var(--text-main)] text-[10px] font-bold uppercase tracking-widest px-4 py-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-sm pointer-events-none">
                    View Profile
                  </div>
                </div>

                <div className="faculty-info flex flex-col will-change-transform transition-transform duration-500 group-hover:translate-x-2">
                  <h3 className="font-semibold text-lg md:text-xl xl:text-[1.4rem] text-[var(--text-main)] mb-1 tracking-tight group-hover:text-[var(--accent)] transition-colors duration-300">
                    {faculty.name}
                  </h3>
                  <div className="w-4 h-[1px] bg-[var(--primary-base)] mt-1 mb-2 group-hover:w-8 group-hover:bg-[var(--accent)] transition-all duration-500"></div>
                  <span className="text-sm md:text-base text-[var(--text-main)]/60">
                    {faculty.role}
                  </span>
                </div>
                
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}