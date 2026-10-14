import React from 'react';
import {
  Bell,
  Sparkles,
  Eye,
  EyeOff,
  ExternalLink,
  Edit3,
  Trash2,
} from 'lucide-react';

export const CATEGORY_BADGE_MAP = {
  student: 'Student Directives',
  exam: 'Examinations',
  office: 'Office Circulars',
  placement: 'Training & Placement',
  tender: 'Tender Notices',
  recruitment: 'Recruitment',
};

const NoticeRosterTable = ({
  filteredNotices = [],
  isLoading = false,
  onEditNotice,
  onDeleteNotice,
  onQuickToggle,
  togglingId = null,
  deletingId = null,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] shadow-[0_10px_30px_rgba(48,48,48,0.03)]">
      {/* Explicit overflow-y-hidden prevents transient vertical scrollbars */}
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full min-w-[920px] text-left font-sans text-xs sm:text-xs md:text-sm 2xl:text-base">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#E6E2D8] bg-[#F7F5F0]/70 text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
              <th scope="col" className="py-4 pl-6 pr-4">Record ID</th>
              <th scope="col" className="py-4 px-4">Publish Date</th>
              <th scope="col" className="py-4 px-4">Notice Headline</th>
              <th scope="col" className="py-4 px-4">Category</th>
              <th scope="col" className="py-4 px-4">New Badge</th>
              <th scope="col" className="py-4 px-4">Visibility</th>
              <th scope="col" className="py-4 px-4">Document</th>
              <th scope="col" className="py-4 pr-6 text-right">Directive</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#E6E2D8]/60 text-[#303030]">
            {/* 1. Loading Skeleton Rows */}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={`notice-skeleton-${index}`}
                  className="animate-pulse bg-[#FFFFFF]"
                >
                  <td className="py-4 pl-6 pr-4">
                    <div className="h-4 w-20 rounded bg-[#E6E2D8]/70" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 rounded bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-64 rounded bg-[#E6E2D8]/70" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-28 rounded-lg bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-24 rounded-full bg-[#E6E2D8]/70" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-24 rounded-full bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-24 rounded-lg bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <div className="ml-auto h-7 w-28 rounded-xl bg-[#E6E2D8]/60" />
                  </td>
                </tr>
              ))
            ) : filteredNotices.length === 0 ? (
              /* 2. Empty State */
              <tr>
                <td colSpan={8} className="py-16 text-center text-[#707884]">
                  <Bell className="mx-auto h-8 w-8 text-[#D5CEBF] 2xl:h-10 2xl:w-10" />
                  <span className="mt-3 block font-serif text-base font-normal text-[#303030] sm:text-lg 2xl:text-xl">
                    No Matching Notice Records Found
                  </span>
                  <span className="mt-1 block font-sans text-xs text-[#707884] sm:text-xs md:text-sm 2xl:text-base">
                    Adjust category filters or publish a new official circular using the button above.
                  </span>
                </td>
              </tr>
            ) : (
              /* 3. Live Synchronized Rows */
              filteredNotices.map((notice, index) => {
                const targetId = notice._id || notice.id;
                const isDeleting = deletingId === targetId;
                const isTogglingNew = togglingId === `${targetId}-isNew`;
                const isTogglingActive = togglingId === `${targetId}-isActive`;

                const displayCode =
                  notice.recordCode ||
                  (targetId
                    ? `NTC-${targetId.toString().slice(-4).toUpperCase()}`
                    : `NTC-${String(index + 1).padStart(3, '0')}`);

                return (
                  <tr
                    key={targetId || index}
                    className="group transition-colors hover:bg-[#F7F5F0]/60"
                  >
                    {/* Record ID */}
                    <td className="py-4 pl-6 pr-4 font-mono font-medium text-[#707884] whitespace-nowrap 2xl:text-sm">
                      {displayCode}
                    </td>

                    {/* Publish Date */}
                    <td className="py-4 px-4 font-mono text-xs text-[#303030] whitespace-nowrap sm:text-xs md:text-sm 2xl:text-base">
                      {notice.date}
                    </td>

                    {/* Notice Headline */}
                    <td className="py-4 px-4 font-medium text-[#303030] max-w-[240px] sm:max-w-[300px] md:max-w-[340px] xl:max-w-[440px] 2xl:max-w-[540px]">
                      <p
                        className="line-clamp-2 leading-snug"
                        title={notice.title}
                      >
                        {notice.title}
                      </p>
                    </td>

                    {/* Category Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-lg border border-[#E6E2D8] bg-[#F7F5F0] px-2.5 py-1 text-[11px] font-medium text-[#303030] sm:text-xs 2xl:text-sm">
                        {CATEGORY_BADGE_MAP[notice.categoryId] || notice.categoryId}
                      </span>
                    </td>

                    {/* Quick Toggle: New Update Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isTogglingNew}
                        onClick={() => onQuickToggle?.(notice, 'isNew')}
                        title="Click to toggle 'New Update' badge on public Notice Board"
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all sm:text-[11px] 2xl:text-xs disabled:opacity-50 ${
                          notice.isNew
                            ? 'border border-[#E85D04]/30 bg-[#E85D04]/10 text-[#E85D04]'
                            : 'border border-[#E6E2D8] bg-[#F7F5F0] text-[#707884] hover:text-[#303030]'
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{notice.isNew ? 'New Update' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Quick Toggle: Public Visibility */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isTogglingActive}
                        onClick={() => onQuickToggle?.(notice, 'isActive')}
                        title="Click to toggle public visibility"
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all sm:text-[11px] 2xl:text-xs disabled:opacity-50 ${
                          notice.isActive
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border border-amber-200 bg-amber-50 text-amber-800'
                        }`}
                      >
                        {notice.isActive ? (
                          <Eye className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-amber-600" />
                        )}
                        <span>{notice.isActive ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* PDF Document Link */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <a
                        href={notice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6E2D8] bg-[#FFFFFF] px-2.5 py-1 font-sans text-[11px] font-medium text-[#707884] transition-all hover:border-[#D5CEBF] hover:bg-[#F7F5F0] hover:text-[#E85D04] sm:text-xs 2xl:text-sm"
                        title={notice.fileName || 'Open PDF document in new tab'}
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Inspect PDF</span>
                      </a>
                    </td>

                    {/* Edit & Purge Actions */}
                    <td className="py-4 pr-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEditNotice?.(notice)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#303030] transition-all hover:border-[#E85D04] hover:bg-[#F7F5F0] hover:text-[#E85D04] sm:text-xs 2xl:text-sm"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteNotice?.(notice)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#707884] transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40 sm:text-xs 2xl:text-sm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{isDeleting ? 'Purging...' : 'Purge'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoticeRosterTable;