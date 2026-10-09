import React from 'react';
import {
  Copy,
  Check,
  Terminal,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

const formatTimestamp = (isoString) => {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return isoString;
  }
};

const AuditLogTable = ({
  filteredLogs = [],
  isLoading = false,
  onSelectLog,
  onCopyHash,
  copiedHash,
  tableRowsRef,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] shadow-[0_10px_30px_rgba(48,48,48,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left font-sans text-xs sm:text-xs md:text-sm 2xl:text-base">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#E6E2D8] bg-[#F7F5F0]/70 text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
              <th scope="col" className="py-4 pl-6 pr-4">Record ID</th>
              <th scope="col" className="py-4 px-4">Timestamp (UTC)</th>
              <th scope="col" className="py-4 px-4">Action Directive</th>
              <th scope="col" className="py-4 px-4">Clearance Actor</th>
              <th scope="col" className="py-4 px-4">Origin IP</th>
              <th scope="col" className="py-4 px-4">Integrity Status</th>
              <th scope="col" className="py-4 px-4">Payload Digest</th>
              <th scope="col" className="py-4 pr-6 text-right">Inspect</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#E6E2D8]/60 text-[#303030]">
            {/* 1. Loading Skeleton State */}
            {isLoading ? (
              Array.from({ length: 7 }).map((_, index) => (
                <tr
                  key={`skeleton-${index}`}
                  className="animate-pulse bg-[#FFFFFF] transition-colors"
                >
                  <td className="py-4 pl-6 pr-4">
                    <div className="h-4 w-24 rounded bg-[#E6E2D8]/70" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 rounded bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-36 rounded-md bg-[#E6E2D8]/70" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-44 rounded bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 rounded bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-20 rounded-full bg-[#E6E2D8]/70" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-24 rounded-lg bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <div className="ml-auto h-7 w-16 rounded-xl bg-[#E6E2D8]/60" />
                  </td>
                </tr>
              ))
            ) : filteredLogs.length === 0 ? (
              /* 2. Empty State */
              <tr>
                <td colSpan={8} className="py-16 text-center text-[#707884]">
                  <Terminal className="mx-auto h-8 w-8 text-[#D5CEBF] 2xl:h-10 2xl:w-10" />
                  <span className="mt-3 block font-serif text-base font-normal text-[#303030] sm:text-lg 2xl:text-xl">
                    No Matching Audit Records Found
                  </span>
                  <span className="mt-1 block font-sans text-xs text-[#707884] sm:text-xs md:text-sm 2xl:text-base">
                    Adjust query filters or search terms to inspect other immutable log entries.
                  </span>
                </td>
              </tr>
            ) : (
              /* 3. Live Synchronized Rows */
              filteredLogs.map((log, index) => {
                const isSuccess = log.status === 'SUCCESS';
                const isWarning = log.status === 'WARNING' || log.status === 'FLAGGED';
                const isCritical =
                  log.status === 'CRITICAL' ||
                  log.status === 'FAILURE' ||
                  log.status === 'FAILED';

                const truncatedHash = log.hash
                  ? `${log.hash.slice(0, 6)}...${log.hash.slice(-4)}`
                  : 'N/A';

                return (
                  <tr
                    key={log.id || log._id || index}
                    ref={(el) => {
                      if (tableRowsRef?.current) {
                        tableRowsRef.current[index] = el;
                      }
                    }}
                    onClick={() => onSelectLog?.(log)}
                    className="group cursor-pointer transition-colors hover:bg-[#F7F5F0]/60"
                  >
                    {/* Record ID */}
                    <td className="py-4 pl-6 pr-4 font-mono font-medium text-[#707884] 2xl:text-sm">
                      {log.id}
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-4 text-[#707884] whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </td>

                    {/* Action Directive */}
                    <td className="py-4 px-4 font-medium text-[#303030]">
                      <span className="inline-block rounded-md border border-[#E6E2D8] bg-[#F7F5F0] px-2.5 py-1 text-[11px] sm:text-xs 2xl:text-sm">
                        {log.action}
                      </span>
                    </td>

                    {/* Actor Identity */}
                    <td
                      className="py-4 px-4 text-[#707884] truncate max-w-[160px] sm:max-w-[200px] md:max-w-[220px] 2xl:max-w-[280px]"
                      title={log.actor}
                    >
                      {log.actor}
                    </td>

                    {/* Origin IP */}
                    <td className="py-4 px-4 font-mono text-[11px] text-[#707884] sm:text-xs 2xl:text-sm whitespace-nowrap">
                      {log.ipAddress}
                    </td>

                    {/* Integrity Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
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
                        {isSuccess ? (
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        ) : isWarning ? (
                          <AlertTriangle className="h-3 w-3 text-amber-600 animate-pulse" />
                        ) : (
                          <ShieldAlert className="h-3 w-3 text-rose-600" />
                        )}
                        <span>{log.status}</span>
                      </span>
                    </td>

                    {/* Cryptographic SHA-256 Digest */}
                    <td
                      className="py-4 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onCopyHash?.(log.hash, log.id)}
                        className="group/hash flex items-center gap-1.5 rounded-lg border border-[#E6E2D8] bg-[#FFFFFF] px-2.5 py-1 font-mono text-[11px] text-[#707884] transition-all hover:border-[#D5CEBF] hover:bg-[#F7F5F0] hover:text-[#303030] 2xl:text-xs"
                        title="Copy complete SHA-256 digest"
                      >
                        {copiedHash === log.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 text-[#707884] group-hover/hash:text-[#303030]" />
                            <span>{truncatedHash}</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Inspect Trigger */}
                    <td className="py-4 pr-6 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectLog?.(log)}
                        className="inline-flex items-center gap-1 rounded-xl border border-transparent px-2.5 py-1 text-xs font-medium text-[#707884] transition-all hover:border-[#E6E2D8] hover:bg-[#F7F5F0] hover:text-[#E85D04] sm:text-xs 2xl:text-sm"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
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

export default AuditLogTable;