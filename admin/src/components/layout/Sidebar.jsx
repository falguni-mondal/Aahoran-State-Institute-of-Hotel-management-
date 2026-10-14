import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Activity,
  FileText,
  Users,
  GraduationCap,
  Bell,
  LogOut,
  Building2,
} from 'lucide-react';
import apiClient from '../../api/axios.js';
import { selectCurrentUser, logOut } from '../../store/features/authSlice.js';

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const isSuperAdmin = currentUser?.role === 'SuperAdmin';
  const userInitial = currentUser?.email?.charAt(0).toUpperCase() || 'A';

  const navLinks = [
    {
      label: 'Institutional Overview',
      path: '/dashboard',
      icon: Activity,
    },
    {
      label: 'Security Audit Logs',
      path: '/audit-logs',
      icon: FileText,
    },
    {
      label: 'Mentors Directory',
      path: '/mentors',
      icon: GraduationCap,
    },
    {
      label: 'Notice Board',
      path: '/notices',
      icon: Bell,
    },
    ...(isSuperAdmin
      ? [
          {
            label: 'Manage Admins',
            path: '/admins',
            icon: Users,
          },
        ]
      : []),
  ];

  const handleSignOut = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Continue client-side session eviction regardless of network outcome
    } finally {
      dispatch(logOut());
      navigate('/login');
    }
  };

  return (
    <aside className="flex h-screen w-full flex-col justify-between border-r border-[#E6E2D8] bg-[#FFFFFF] p-4 sm:p-5 md:w-64 lg:w-72 xl:w-80 2xl:w-88 2xl:p-6">
      {/* Brand Identity */}
      <div>
        <div className="flex items-center gap-3 border-b border-[#E6E2D8] pb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] shadow-sm 2xl:h-12 2xl:w-12">
            <Building2 className="h-5 w-5 2xl:h-6 2xl:w-6" />
          </div>
          <div>
            <h1 className="font-serif text-base font-medium tracking-tight text-[#303030] 2xl:text-lg">
              SIHM PORTAL
            </h1>
            <p className="font-serif text-xs italic text-[#707884] 2xl:text-sm">
              State Institute of Hotel Mgmt
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-6">
          <span className="block px-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#707884] 2xl:text-xs">
            Command Modules
          </span>

          <nav className="mt-3 space-y-1.5 2xl:space-y-2">
            {navLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-2xl px-3.5 py-3 font-sans text-xs font-medium transition-all sm:text-xs md:text-sm 2xl:py-3.5 2xl:text-base ${
                      isActive
                        ? 'border border-[#E6E2D8] bg-[#F7F5F0] text-[#303030] shadow-sm'
                        : 'border border-transparent text-[#707884] hover:border-[#E6E2D8]/60 hover:bg-[#F7F5F0]/60 hover:text-[#303030]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors 2xl:h-5 2xl:w-5 ${
                          isActive
                            ? 'text-[#E85D04]'
                            : 'text-[#707884] group-hover:text-[#303030]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Session Footer */}
      <div className="space-y-3 border-t border-[#E6E2D8] pt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E6E2D8] bg-[#F7F5F0]/70 p-3 shadow-sm 2xl:p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] font-serif text-sm font-semibold text-[#303030] 2xl:h-11 2xl:w-11 2xl:text-base">
            {userInitial}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="truncate font-sans text-xs font-medium text-[#303030] 2xl:text-sm"
              title={currentUser?.email}
            >
              {currentUser?.email || 'Authenticated Personnel'}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5 font-sans text-[11px] text-[#707884] 2xl:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E85D04]" />
              <span>{currentUser?.role || 'Admin'} Account</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] py-2.5 font-sans text-xs font-medium text-[#707884] transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 sm:text-xs md:text-sm 2xl:py-3 2xl:text-base"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 2xl:h-5 2xl:w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}