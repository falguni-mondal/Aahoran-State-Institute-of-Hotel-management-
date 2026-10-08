import React, { forwardRef } from 'react';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Shield,
} from 'lucide-react';

const AdminRosterTable = forwardRef(
  ({ filteredAdmins = [], currentUserEmail, tableRowsRef }, ref) => {
    return (
      <div
        ref={ref}
        className="overflow-hidden rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] shadow-[0_10px_30px_rgba(48,48,48,0.03)]"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left font-sans text-xs sm:text-xs md:text-sm 2xl:text-base">
            <thead>
              <tr className="border-b border-[#E6E2D8] bg-[#F7F5F0]/60 text-[11px] uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
                <th className="py-4 pl-6 pr-4 font-semibold">Clearance ID</th>
                <th className="py-4 px-4 font-semibold">Administrative Email</th>
                <th className="py-4 px-4 font-semibold">Assigned Tier</th>
                <th className="py-4 px-4 font-semibold">MFA State</th>
                <th className="py-4 px-4 font-semibold">Activity State</th>
                <th className="py-4 px-4 font-semibold">Last Login</th>
                <th className="py-4 pl-4 pr-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E2D8]/60 text-[#303030]">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#707884]">
                    <Users className="mx-auto h-8 w-8 text-[#D5CEBF] 2xl:h-10 2xl:w-10" />
                    <span className="mt-2 block font-sans text-xs uppercase tracking-widest text-[#707884] 2xl:text-sm">
                      No administrative personnel match the query
                    </span>
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin, index) => {
                  const isSuper = admin.role === 'SuperAdmin';
                  const isCurrentSelf = admin.email === currentUserEmail;

                  return (
                    <tr
                      key={admin.id}
                      ref={(el) => {
                        if (tableRowsRef && tableRowsRef.current) {
                          tableRowsRef.current[index] = el;
                        }
                      }}
                      className="group transition-colors hover:bg-[#F7F5F0]/60"
                    >
                      {/* Clearance ID */}
                      <td className="py-4 pl-6 pr-4 font-mono font-medium text-[#707884]">
                        {admin.id}
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 font-medium text-[#303030]">
                        {admin.email}
                      </td>

                      {/* Clearance Tier */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-[11px] 2xl:text-xs ${
                            isSuper
                              ? 'border border-[#E85D04]/30 bg-[#E85D04]/10 text-[#E85D04]'
                              : 'border border-[#E6E2D8] bg-[#F7F5F0] text-[#707884]'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isSuper ? 'bg-[#E85D04]' : 'bg-[#707884]'
                            }`}
                          />
                          {admin.role}
                        </span>
                      </td>

                      {/* MFA State */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium sm:text-[11px] 2xl:text-xs ${
                            admin.is2faEnabled
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {admin.is2faEnabled ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 2xl:h-4 2xl:w-4" />
                              <span>TOTP Armed</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3.5 w-3.5 text-amber-600 2xl:h-4 2xl:w-4" />
                              <span>Setup Pending</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Activity State */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-[11px] 2xl:text-xs ${
                            admin.status === 'ACTIVE'
                              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                              : 'border border-amber-200 bg-amber-50 text-amber-800'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              admin.status === 'ACTIVE'
                                ? 'bg-emerald-600'
                                : 'bg-amber-600'
                            }`}
                          />
                          {admin.status}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td className="py-4 px-4 text-[#707884]">
                        {admin.lastLogin}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-4 pr-6 text-right">
                        {!isCurrentSelf ? (
                          <button
                            type="button"
                            className="rounded p-1.5 text-[#707884] transition-colors hover:bg-rose-50 hover:text-rose-700 2xl:p-2"
                            title="Revoke Administrative Privileges"
                            aria-label={`Revoke privileges for ${admin.email}`}
                          >
                            <Trash2 className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
                          </button>
                        ) : (
                          <span className="font-sans text-[11px] font-medium text-[#707884] sm:text-xs 2xl:text-sm">
                            Current Node
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Roster Notice */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-[#E6E2D8] bg-[#F7F5F0]/60 px-6 py-3.5 font-sans text-[11px] text-[#707884] sm:flex-row sm:text-xs 2xl:text-sm">
          <span>Roster Registry: {filteredAdmins.length} active profiles</span>
          <span className="flex items-center gap-1.5 font-medium text-[#303030]">
            <Shield className="h-3.5 w-3.5 text-[#E85D04]" />
            Zero-Trust Roster Validated
          </span>
        </div>
      </div>
    );
  }
);

AdminRosterTable.displayName = 'AdminRosterTable';

export default AdminRosterTable;