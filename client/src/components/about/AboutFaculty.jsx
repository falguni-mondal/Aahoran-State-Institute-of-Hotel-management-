import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import FacultyModal from './FacultyModal';
import { getPublicMentors } from '../../api/mentorApi';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================
   DEFAULT FALLBACK MENTORS
========================================= */
const DEFAULT_MENTORS = [
  {
    name: 'Dr. Santanu Dasgupta',
    role: 'Principal',
    image: '/nchmct-bg.webp',
    achievements: [
      'Ph.D. in Hospitality Administration',
      '25+ Years of Academic Leadership',
      'Published 15+ Research Papers',
    ],
  },
  {
    name: 'Mr. Ananda Shankar Ojha',
    role: 'Senior Lecturer',
    image: '/nchmct-bg.webp',
    achievements: [
      "Master's in Tourism Management",
      'Advanced Food Production Specialist',
      'Best Educator Award 2022',
    ],
  },
  {
    name: 'Ms. Banani Mondal',
    role: 'Senior Lecturer',
    image: '/nchmct-bg.webp',
    achievements: [
      'Expert in Accommodation Operations',
      'Certified Hospitality Trainer (CHT)',
    ],
  },
  {
    name: 'Mr. Somnath Bandyopadhyay',
    role: 'Lecturer',
    image: '/nchmct-bg.webp',
    achievements: [
      'F&B Management Specialist',
      'Ex-Manager at Taj Group',
      'Certified Mixologist',
    ],
  },
  {
    name: 'Mr. Saptarshi Banerjee',
    role: 'Lecturer',
    image: '/nchmct-bg.webp',
    achievements: [
      'Degree in Culinary Arts',
      '10+ Years in Luxury Cruise Lines',
    ],
  },
  {
    name: 'Mr. Soumen Sarkar',
    role: 'Lecturer',
    image: '/nchmct-bg.webp',
    achievements: [
      'Front Office Operations Expert',
      'Revenue Management Certified',
    ],
  },
  {
    name: 'Mr. Abhishek Bhattacharya',
    role: 'Assistant Lecturer',
    image: '/nchmct-bg.webp',
    achievements: [
      'Bakery & Confectionery Specialist',
      'Gold Medalist - NCHMCT',
    ],
  },
  {
    name: 'Mr. Shouribrata Chakraborty',
    role: 'Assistant Lecturer',
    image: '/nchmct-bg.webp',
    achievements: [
      'Hospitality Marketing Strategist',
      'Expert in Guest Relations',
    ],
  },
  {
    name: 'Mr. Suman Ghosh',
    role: 'Assistant Lecturer',
    image: '/nchmct-bg.webp',
    achievements: [
      'Advanced F&B Service',
      'Focuses on sustainable hospitality',
    ],
  },
];

