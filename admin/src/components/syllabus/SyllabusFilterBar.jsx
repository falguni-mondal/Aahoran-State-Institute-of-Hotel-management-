import React from 'react';
import { Search } from 'lucide-react';

export const SYLLABUS_FILTERS = [
  { id: 'all', label: 'ALL SYLLABI' },
  { id: 'jnu', label: 'B.Sc. (JNU New)' },
  { id: 'ignou', label: 'B.Sc. (IGNOU Old)' },
  { id: 'diploma', label: 'Diploma Programmes' },
];

const SyllabusFilterBar = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-5 md:p-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707884]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search syllabus documents by title, affiliation (JNU / IGNOU), or ID..."
          className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-2.5 pl-10 pr-4 font-sans text-xs text-[#303030] placeholder-[#707884]/60 focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:outline-none md:text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] p-1 font-sans text-[11px] sm:text-xs">
        {SYLLABUS_FILTERS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`rounded-lg px-2.5 py-1 font-medium transition-all sm:px-3 ${
              activeFilter === tab.id
                ? 'border border-[#E6E2D8] bg-[#FFFFFF] font-semibold text-[#E85D04] shadow-sm'
                : 'text-[#707884] hover:text-[#303030]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SyllabusFilterBar;