import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Trash2,
  Users,
} from 'lucide-react';

const AdminRosterTable = ({
  filteredAdmins = [],
  currentUserEmail,
  isLoading = false,
  onRevokeAdmin,
  revokingId = null,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] shadow-[0_10px_30px_rgba(48,48,48,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left font-sans text-xs sm:text-xs md:text-sm 2xl:text-base">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#E6E2D8] bg-[#F7F5F0]/70 text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
              <th scope="col" className="py-4 pl-6 pr-4">Personnel ID</th>
              <th scope="col" className="py-4 px-4">Administrative Email</th>
              <th scope="col" className="py-4 px-4">Clearance Role</th>
              <th scope="col" className="py-4 px-4">MFA Posture</th>
              <th scope="col" className="py-4 px-4">Account Status</th>
              <th scope="col" className="py-4 px-4">Last Activity</th>
              <th scope="col" className="py-4 pr-6 text-right">Directive</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#E6E2D8]/60 text-[#303030]">
            {/* 1. Loading Skeleton Rows */}
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr
                  key={`roster-skeleton-${index}`}
                  className="animate-pulse bg-[#FFFFFF]"
                >
                  <td className="py-4 pl-6 pr-4">
                    <div className="h-4 w-20 rounded bg-[#E6E2D8]/70" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-48 rounded bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-24 rounded-full bg-[#E6E2D8]/70" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 rounded bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-20 rounded-full bg-[#E6E2D8]/70" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 rounded bg-[#E6E2D8]/60" />
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <div className="ml-auto h-7 w-20 rounded-xl bg-[#E6E2D8]/60" />
                  </td>
                </tr>
              ))
            ) : filteredAdmins.length === 0 ? (
              /* 2. Empty State */
              <tr>
                <td colSpan={7} className="py-16 text-center text-[#707884]">
                  <Users className="mx-auto h-8 w-8 text-[#D5CEBF] 2xl:h-10 2xl:w-10" />
                  <span className="mt-3 block font-serif text-base font-normal text-[#303030] sm:text-lg 2xl:text-xl">
                    No Administrative Records Found
                  </span>
                  <span className="mt-1 block font-sans text-xs text-[#707884] sm:text-xs md:text-sm 2xl:text-base">
                    Adjust query filters or onboard a new administrator using the button above.
                  </span>
                </td>
              </tr>
            ) : (
              /* 3. Live Synchronized Rows */
              filteredAdmins.map((admin, index) => {
                const targetId = admin._id || admin.id;
                const isSuperAdmin = admin.role === 'SuperAdmin';
                const isSelf = currentUserEmail && admin.email === currentUserEmail;
                const isRevoking = revokingId === targetId;

                const is2FAActive = admin.is2faEnabled;
                const isActive = admin.status === 'ACTIVE';

                return (
                  <tr
                    key={targetId || index}
                    className="group transition-colors hover:bg-[#F7F5F0]/60"
                  >
                    {/* Personnel ID */}
                    <td className="py-4 pl-6 pr-4 font-mono font-medium text-[#707884] 2xl:text-sm">
                      {admin.id || `ADM-${String(index + 1).padStart(3, '0')}`}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 font-medium text-[#303030]">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[180px] sm:max-w-[220px] md:max-w-[260px] 2xl:max-w-[320px]">
                          {admin.email}
                        </span>
                        {isSelf && (
                          <span className="rounded border border-[#E6E2D8] bg-[#F7F5F0] px-1.5 py-0.5 text-[10px] font-medium text-[#E85D04]">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-[11px] 2xl:text-xs ${
                          isSuperAdmin
                            ? 'border border-[#E85D04]/30 bg-[#E85D04]/10 text-[#E85D04]'
                            : 'border border-[#E6E2D8] bg-[#F7F5F0] text-[#303030]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSuperAdmin ? 'bg-[#E85D04]' : 'bg-[#707884]'
                          }`}
                        />
                        {admin.role}
                      </span>
                    </td>

                    {/* 2FA Posture */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 font-sans text-xs ${
                          is2FAActive ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>{is2FAActive ? 'Enforced' : 'Pending 2FA'}</span>
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-[11px] 2xl:text-xs ${
                          isActive
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border border-amber-200 bg-amber-50 text-amber-800'
                        }`}
                      >
                        {isActive ? (
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <ShieldAlert className="h-3 w-3 text-amber-600" />
                        )}
                        <span>{admin.status}</span>
                      </span>
                    </td>

                    {/* Last Activity */}
                    <td className="py-4 px-4 text-[#707884] whitespace-nowrap">
                      {admin.lastLogin || 'Never'}
                    </td>

                    {/* Action Directive */}
                    <td className="py-4 pr-6 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onRevokeAdmin?.(targetId)}
                        disabled={isSelf || isRevoking}
                        title={
                          isSelf
                            ? 'Cannot revoke your own active clearance session'
                            : 'Revoke administrator credentials'
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3 py-1.5 text-xs text-[#707884] transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40 sm:text-xs 2xl:text-sm"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{isRevoking ? 'Revoking...' : 'Revoke'}</span>
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

export default AdminRosterTable;