import React from 'react';
import { Search, ChevronRight } from 'lucide-react';

const AuditFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedAction,
  setSelectedAction,
  uniqueActions,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-5 md:p-6 lg:flex-row lg:items-center lg:justify-between xl:p-6 2xl:p-7">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707884] 2xl:h-5 2xl:w-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Record ID, Email, IP Address, or Action Directive..."
          className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-2.5 pl-10 pr-4 font-sans text-xs text-[#303030] placeholder-[#707884]/60 transition-all focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#E85D04]/30 sm:text-xs md:text-sm 2xl:py-3.5 2xl:pl-11 2xl:text-base"
        />
      </div>

      {/* Filter Pills & Select */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] p-1 font-sans text-[11px] sm:text-xs 2xl:text-sm">
          {['ALL', 'SUCCESS', 'FLAGGED', 'FAILURE'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all sm:px-3 sm:py-1 2xl:px-3.5 2xl:py-1.5 ${
                selectedStatus === status
                  ? 'border border-[#E6E2D8] bg-[#FFFFFF] text-[#E85D04] shadow-sm'
                  : 'text-[#707884] hover:text-[#303030]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Action Directive Select Dropdown */}
        <div className="relative">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="appearance-none rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] py-2 pl-3 pr-8 font-sans text-xs text-[#303030] transition-colors focus:border-[#E85D04] focus:outline-none focus:ring-1 focus:ring-[#E85D04]/30 sm:text-xs md:text-sm 2xl:py-2.5 2xl:pl-3.5 2xl:pr-9 2xl:text-base"
          >
            {uniqueActions.map((act) => (
              <option key={act} value={act}>
                {act === 'ALL' ? 'ALL ACTIONS' : act}
              </option>
            ))}
          </select>
          <ChevronRight className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-[#707884] 2xl:h-4 2xl:w-4" />
        </div>
      </div>
    </div>
  );
};

export default AuditFilterBar;