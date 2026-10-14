import React from 'react';
import { Search } from 'lucide-react';

export const NOTICE_CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'student', label: 'Student Directives' },
  { id: 'exam', label: 'Examinations' },
  { id: 'office', label: 'Office Circulars' },
  { id: 'placement', label: 'Training & Placement' },
  { id: 'tender', label: 'Tender Notices' },
  { id: 'recruitment', label: 'Recruitment' },
];

const NoticeFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-5 md:p-6 xl:flex-row xl:items-center xl:justify-between xl:p-6 2xl:p-7">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707884] 2xl:h-5 2xl:w-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notices by headline, record ID (NTC-XXXX), date, or category..."
          className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-2.5 pl-10 pr-4 font-sans text-xs text-[#303030] placeholder-[#707884]/60 transition-all focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#E85D04]/30 sm:text-xs md:text-sm 2xl:py-3.5 2xl:pl-11 2xl:text-base"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] p-1 font-sans text-[11px] sm:text-xs 2xl:text-sm">
        {NOTICE_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all sm:px-3 sm:py-1 2xl:px-3.5 2xl:py-1.5 ${
                isSelected
                  ? 'border border-[#E6E2D8] bg-[#FFFFFF] font-semibold text-[#E85D04] shadow-sm'
                  : 'text-[#707884] hover:text-[#303030]'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NoticeFilterBar;