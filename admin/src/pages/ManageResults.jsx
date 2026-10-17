import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Plus, RefreshCw, ShieldAlert } from 'lucide-react';
import apiClient from '../api/axios.js';
import { useLenis } from '../providers/SmoothScrollProvider.jsx';

import ResultStatsGrid from '../components/results/ResultStatsGrid.jsx';
import ResultFilterBar from '../components/results/ResultFilterBar.jsx';
import ResultRosterTable from '../components/results/ResultRosterTable.jsx';
import ResultFormModal from '../components/results/ResultFormModal.jsx';

const ManageResults = () => {
  const lenis = useLenis();

  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const statsGridRef = useRef(null);
  const tableSectionRef = useRef(null);
  const modalRef = useRef(null);

  const fetchResults = useCallback(async (manualSync = false) => {
    if (manualSync) setIsRefreshing(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.get('/results/admin');
      if (response.data && Array.isArray(response.data.data)) {
        setResults(response.data.data);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to synchronize results registry.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(false);
  }, [fetchResults]);

  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return results.filter((res) => {
      const matchesProg =
        programFilter === 'all' || res.programType === programFilter;
      const matchesSem =
        programFilter === 'diploma' ||
        semesterFilter === 'all' ||
        res.semesterId === semesterFilter;

      const title = res.title?.toLowerCase() || '';
      const code = res.recordCode?.toLowerCase() || '';
      const session = (res.sessionLabel || res.sessionId || '').toLowerCase();
      const exam = (res.examType || res.type || '').toLowerCase();

      const matchesSearch =
        !q ||
        title.includes(q) ||
        code.includes(q) ||
        session.includes(q) ||
        exam.includes(q);

      return matchesProg && matchesSem && matchesSearch;
    });
  }, [results, searchQuery, programFilter, semesterFilter]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(headerRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.38 })
        .fromTo(
          statsGridRef.current?.children || [],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.38, stagger: 0.04 },
          '-=0.2'
        )
        .fromTo(tableSectionRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.38 }, '-=0.15');
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (isModalOpen) {
      if (lenis) lenis.stop();
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
      }
    } else if (lenis) {
      lenis.start();
    }
  }, [isModalOpen, lenis]);

  const handleResultSaved = (savedItem, isEdit) => {
    const savedId = savedItem._id || savedItem.id;
    if (isEdit) {
      setResults((prev) =>
        prev.map((item) => ((item._id || item.id) === savedId ? savedItem : item))
      );
    } else {
      setResults((prev) => [savedItem, ...prev]);
    }
  };

  const handleQuickToggle = async (result, field) => {
    const targetId = result._id || result.id;
    if (!targetId || togglingId) return;

    setTogglingId(`${targetId}-${field}`);
    try {
      const response = await apiClient.put(`/results/${targetId}`, {
        [field]: !result[field],
      });
      if (response.data?.result) {
        setResults((prev) =>
          prev.map((item) =>
            (item._id || item.id) === targetId ? response.data.result : item
          )
        );
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update result status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteResult = async (result) => {
    const targetId = result._id || result.id;
    if (!targetId || deletingId) return;
    if (!window.confirm(`Permanently purge "${result.title}" and its PDF sheet?`)) return;

    setDeletingId(targetId);
    try {
      await apiClient.delete(`/results/${targetId}`);
      setResults((prev) => prev.filter((item) => (item._id || item.id) !== targetId));
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete result.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 2xl:space-y-8">
      <div
        ref={headerRef}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h2 className="font-serif text-2xl font-normal tracking-tight text-[#303030] md:text-3xl 2xl:text-4xl">
            Examination <span className="italic text-[#E85D04]">Results</span>
          </h2>
          <p className="mt-1 font-sans text-xs text-[#707884] md:text-sm 2xl:text-base">
            Manage semester and diploma examination declarations, verification links, and result sheets.
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto sm:gap-3">
          <button
            type="button"
            onClick={() => fetchResults(true)}
            disabled={isRefreshing || isLoading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3.5 py-2 font-sans text-xs text-[#707884] hover:bg-[#F7F5F0] sm:flex-initial md:text-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-[#E85D04]' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Results'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingResult(null);
              setIsModalOpen(true);
            }}
            className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#303030] px-4 py-2 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] hover:bg-[#E85D04] sm:flex-initial md:text-sm"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span>Publish Result</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 sm:text-sm">
          <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <ResultStatsGrid ref={statsGridRef} results={results} isLoading={isLoading} />

      <div ref={tableSectionRef} className="space-y-4 sm:space-y-5">
        <ResultFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          programFilter={programFilter}
          setProgramFilter={setProgramFilter}
          semesterFilter={semesterFilter}
          setSemesterFilter={setSemesterFilter}
        />

        <ResultRosterTable
          filteredResults={filteredResults}
          isLoading={isLoading}
          onEditResult={(item) => {
            setEditingResult(item);
            setIsModalOpen(true);
          }}
          onDeleteResult={handleDeleteResult}
          onQuickToggle={handleQuickToggle}
          togglingId={togglingId}
          deletingId={deletingId}
        />
      </div>

      <ResultFormModal
        ref={modalRef}
        isOpen={isModalOpen}
        editingResult={editingResult}
        onClose={() => {
          setIsModalOpen(false);
          setEditingResult(null);
        }}
        onResultSaved={handleResultSaved}
      />
    </div>
  );
};

export default ManageResults;