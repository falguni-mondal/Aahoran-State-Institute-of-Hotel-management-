import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import apiClient from '../api/axios.js';
import { selectCurrentUser } from '../store/features/authSlice.js';

// Modular Child Components
import WelcomeBanner from '../components/dashboard/WelcomeBanner.jsx';
import TelemetryGrid from '../components/dashboard/TelemetryGrid.jsx';
import RecentAuditTable from '../components/dashboard/RecentAuditTable.jsx';

const INITIAL_TELEMETRY = {
  activeSessions: 0,
  totalAudits: 0,
  gatewayUptime: 99.98,
  totalAdmins: 0,
};

const Dashboard = () => {
  const currentUser = useSelector(selectCurrentUser);

  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [recentEvents, setRecentEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef(null);
  const welcomeBannerRef = useRef(null);
  const statsGridRef = useRef(null);
  const recentLogsRef = useRef(null);

  // Fetch live institutional metrics & recent log slice
  useEffect(() => {
    let isMounted = true;

    const fetchDashboardTelemetry = async () => {
      try {
        const { data } = await apiClient.get('/audit-logs/telemetry');
        if (isMounted && data?.status === 'success') {
          if (data.telemetry) {
            setTelemetry(data.telemetry);
          }
          if (Array.isArray(data.recentEvents)) {
            setRecentEvents(data.recentEvents);
          }
        }
      } catch {
        // Retain initial zero state on network failure
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDashboardTelemetry();

    return () => {
      isMounted = false;
    };
  }, []);

  // Entrance timeline
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        welcomeBannerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.38 }
      )
        .fromTo(
          statsGridRef.current?.children || [],
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.04,
          },
          '-=0.2'
        )
        .fromTo(
          recentLogsRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.38 },
          '-=0.15'
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="space-y-6 2xl:space-y-8">
      <WelcomeBanner
        ref={welcomeBannerRef}
        userEmail={currentUser?.email}
      />

      <TelemetryGrid
        ref={statsGridRef}
        telemetry={telemetry}
        isLoading={isLoading}
      />

      <RecentAuditTable
        ref={recentLogsRef}
        events={recentEvents}
        currentUserEmail={currentUser?.email}
      />
    </div>
  );
};

export default Dashboard;