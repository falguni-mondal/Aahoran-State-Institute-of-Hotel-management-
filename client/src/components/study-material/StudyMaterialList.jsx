import React, { useRef, useState, useMemo, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getPublicStudyMaterials } from '../../api/academicApi';

gsap.registerPlugin(ScrollTrigger);

/* =========================================
   FALLBACK MOCK DATA
========================================= */
const fallbackBscData = [
  {
    semester: 'Semester I',
    id: 'sem-1',
    subjects: [
      {
        id: 'fp1',
        title: 'Food Production',
        materials: [
          { id: 101, title: 'Introduction to Cookery', isNew: false, link: '#' },
          { id: 102, title: 'Culinary History', isNew: false, link: '#' },
        ],
      },
      {
        id: 'fbs1',
        title: 'Food & Beverage Service',
        materials: [
          { id: 103, title: 'Introduction to F&B Service', isNew: true, link: '#' },
          { id: 104, title: 'Types of Service Menus', isNew: false, link: '#' },
        ],
      },
    ],
  },
  {
    semester: 'Semester II',
    id: 'sem-2',
    subjects: [
      {
        id: 'fo2',
        title: 'Front Office',
        materials: [
          { id: 201, title: 'Front Office Operations Notes', isNew: true, link: '#' },
          { id: 202, title: 'Guest Cycle Management', isNew: false, link: '#' },
        ],
      },
      {
        id: 'hk2',
        title: 'Housekeeping',
        materials: [
          { id: 203, title: 'Accommodation Operations Notes', isNew: false, link: '#' },
          { id: 204, title: 'Cleaning Agents & Equipment', isNew: false, link: '#' },
        ],
      },
    ],
  },
  { semester: 'Semester III', id: 'sem-3', subjects: [] },
  { semester: 'Semester IV', id: 'sem-4', subjects: [] },
  { semester: 'Semester V', id: 'sem-5', subjects: [] },
  { semester: 'Semester VI', id: 'sem-6', subjects: [] },
];

const fallbackDiplomaData = {
  subjects: [
    {
      id: 'dfp',
      title: 'Diploma in Food Production',
      topics: [
        {
          id: 1001,
          title: 'Basic Culinary Skills',
          isNew: false,
          materials: [
            { id: 'm1', title: 'Module 1: Knife Skills & Cuts.pdf', link: '#' },
            { id: 'm2', title: 'Module 2: Stocks, Soups & Sauces.pdf', link: '#' },
          ],
        },
      ],
    },
    {
      id: 'dfbs',
      title: 'Diploma in F&B Service',
      topics: [
        {
          id: 1004,
          title: 'Beverage Knowledge',
          isNew: false,
          materials: [
            { id: 'm7', title: 'Classification of Beverages.pdf', link: '#' },
          ],
        },
      ],
    },
    {
      id: 'dfo',
      title: 'Diploma in Front Office',
      topics: [
        {
          id: 1006,
          title: 'Reservation Systems',
          isNew: false,
          materials: [
            { id: 'm10', title: 'Modes of Reservation.pdf', link: '#' },
          ],
        },
      ],
    },
  ],
};

// Helper: Transform flat DB records into the exact nested structure expected by the UI
const buildStructuredStudyData = (flatRecords) => {
  const bscSemesters = [
    { semester: 'Semester I', id: 'sem-1', subjectsMap: new Map() },
    { semester: 'Semester II', id: 'sem-2', subjectsMap: new Map() },
    { semester: 'Semester III', id: 'sem-3', subjectsMap: new Map() },
    { semester: 'Semester IV', id: 'sem-4', subjectsMap: new Map() },
    { semester: 'Semester V', id: 'sem-5', subjectsMap: new Map() },
    { semester: 'Semester VI', id: 'sem-6', subjectsMap: new Map() },
  ];

  const diplomaSubjectsMap = new Map();

  flatRecords.forEach((rec) => {
    if (rec.programType === 'bsc') {
      const semTarget = bscSemesters.find((s) => s.id === rec.semesterId);
      if (!semTarget) return;

      if (!semTarget.subjectsMap.has(rec.subjectId)) {
        semTarget.subjectsMap.set(rec.subjectId, {
          id: rec.subjectId,
          title: rec.subjectTitle,
          materials: [],
        });
      }
      semTarget.subjectsMap.get(rec.subjectId).materials.push({
        id: rec._id || rec.id,
        title: rec.title,
        isNew: Boolean(rec.isNew),
        link: rec.url || rec.link || '#',
      });
    } else if (rec.programType === 'diploma') {
      if (!diplomaSubjectsMap.has(rec.subjectId)) {
        diplomaSubjectsMap.set(rec.subjectId, {
          id: rec.subjectId,
          title: rec.subjectTitle,
          topicsMap: new Map(),
        });
      }
      const subjectEntry = diplomaSubjectsMap.get(rec.subjectId);
      const topicKey = (rec.topicTitle || 'Course Modules').trim();

      if (!subjectEntry.topicsMap.has(topicKey)) {
        subjectEntry.topicsMap.set(topicKey, {
          id: `${rec.subjectId}-${topicKey}`,
          title: topicKey,
          isNew: false,
          materials: [],
        });
      }
      const topicEntry = subjectEntry.topicsMap.get(topicKey);
      if (rec.isNew) topicEntry.isNew = true;

      topicEntry.materials.push({
        id: rec._id || rec.id,
        title: rec.title,
        link: rec.url || rec.link || '#',
      });
    }
  });

  const structuredBsc = bscSemesters.map((s) => ({
    semester: s.semester,
    id: s.id,
    subjects: Array.from(s.subjectsMap.values()),
  }));

  const structuredDiploma = {
    subjects: Array.from(diplomaSubjectsMap.values()).map((sub) => ({
      id: sub.id,
      title: sub.title,
      topics: Array.from(sub.topicsMap.values()),
    })),
  };

  return { structuredBsc, structuredDiploma };
};

