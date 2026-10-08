import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Building2,
  Activity,
  Users,
  FileText,
  LogOut,
  X,
} from 'lucide-react';

const Sidebar = ({
  isOpen,
  onClose,
  currentUser,
  userRole,
  isSuperAdmin,
  onLogout,
  isLoggingOut,
}) => {
  const location = useLocation();

  const navLinks = [
    { label: 'Institutional Overview', path: '/dashboard', icon: Activity },
    { label: 'Security Audit Logs', path: '/audit-logs', icon: FileText },
    ...(isSuperAdmin
      ? [{ label: 'Clearance Staff', path: '/admins', icon: Users }]
      : []),
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#303030]/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Navigation Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.04)] transition-transform duration-300 ease-in-out sm:w-80 md:w-80 lg:static lg:translate-x-0 xl:w-80 2xl:w-88 2xl:p-8 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Brand & Monogram Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] sm:h-12 sm:w-12 2xl:h-14 2xl:w-14">
                <Building2 className="h-5 w-5 sm:h-5 sm:w-5 2xl:h-6 2xl:w-6" />
              </div>
              <div>
                <span className="block font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E85D04] sm:text-xs 2xl:text-sm">
                  SIHM PORTAL
                </span>
                <span className="block font-serif text-xs italic text-[#707884] sm:text-xs 2xl:text-sm">
                  State Institute of Hotel Mgmt
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#707884] hover:bg-[#F7F5F0] hover:text-[#303030] lg:hidden"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="mb-2 block px-3 font-sans text-[10px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
              Command Modules
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 font-sans text-xs transition-all sm:text-xs md:text-sm 2xl:py-3.5 2xl:text-sm ${
                    isActive
                      ? 'border border-[#E6E2D8] bg-[#F7F5F0] font-medium text-[#303030] shadow-sm'
                      : 'border border-transparent text-[#707884] hover:border-[#E6E2D8] hover:bg-[#F7F5F0]/60 hover:text-[#303030]'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 sm:h-4 sm:w-4 2xl:h-5 2xl:w-5 ${
                      isActive ? 'text-[#E85D04]' : 'text-[#707884]'
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Identity & Session Revocation Footer */}
        <div className="space-y-4 border-t border-[#E6E2D8] pt-6">
          <div className="flex items-center gap-3 rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/60 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D5CEBF] bg-[#FFFFFF] font-serif text-xs font-semibold text-[#303030] sm:h-10 sm:w-10 2xl:h-11 2xl:w-11">
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-sans text-xs font-medium text-[#303030] sm:text-xs 2xl:text-sm">
                {currentUser?.email || 'admin@sihm.gov.in'}
              </span>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    isSuperAdmin ? 'bg-[#E85D04]' : 'bg-emerald-600'
                  }`}
                />
                <span className="font-sans text-[10px] text-[#707884] sm:text-[11px] 2xl:text-xs">
                  {userRole} Clearance
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] py-2.5 font-sans text-xs text-[#707884] transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 sm:text-xs md:text-sm 2xl:py-3 2xl:text-sm"
          >
            <LogOut className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 2xl:h-4 2xl:w-4" />
            <span>{isLoggingOut ? 'Terminating Session...' : 'Revoke Session'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;