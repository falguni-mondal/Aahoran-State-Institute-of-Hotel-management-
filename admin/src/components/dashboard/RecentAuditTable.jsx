import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Terminal } from 'lucide-react';

const formatRecency = (timestamp) => {
  if (!timestamp) return 'Just now';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return timestamp;
  }
};

const RecentAuditTable = forwardRef(({ events = [], currentUserEmail }, ref) => {
  return (
    <div
      ref={ref}
      className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-6 md:p-8 lg:p-8 xl:p-9 2xl:p-10"
    >
      <div className="flex flex-col justify-between gap-3 border-b border-[#E6E2D8] pb-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-serif text-xl font-normal text-[#303030] sm:text-xl md:text-2xl 2xl:text-3xl">
            Real-Time <span className="italic text-[#E85D04]">Audit Stream</span>
          </h3>
          <p className="mt-0.5 font-sans text-xs text-[#707884] sm:text-xs md:text-sm 2xl:text-base">
            Cryptographically verified administrative transactions and silent token rotations
          </p>
        </div>

        <Link
          to="/audit-logs"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#E85D04] transition-colors hover:text-[#303030] hover:underline sm:text-xs md:text-sm 2xl:text-base"
        >
          <span>View Full Immutable Ledger</span>
          <ArrowUpRight className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left font-sans text-xs sm:text-xs md:text-sm 2xl:text-base">
          <thead>
            <tr className="border-b border-[#E6E2D8] text-[11px] uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
              <th scope="col" className="py-3.5 pr-4 font-semibold">Record ID</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Action Directive</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Clearance Identity</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Origin IP</th>
              <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
              <th scope="col" className="py-3.5 pl-4 text-right font-semibold">Recency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E2D8]/60 text-[#303030]">
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#707884]">
                  <Terminal className="mx-auto h-7 w-7 text-[#D5CEBF] 2xl:h-9 2xl:w-9" />
                  <span className="mt-2 block font-sans text-xs uppercase tracking-widest text-[#707884] 2xl:text-sm">
                    No transactions recorded in the stream
                  </span>
                </td>
              </tr>
            ) : (
              events.map((event) => {
                const displayActor =
                  (event.user === 'superadmin@sihm.gov.in' && currentUserEmail) ||
                  event.user ||
                  'System';

                const isSuccess = event.status === 'SUCCESS';
                const isWarning = event.status === 'WARNING';
                const isCritical = event.status === 'CRITICAL' || event.status === 'FAILURE';

                return (
                  <tr
                    key={event.id}
                    className="group transition-colors hover:bg-[#F7F5F0]/60"
                  >
                    <td className="py-4 pr-4 font-mono font-medium text-[#707884]">
                      {event.id}
                    </td>

                    <td className="py-4 px-4 font-medium text-[#303030]">
                      <span className="rounded-md border border-[#E6E2D8] bg-[#F7F5F0] px-2 py-1 text-[11px] sm:text-xs 2xl:text-sm">
                        {event.action}
                      </span>
                    </td>

                    <td
                      className="py-4 px-4 text-[#707884] truncate max-w-[140px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] 2xl:max-w-[280px]"
                      title={displayActor}
                    >
                      {displayActor}
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-[#707884] sm:text-xs 2xl:text-sm">
                      {event.ip}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-[11px] 2xl:text-xs ${
                          isSuccess
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                            : isWarning
                            ? 'border border-amber-200 bg-amber-50 text-amber-800'
                            : isCritical
                            ? 'border border-rose-200 bg-rose-50 text-rose-800'
                            : 'border border-[#E6E2D8] bg-[#F7F5F0] text-[#707884]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSuccess
                              ? 'bg-emerald-600'
                              : isWarning
                              ? 'bg-amber-600 animate-pulse'
                              : isCritical
                              ? 'bg-rose-600'
                              : 'bg-[#707884]'
                          }`}
                        />
                        {event.status}
                      </span>
                    </td>

                    <td className="py-4 pl-4 text-right text-[#707884]">
                      {formatRecency(event.timestamp)}
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
});

RecentAuditTable.displayName = 'RecentAuditTable';

export default RecentAuditTable;