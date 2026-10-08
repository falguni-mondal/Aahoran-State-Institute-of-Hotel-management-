import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const DEFAULT_AUDIT_EVENTS = [
  {
    id: 'AUD-8821',
    action: 'SESSION_ROTATED',
    resource: '/api/v1/auth/refresh',
    user: 'superadmin@sihm.gov.in',
    ip: '192.168.1.104',
    status: 'SUCCESS',
    timestamp: '2 mins ago',
  },
  {
    id: 'AUD-8820',
    action: '2FA_VERIFIED',
    resource: '/api/v1/auth/verify-2fa',
    user: 'superadmin@sihm.gov.in',
    ip: '192.168.1.104',
    status: 'SUCCESS',
    timestamp: '15 mins ago',
  },
  {
    id: 'AUD-8819',
    action: 'ADMIN_PROVISIONED',
    resource: '/api/v1/auth/create-admin',
    user: 'superadmin@sihm.gov.in',
    ip: '10.0.4.12',
    status: 'SUCCESS',
    timestamp: '1 hour ago',
  },
  {
    id: 'AUD-8818',
    action: 'LOGIN_ATTEMPT',
    resource: '/api/v1/auth/login',
    user: 'external_probe@sihm.gov.in',
    ip: '185.220.101.5',
    status: 'FLAGGED',
    timestamp: '3 hours ago',
  },
];

const RecentAuditTable = forwardRef(({ events = DEFAULT_AUDIT_EVENTS, currentUserEmail }, ref) => {
  return (
    <div
      ref={ref}
      className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-8 md:p-8 lg:p-8 xl:p-9 2xl:p-10"
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
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#E85D04] hover:underline 2xl:text-sm"
        >
          <span>View Full Immutable Ledger</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left font-sans text-xs sm:text-xs md:text-sm">
          <thead>
            <tr className="border-b border-[#E6E2D8] text-[11px] uppercase tracking-wider text-[#707884] 2xl:text-xs">
              <th className="py-3.5 pr-4 font-semibold">Record ID</th>
              <th className="py-3.5 px-4 font-semibold">Action Directive</th>
              <th className="py-3.5 px-4 font-semibold">Clearance Identity</th>
              <th className="py-3.5 px-4 font-semibold">Origin IP</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 pl-4 text-right font-semibold">Recency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E2D8]/60 text-[#303030]">
            {events.map((event) => {
              const displayActor =
                event.user === 'superadmin@sihm.gov.in' && currentUserEmail
                  ? currentUserEmail
                  : event.user;

              return (
                <tr
                  key={event.id}
                  className="group transition-colors hover:bg-[#F7F5F0]/60"
                >
                  <td className="py-4 pr-4 font-mono font-medium text-[#707884]">
                    {event.id}
                  </td>
                  <td className="py-4 px-4 font-medium text-[#303030]">
                    <span className="rounded-md border border-[#E6E2D8] bg-[#F7F5F0] px-2 py-1 text-[11px] 2xl:text-xs">
                      {event.action}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#707884]">{displayActor}</td>
                  <td className="py-4 px-4 font-mono text-[11px] text-[#707884] 2xl:text-xs">
                    {event.ip}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium 2xl:text-xs ${
                        event.status === 'SUCCESS'
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border border-amber-200 bg-amber-50 text-amber-800'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          event.status === 'SUCCESS'
                            ? 'bg-emerald-600'
                            : 'bg-amber-600'
                        }`}
                      />
                      {event.status}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-right text-[#707884]">
                    {event.timestamp}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

RecentAuditTable.displayName = 'RecentAuditTable';

export default RecentAuditTable;