import React from 'react';
import { Search } from 'lucide-react';

export const MATERIAL_PROGRAMS = [
  { id: 'all', label: 'ALL RESOURCES' },
  { id: 'bsc', label: 'B.Sc. Programmes' },
  { id: 'diploma', label: 'Diploma Courses' },
];

export const BSC_SEMESTER_OPTIONS = [
  { id: 'all', label: 'All Semesters' },
  { id: 'sem-1', label: 'Semester I' },
  { id: 'sem-2', label: 'Semester II' },
  { id: 'sem-3', label: 'Semester III' },
  { id: 'sem-4', label: 'Semester IV' },
  { id: 'sem-5', label: 'Semester V' },
  { id: 'sem-6', label: 'Semester VI' },
];

const StudyMaterialFilterBar = ({
  searchQuery,
  setSearchQuery,
  programFilter,
  setProgramFilter,
  semesterFilter,
  setSemesterFilter,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-5 md:p-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707884]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search study materials by title, subject (Food Production), topic, or ID..."
          className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-2.5 pl-10 pr-4 font-sans text-xs text-[#303030] placeholder-[#707884]/60 focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:outline-none md:text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] p-1 font-sans text-[11px] sm:text-xs">
          {MATERIAL_PROGRAMS.map((prog) => (
            <button
              key={prog.id}
              type="button"
              onClick={() => setProgramFilter(prog.id)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all sm:px-3 ${
                programFilter === prog.id
                  ? 'border border-[#E6E2D8] bg-[#FFFFFF] font-semibold text-[#E85D04] shadow-sm'
                  : 'text-[#707884] hover:text-[#303030]'
              }`}
            >
              {prog.label}
            </button>
          ))}
        </div>

        {programFilter !== 'diploma' && (
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] px-3 py-2 font-sans text-xs font-medium text-[#303030] outline-none focus:border-[#E85D04] focus:bg-[#FFFFFF]"
          >
            {BSC_SEMESTER_OPTIONS.map((sem) => (
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

export default StudyMaterialFilterBar;