/* =========================================
   SUB-COMPONENT: B.Sc Document List (Flat)
========================================= */
const DocumentList = ({ materials, activeTrigger }) => {
  const listRef = useRef(null);

  useGSAP(
    () => {
      if (!listRef.current) return;
      const rows = listRef.current.querySelectorAll('.material-row');
      if (rows.length === 0) return;

      gsap.fromTo(
        rows,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' }
      );
    },
    { scope: listRef, dependencies: [activeTrigger, materials] }
  );

  if (!materials || materials.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <span className="text-4xl text-[var(--text-main)]/10 mb-4">∅</span>
        <p className="font-sans text-sm md:text-base font-light tracking-tight text-[var(--text-main)]/40">
          No materials available for this selection.
        </p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="flex flex-col">
      {materials.map((item) => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="material-row group relative flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 md:py-6 border-b border-[var(--primary-base)]/10 cursor-pointer outline-none"
        >
          <div className="absolute -inset-x-4 md:-inset-x-6 inset-y-0 rounded-md transition-opacity duration-300 -z-10 bg-[var(--primary-base)]/5 opacity-0 group-hover:opacity-100"></div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 sm:mb-0 pr-6 w-full sm:w-auto relative z-10">
            <h3 className="text-base md:text-lg lg:text-xl font-light tracking-tight text-[var(--text-main)]/90 group-hover:text-[var(--text-main)] transition-colors duration-300">
              {item.title}
            </h3>
            {item.isNew && (
              <span className="shrink-0 border border-[var(--accent)] text-[var(--accent)] text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300 self-end sm:self-auto relative z-10">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-main)]">
              Download
            </span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[var(--primary-base)]/20 flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:border-transparent transition-all duration-300">
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-[var(--text-main)] group-hover:text-[var(--background)] transform group-hover:-rotate-45 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

/* =========================================
   SUB-COMPONENTS: Diploma Dropdown Lists
========================================= */
const DiplomaDropdownItem = ({ topic }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="material-row flex flex-col border-b border-[var(--primary-base)]/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex justify-between items-center py-5 md:py-6 cursor-pointer outline-none w-full text-left"
      >
        <div className="flex flex-wrap items-center gap-3 md:gap-4 pr-6 w-full sm:w-auto relative z-10">
          <h3
            className={`text-base md:text-lg lg:text-xl font-light tracking-tight transition-colors duration-300 ${
              isOpen
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-main)]/90 group-hover:text-[var(--text-main)]'
            }`}
          >
            {topic.title}
          </h3>
          {topic.isNew && (
            <span className="shrink-0 border border-[var(--accent)] text-[var(--accent)] text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>

        <div className="shrink-0 flex items-center justify-center relative z-10">
          <svg
            className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen
                ? 'rotate-180 text-[var(--accent)]'
                : 'text-[var(--primary-base)]/40 group-hover:text-[var(--text-main)]'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mb-6' : 'grid-rows-[0fr] opacity-0 mb-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 pl-4 md:pl-8 border-l border-[var(--primary-base)]/10 ml-2">
            {topic.materials.map((material) => (
              <a
                key={material.id}
                href={material.link}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="group/link flex items-center justify-between py-3 px-4 rounded-md hover:bg-[var(--primary-base)]/5 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-[var(--primary-base)]/40 group-hover/link:text-[var(--accent)] transition-colors duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-sans text-sm md:text-base text-[var(--text-main)]/80 group-hover/link:text-[var(--text-main)] transition-colors duration-300">
                    {material.title}
                  </span>
                </div>

                <svg className="w-4 h-4 text-[var(--primary-base)]/20 group-hover/link:text-[var(--accent)] transform group-hover/link:-translate-y-0.5 transition-all duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DiplomaDocumentList = ({ topics, activeTrigger }) => {
  const listRef = useRef(null);

  useGSAP(
    () => {
      if (!listRef.current) return;
      const rows = listRef.current.querySelectorAll('.material-row');
      if (rows.length === 0) return;

      gsap.fromTo(
        rows,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' }
      );
    },
    { scope: listRef, dependencies: [activeTrigger, topics] }
  );

  if (!topics || topics.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <span className="text-4xl text-[var(--text-main)]/10 mb-4">∅</span>
        <p className="font-sans text-sm md:text-base font-light tracking-tight text-[var(--text-main)]/40">
          No topics available for this selection.
        </p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="flex flex-col">
      {topics.map((topic) => (
        <DiplomaDropdownItem key={topic.id} topic={topic} />
      ))}
    </div>
  );
};

/* =========================================
   MAIN COMPONENT
========================================= */
export default function StudyMaterialList() {
  const containerRef = useRef(null);

  const [bscData, setBscData] = useState(fallbackBscData);
  const [diplomaData, setDiplomaData] = useState(fallbackDiplomaData);

  const [activeBscSemesterId, setActiveBscSemesterId] = useState('sem-1');
  const [activeBscSubjectId, setActiveBscSubjectId] = useState(
    fallbackBscData[0].subjects[0]?.id
  );
  const [activeDiplomaSubjectId, setActiveDiplomaSubjectId] = useState(
    fallbackDiplomaData.subjects[0]?.id
  );

  useEffect(() => {
    let isMounted = true;
    getPublicStudyMaterials().then((liveMaterials) => {
      if (!isMounted || !liveMaterials || liveMaterials.length === 0) return;

      const { structuredBsc, structuredDiploma } =
        buildStructuredStudyData(liveMaterials);

      setBscData(structuredBsc);
      const firstPopulatedSem =
        structuredBsc.find((s) => s.subjects.length > 0) || structuredBsc[0];
      if (firstPopulatedSem) {
        setActiveBscSemesterId(firstPopulatedSem.id);
        setActiveBscSubjectId(firstPopulatedSem.subjects[0]?.id || null);
      }

      if (structuredDiploma.subjects.length > 0) {
        setDiplomaData(structuredDiploma);
        setActiveDiplomaSubjectId(structuredDiploma.subjects[0]?.id || null);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeBscSemesterData = useMemo(
    () => bscData.find((sem) => sem.id === activeBscSemesterId),
    [bscData, activeBscSemesterId]
  );

  const activeBscMaterials = useMemo(() => {
    if (!activeBscSemesterData) return [];
    const subjectData = activeBscSemesterData.subjects.find(
      (sub) => sub.id === activeBscSubjectId
    );
    return subjectData ? subjectData.materials : [];
  }, [activeBscSemesterData, activeBscSubjectId]);

  const activeDiplomaTopics = useMemo(() => {
    const subjectData = diplomaData.subjects.find(
      (sub) => sub.id === activeDiplomaSubjectId
    );
    return subjectData ? subjectData.topics : [];
  }, [diplomaData, activeDiplomaSubjectId]);

  const handleSemesterChange = (semesterId) => {
    setActiveBscSemesterId(semesterId);
    const newSemesterData = bscData.find((sem) => sem.id === semesterId);
    if (newSemesterData && newSemesterData.subjects.length > 0) {
      setActiveBscSubjectId(newSemesterData.subjects[0].id);
    } else {
      setActiveBscSubjectId(null);
    }
  };

  useGSAP(
    () => {
      gsap.utils.toArray('.section-reveal').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-full bg-[var(--background)] text-[var(--text-main)] pt-20 md:pt-32 pb-24 md:pb-40 overflow-hidden border-t border-[var(--primary-base)]/10">
      <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* SECTION 1: B.Sc Degree Programmes */}
        <div className="section-reveal mb-24 lg:mb-32">
          <div className="mb-12 lg:mb-16">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
              Academic Resources
            </span>
            <h2 className="head-txt text-4xl md:text-5xl lg:text-7xl tracking-tighter text-[var(--text-main)] leading-none max-w-5xl">
              B.Sc Degree Programmes.
            </h2>
          </div>

          <div className="tabs-container flex flex-col gap-4 mb-8">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40">
              Filter by Semester
            </span>

            <div className="flex flex-wrap items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-2">
              {bscData.map((semester) => {
                const isActive = activeBscSemesterId === semester.id;
                return (
                  <button
                    key={semester.id}
                    onClick={() => handleSemesterChange(semester.id)}
                    className="group relative outline-none flex items-center py-2 cursor-pointer shrink-0"
                  >
                    <span
                      className={`text-xl md:text-2xl lg:text-3xl font-light tracking-tight transition-colors duration-500 ${
                        isActive
                          ? 'text-[var(--text-main)]'
                          : 'text-[var(--text-main)]/40 hover:text-[var(--text-main)]/70'
                      }`}
                    >
                      [ {semester.semester} ]
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent)]"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-20 items-start border-t border-[var(--primary-base)]/10 pt-10">
            <div className="w-full lg:w-3/12 xl:w-1/4 shrink-0 flex flex-col lg:sticky lg:top-32 mb-8 lg:mb-0">
              <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40 block mb-6">
                Select Subject
              </span>
              <nav className="flex flex-col gap-2 items-start w-full">
                {activeBscSemesterData?.subjects.map((subject) => {
                  const isActive = activeBscSubjectId === subject.id;
                  return (
                    <button
                      key={subject.id}
                      onClick={() => setActiveBscSubjectId(subject.id)}
                      className="group relative text-left outline-none w-full py-2.5 transition-all duration-300 flex items-center justify-between"
                    >
                      <div
                        className={`absolute -inset-x-4 md:-inset-x-6 inset-y-0 rounded-md transition-opacity duration-300 -z-10 ${
                          isActive
                            ? 'bg-[var(--primary-base)]/5 opacity-100'
                            : 'bg-[var(--primary-base)]/5 opacity-0 group-hover:opacity-100'
                        }`}
                      ></div>
                      <h3
                        className={`text-base md:text-lg font-light tracking-tight transition-colors duration-300 ${
                          isActive
                            ? 'text-[var(--text-main)]'
                            : 'text-[var(--text-main)]/50 group-hover:text-[var(--text-main)]/80'
                        }`}
                      >
                        {subject.title}
                      </h3>
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ml-4 transition-all duration-300 ${
                          isActive
                            ? 'bg-[var(--accent)] scale-100 opacity-100'
                            : 'bg-transparent scale-50 opacity-0'
                        }`}
                      ></span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="w-full lg:w-9/12 xl:w-3/4 flex flex-col">
              <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40 block mb-6">
                Available Materials
              </span>
              <DocumentList
                materials={activeBscMaterials}
                activeTrigger={`${activeBscSemesterId}-${activeBscSubjectId}`}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Diploma Courses */}
        <div className="section-reveal">
          <div className="mb-8 lg:mb-12">
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)] mb-4 block">
              Practical Resources
            </span>
            <h2 className="head-txt text-4xl md:text-5xl lg:text-7xl tracking-tighter text-[var(--text-main)] leading-none max-w-5xl">
              Diploma Courses.
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-20 items-start border-t border-[var(--primary-base)]/10 pt-10">
            <div className="w-full lg:w-3/12 xl:w-1/4 shrink-0 flex flex-col lg:sticky lg:top-32 mb-8 lg:mb-0">
              <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40 block mb-6">
                Select Subject
              </span>
              <nav className="flex flex-col gap-2 items-start w-full">
                {diplomaData.subjects.map((subject) => {
                  const isActive = activeDiplomaSubjectId === subject.id;
                  return (
                    <button
                      key={subject.id}
                      onClick={() => setActiveDiplomaSubjectId(subject.id)}
                      className="group relative text-left outline-none w-full py-2.5 transition-all duration-300 flex items-center justify-between"
                    >
                      <div
                        className={`absolute -inset-x-4 md:-inset-x-6 inset-y-0 rounded-md transition-opacity duration-300 -z-10 ${
                          isActive
                            ? 'bg-[var(--primary-base)]/5 opacity-100'
                            : 'bg-[var(--primary-base)]/5 opacity-0 group-hover:opacity-100'
                        }`}
                      ></div>
                      <h3
                        className={`text-base md:text-lg font-light tracking-tight transition-colors duration-300 ${
                          isActive
                            ? 'text-[var(--text-main)]'
                            : 'text-[var(--text-main)]/50 group-hover:text-[var(--text-main)]/80'
                        }`}
                      >
                        {subject.title}
                      </h3>
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ml-4 transition-all duration-300 ${
                          isActive
                            ? 'bg-[var(--accent)] scale-100 opacity-100'
                            : 'bg-transparent scale-50 opacity-0'
                        }`}
                      ></span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="w-full lg:w-9/12 xl:w-3/4 flex flex-col">
              <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-main)]/40 block mb-6">
                Course Modules & Downloads
              </span>
              <DiplomaDocumentList
                topics={activeDiplomaTopics}
                activeTrigger={`diploma-${activeDiplomaSubjectId}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}