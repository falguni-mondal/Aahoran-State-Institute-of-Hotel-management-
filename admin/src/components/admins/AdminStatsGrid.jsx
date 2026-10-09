import React, { forwardRef } from 'react';
import { Users, Shield, Smartphone, Sparkles } from 'lucide-react';

const AdminStatsGrid = forwardRef(({ admins = [], isLoading = false }, ref) => {
  const totalCount = admins.length;
  const superAdminCount = admins.filter((a) => a.role === 'SuperAdmin').length;
  const mfaCompliancePercentage = totalCount
    ? Math.round(
        (admins.filter((a) => a.is2faEnabled).length / totalCount) * 100
      )
    : 0;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:gap-6"
    >
      {/* 1. Total Administrators */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-6 md:p-6 lg:p-6 xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
            Total Administrators
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-10 2xl:w-10">
            <Users className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#303030] sm:text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl">
            {totalCount}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Authorized identity profiles</span>
          <span className="font-medium text-[#303030]">Roster</span>
        </div>
      </div>

      {/* 2. SuperAdmin Tier */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-6 md:p-6 lg:p-6 xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
            SuperAdmin Tier
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-10 2xl:w-10">
            <Shield className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#303030] sm:text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl">
            {superAdminCount}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Full root authority held</span>
          <span className="font-medium text-[#E85D04]">Level 0</span>
        </div>
      </div>

      {/* 3. MFA Compliance */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-6 md:p-6 lg:p-6 xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
            MFA Compliance
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-emerald-600 2xl:h-10 2xl:w-10">
            <Smartphone className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-4 h-9 w-16 animate-pulse rounded-md bg-[#E6E2D8]/70 sm:h-10 sm:w-20 2xl:h-12 2xl:w-24" />
        ) : (
          <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#303030] sm:text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl">
            {mfaCompliancePercentage}%
          </div>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Mandatory TOTP enforcement</span>
          <span className="font-medium text-emerald-700">Protected</span>
        </div>
      </div>

      {/* 4. Session Posture */}
      <div className="rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] sm:p-6 md:p-6 lg:p-6 xl:p-7 2xl:p-8">
        <div className="flex items-center justify-between text-[#707884]">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
            Session Posture
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-10 2xl:w-10">
            <Sparkles className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
        </div>
        <div className="mt-4 font-serif text-3xl font-normal tracking-tight text-emerald-700 sm:text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl">
          Nominal
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
          <span>Zero active tripwires</span>
          <span className="flex items-center gap-1 font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Clear
          </span>
        </div>
      </div>
    </div>
  );
});

AdminStatsGrid.displayName = 'AdminStatsGrid';

export default AdminStatsGrid;