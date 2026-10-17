import React from 'react';
import { Search } from 'lucide-react';

export const RESULT_PROGRAMS = [
  { id: 'all', label: 'ALL PROGRAMS' },
  { id: 'bsc', label: 'B.Sc. HHA' },
  { id: 'diploma', label: 'Diploma Courses' },
];

export const RESULT_SEMESTERS = [
  { id: 'all', label: 'All Semesters' },
  { id: '1', label: 'Sem I' },
  { id: '2', label: 'Sem II' },
  { id: '3', label: 'Sem III' },
  { id: '4', label: 'Sem IV' },
  { id: '5', label: 'Sem V' },
  { id: '6', label: 'Sem VI' },
];

const ResultFilterBar = ({
  searchQuery,
  setSearchQuery,
  programFilter,
  setProgramFilter,
  semesterFilter,
  setSemesterFilter,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-5 md:p-6 xl:flex-row xl:items-center xl:justify-between 2xl:p-7">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707884] 2xl:h-5 2xl:w-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search results by title, session (2023-24), record ID (RES-XXXX), or exam type..."
          className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-2.5 pl-10 pr-4 font-sans text-xs text-[#303030] placeholder-[#707884]/60 transition-all focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#E85D04]/30 sm:text-xs md:text-sm 2xl:py-3.5 2xl:pl-11 2xl:text-base"
        />
      </div>

      {/* Program & Semester Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] p-1 font-sans text-[11px] sm:text-xs 2xl:text-sm">
          {RESULT_PROGRAMS.map((prog) => {
            const isSelected = programFilter === prog.id;
            return (
              <button
                key={prog.id}
                type="button"
                onClick={() => setProgramFilter(prog.id)}
                className={`rounded-lg px-2.5 py-1 font-medium transition-all sm:px-3 2xl:px-3.5 2xl:py-1.5 ${
                  isSelected
                    ? 'border border-[#E6E2D8] bg-[#FFFFFF] font-semibold text-[#E85D04] shadow-sm'
                    : 'text-[#707884] hover:text-[#303030]'
                }`}
              >
                {prog.label}
              </button>
            );
          })}
        </div>

        {programFilter !== 'diploma' && (
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] px-3 py-2 font-sans text-xs font-medium text-[#303030] outline-none transition-all focus:border-[#E85D04] focus:bg-[#FFFFFF] 2xl:py-2.5 2xl:text-sm"
          >
            {RESULT_SEMESTERS.map((sem) => (
              <option key={sem.id} value={sem.id}>
                {sem.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default ResultFilterBar;