export default function AboutFaculty() {
  const sectionRef = useRef(null);
  const location = useLocation();
  const lenis = useLenis();

  // State for live CMS data
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for the Continuous FLIP Modal
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ==========================================
  // 1. FETCH LIVE MENTORS FROM CMS API
  // ==========================================
  useEffect(() => {
    let isMounted = true;

    const fetchMentorsData = async () => {
      try {
        const data = await getPublicMentors();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setMentors(data);
          } else {
            setMentors(DEFAULT_MENTORS);
          }
        }
      } catch {
        if (isMounted) {
          setMentors(DEFAULT_MENTORS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMentorsData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // 2. CROSS-PAGE HASH ROUTING FIX 
  // ==========================================
  useEffect(() => {
    const isTargetHash =
      location.hash === '#faculty' || location.hash === '#mentors';

    if (isTargetHash && lenis && !isLoading) {
      const timer = setTimeout(() => {
        lenis.scrollTo(location.hash, {
          offset: -80,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.hash, lenis, isLoading]);

  // Grab the exact screen coordinates of the clicked image for the modal animation
  const handleCardClick = (e, mentor) => {
    const mask = e.currentTarget.querySelector('.faculty-img-mask');
    if (!mask) return;
    const rect = mask.getBoundingClientRect();
    setSelectedFaculty({ ...mentor, originRect: rect });
    setIsModalOpen(true);
  };

  // ==========================================
  // 3. GSAP SCROLLTRIGGER ORCHESTRATION
  // ==========================================
  useGSAP(
    () => {
      if (isLoading || mentors.length === 0) return;

      let mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          isMobile: '(max-width: 1023px)',
        },
        (context) => {
          let { isDesktop } = context.conditions;

          gsap.fromTo(
            '.faculty-header-item',
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.faculty-header-item',
                start: isDesktop ? 'top 80%' : 'top 90%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          const paragraphs = gsap.utils.toArray('.animated-paragraph');
          paragraphs.forEach((para) => {
            gsap.fromTo(
              para,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: para,
                  start: isDesktop ? 'top 85%' : 'top 95%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });

          const facultyGridTl = gsap.timeline({
            scrollTrigger: {
              trigger: '.faculty-grid',
              start: isDesktop ? 'top 90%' : 'top 95%',
            },
          });

          facultyGridTl
            .fromTo(
              '.faculty-img-mask',
              { clipPath: 'inset(100% 0% 0% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.6,
                ease: 'expo.inOut',
                stagger: 0.1,
              }
            )
            .fromTo(
              '.faculty-img',
              { scale: 1.3 },
              {
                scale: 1,
                duration: 1.6,
                ease: 'expo.inOut',
                stagger: 0.1,
                clearProps: 'transform',
              },
              '-=1.6'
            )
            .fromTo(
              '.faculty-info',
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
              },
              '-=1.2'
            );
        }
      );

      // Recalculate ScrollTrigger measurements after elements render
      ScrollTrigger.refresh();

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [mentors, isLoading] }
  );

  return (
    <section
      id="faculty"
      ref={sectionRef}
      className="relative w-full border-y border-[var(--primary-base)]/10 bg-[var(--background)] pt-12 pb-32 text-[var(--text-main)] md:pt-16 md:pb-40 lg:pt-20 lg:pb-48"
    >
      {/* GLOBAL MODAL RENDER */}
      <FacultyModal
        isOpen={isModalOpen}
        faculty={selectedFaculty}
        onClose={() => setIsModalOpen(false)}
        onExited={() => setSelectedFaculty(null)}
      />

      <div className="mx-auto w-full max-w-[1800px] px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mb-16 flex flex-col justify-between gap-10 md:mb-24 lg:flex-row lg:items-end">
          <div className="flex flex-col lg:max-w-2xl xl:max-w-3xl">
            <div className="faculty-header-item">
              <span className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--accent)] md:text-xs lg:mb-6">
                Our Mentors
              </span>
              <h2 className="head-txt mb-8 text-5xl leading-[0.95] tracking-tighter md:text-6xl lg:mb-10 lg:text-7xl xl:text-8xl">
                Academic <br className="hidden md:block" /> Leadership
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              <p className="animated-paragraph text-justify text-base font-light leading-[1.7] text-[var(--text-main)]/80 md:text-lg lg:text-xl">
                The mentors are exposed in direct teaching skills, they are well
                versed to design the training program and will be able to
                transfer the knowledge to the students.
              </p>
              <p className="animated-paragraph text-justify text-base font-light leading-[1.7] text-[var(--text-main)]/80 md:text-lg lg:text-xl">
                The mentors are also keeping updated information about the
                industry, its changes and modify the teaching accordingly. They
                are also involved in Research & Development producing journals
                and periodicals and be able to provide necessary guidance to the
                students.
              </p>
            </div>
          </div>
        </div>

        {/* MENTORS GRID */}
        <div className="faculty-grid grid grid-cols-1 gap-x-8 gap-y-16 border-t border-[var(--primary-base)]/15 pt-16 sm:grid-cols-2 md:pt-20 lg:grid-cols-3 lg:gap-x-12 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`mentor-skeleton-${index}`}
                  className="flex animate-pulse flex-col"
                >
                  <div className="aspect-[3/4] w-full rounded-sm bg-[var(--primary-base)]/10" />
                  <div className="mt-6 h-5 w-3/4 rounded bg-[var(--primary-base)]/10" />
                  <div className="my-2 h-[1px] w-6 bg-[var(--primary-base)]/15" />
                  <div className="h-4 w-1/2 rounded bg-[var(--primary-base)]/10" />
                </div>
              ))
            : mentors.map((mentor, index) => {
                const isCurrentlyOpen =
                  isModalOpen && selectedFaculty?.name === mentor.name;

                return (
                  <div
                    key={mentor._id || mentor.name || index}
                    onClick={(e) => handleCardClick(e, mentor)}
                    className="faculty-card group flex cursor-pointer flex-col"
                  >
                    <div className="faculty-img-mask relative mb-6 aspect-[3/4] w-full overflow-hidden rounded-sm bg-[var(--primary-base)]/5 will-change-transform">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className={`faculty-img h-full w-full object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-105 group-hover:grayscale-0 ${
                          isCurrentlyOpen
                            ? 'opacity-0'
                            : 'opacity-90 group-hover:opacity-100'
                        }`}
                      />
                      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.05)] transition-opacity duration-500 group-hover:opacity-0" />

                      {/* Micro-interaction Hover Badge */}
                      <div className="pointer-events-none absolute bottom-4 left-4 translate-y-4 rounded-sm bg-[var(--background)]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)] opacity-0 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                        View Profile
                      </div>
                    </div>

                    <div className="faculty-info flex flex-col transition-transform duration-500 will-change-transform group-hover:translate-x-2">
                      <h3 className="mb-1 text-lg font-semibold tracking-tight text-[var(--text-main)] transition-colors duration-300 group-hover:text-[var(--accent)] md:text-xl xl:text-[1.4rem]">
                        {mentor.name}
                      </h3>
                      <div className="mt-1 mb-2 h-[1px] w-4 bg-[var(--primary-base)] transition-all duration-500 group-hover:w-8 group-hover:bg-[var(--accent)]" />
                      <span className="text-sm text-[var(--text-main)]/60 md:text-base">
                        {mentor.role}
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