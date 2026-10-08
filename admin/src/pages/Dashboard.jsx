import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import apiClient from '../api/axios.js';
import {
  logOut,
  selectCurrentUser,
  selectCurrentRole,
} from '../store/features/authSlice.js';

// Modular Child Components
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';
import WelcomeBanner from '../components/dashboard/WelcomeBanner.jsx';
import TelemetryGrid from '../components/dashboard/TelemetryGrid.jsx';
import RecentAuditTable from '../components/dashboard/RecentAuditTable.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectCurrentRole) || 'Admin';
  const isSuperAdmin = userRole === 'SuperAdmin';

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Animation References
  const containerRef = useRef(null);
  const welcomeBannerRef = useRef(null);
  const telemetryGridRef = useRef(null);
  const recentLogsRef = useRef(null);

  // Staggered Editorial Entrance
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        welcomeBannerRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7 }
      )
        .fromTo(
          telemetryGridRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          '-=0.4'
        )
        .fromTo(
          recentLogsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        );
    },
    { scope: containerRef }
  );

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Clear client state even if transient network fails
    } finally {
      dispatch(logOut());
      navigate('/login', { replace: true });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col bg-[#F7F5F0] font-sans text-[#303030] lg:flex-row"
    >
      {/* Background Architectural Watermarks */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(#E6E2D8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,93,4,0.03),transparent_50%)]" />

      {/* 1. Modular Sidebar */}
      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentUser={currentUser}
        userRole={userRole}
        isSuperAdmin={isSuperAdmin}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* 2. Main Workspace */}
      <main className="relative z-10 flex min-h-screen flex-1 flex-col overflow-y-auto">
        {/* Modular Topbar */}
        <Topbar onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        {/* Dynamic Content Canvas */}
        <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-8 lg:p-8 xl:p-10 2xl:space-y-8 2xl:p-14">
          <WelcomeBanner
            ref={welcomeBannerRef}
            userEmail={currentUser?.email}
          />

          <TelemetryGrid ref={telemetryGridRef} />

          <RecentAuditTable
            ref={recentLogsRef}
            currentUserEmail={currentUser?.email}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;