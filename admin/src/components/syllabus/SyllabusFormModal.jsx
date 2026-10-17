import React, { useState, useEffect, forwardRef } from 'react';
import {
  X,
  ScrollText,
  UploadCloud,
  ShieldAlert,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import apiClient from '../../api/axios.js';
import { uploadToImageKit } from '../../utils/imagekitUpload.js';

const SyllabusFormModal = forwardRef(
  ({ isOpen, editingSyllabus, onClose, onSyllabusSaved }, ref) => {
    const [title, setTitle] = useState('');
    const [categoryGroup, setCategoryGroup] = useState('bsc');
    const [tabId, setTabId] = useState('jnu');
    const [displayOrder, setDisplayOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [url, setUrl] = useState('');
    const [fileId, setFileId] = useState(null);
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
      if (!isOpen) return;

      if (editingSyllabus) {
        setTitle(editingSyllabus.title || '');
        setCategoryGroup(editingSyllabus.categoryGroup || 'bsc');
        setTabId(
          editingSyllabus.tabId && editingSyllabus.tabId !== 'none'
            ? editingSyllabus.tabId
            : 'jnu'
        );
        setDisplayOrder(editingSyllabus.displayOrder || 0);
        setIsActive(Boolean(editingSyllabus.isActive));
        setUrl(editingSyllabus.url || '');
        setFileId(editingSyllabus.fileId || null);
        setFileName(editingSyllabus.fileName || '');
      } else {
        setTitle('');
        setCategoryGroup('bsc');
        setTabId('jnu');
        setDisplayOrder(0);
        setIsActive(true);
        setUrl('');
        setFileId(null);
        setFileName('');
      }

      setSelectedFile(null);
      setErrorMessage(null);
      setSuccessMessage(null);
    }, [isOpen, editingSyllabus]);

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.type !== 'application/pdf') {
        setErrorMessage('Only official PDF syllabus documents (.pdf) are permitted.');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setErrorMessage('File size cannot exceed 20 MB.');
        return;
      }
      setErrorMessage(null);
      setSelectedFile(file);
      setFileName(file.name);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);

      if (!title.trim()) {
        setErrorMessage('Syllabus title is required.');
        return;
      }
      if (!selectedFile && !url.trim()) {
        setErrorMessage('Please upload a syllabus PDF or provide a direct URL.');
        return;
      }

      setIsSubmitting(true);

      try {
        let finalUrl = url.trim();
        let finalFileId = fileId;
        let finalFileName = fileName;

        if (selectedFile) {
          setIsUploadingFile(true);
          const uploaded = await uploadToImageKit(selectedFile, '/syllabus');
          finalUrl = uploaded.url;
          finalFileId = uploaded.fileId;
          finalFileName = selectedFile.name;
          setIsUploadingFile(false);
        }

        const payload = {
          title: title.trim(),
          categoryGroup,
          tabId: categoryGroup === 'bsc' ? tabId : 'none',
          displayOrder: Number(displayOrder) || 0,
          isActive,
          url: finalUrl,
          fileId: finalFileId,
          fileName: finalFileName || finalUrl.split('/').pop(),
        };

        if (editingSyllabus) {
          const targetId = editingSyllabus._id || editingSyllabus.id;
          const response = await apiClient.put(`/syllabus/${targetId}`, payload);
          if (response.data?.syllabus) {
            onSyllabusSaved?.(response.data.syllabus, true);
          }
          setSuccessMessage('Syllabus record updated.');
        } else {
          const response = await apiClient.post('/syllabus', payload);
          if (response.data?.syllabus) {
            onSyllabusSaved?.(response.data.syllabus, false);
          }
          setSuccessMessage('Syllabus published to archive.');
        }

        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 900);
      } catch (err) {
        setIsUploadingFile(false);
        setErrorMessage(
          err.response?.data?.message || err.message || 'Failed to save syllabus.'
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const isBusy = isSubmitting || isUploadingFile;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          onClick={() => !isBusy && onClose()}
          className="fixed inset-0 bg-[#303030]/50 backdrop-blur-sm"
        />

        <div
          ref={ref}
          data-lenis-prevent="true"
          className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-2xl sm:p-8 lg:max-w-2xl"
        >
          <div className="flex items-start justify-between border-b border-[#E6E2D8] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04]">
                <ScrollText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-normal text-[#303030] sm:text-2xl">
                  {editingSyllabus ? 'Update Curriculum Syllabus' : 'Publish Curriculum Syllabus'}
                </h3>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#707884]">
                  Academic Curriculum & Affiliation Archive
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="rounded-xl p-1.5 text-[#707884] hover:bg-[#F7F5F0]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {errorMessage && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Program Category */}
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                Program Category *
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {[
                  { id: 'bsc', label: 'B.Sc Degree Programmes' },
                  { id: 'diploma', label: 'Diploma Programmes' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    disabled={isBusy}
                    onClick={() => setCategoryGroup(cat.id)}
                    className={`rounded-xl border py-2.5 font-sans text-xs font-medium transition-all ${
                      categoryGroup === cat.id
                        ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]'
                        : 'border-[#E6E2D8] bg-[#FFFFFF] text-[#707884]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Affiliation Stream (B.Sc Only) */}
            {categoryGroup === 'bsc' && (
              <div>
                <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                  Curriculum Affiliation Tab *
                </label>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { id: 'jnu', label: 'JNU (New) - Since 2023' },
                    { id: 'ignou', label: 'IGNOU (Old) - Till 2023' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      disabled={isBusy}
                      onClick={() => setTabId(tab.id)}
                      className={`rounded-xl border py-2.5 px-3 font-sans text-xs font-medium transition-all ${
                        tabId === tab.id
                          ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]'
                          : 'border-[#E6E2D8] bg-[#FFFFFF] text-[#707884]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Syllabus Title & Order */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="sm:col-span-3">
                <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                  Syllabus Document Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Syllabus for B.Sc 1st Year (New) under JNU"
                  required
                  disabled={isBusy}
                  className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 p-3 font-sans text-xs text-[#303030] outline-none focus:border-[#E85D04] sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  disabled={isBusy}
                  className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 p-3 font-mono text-xs text-[#303030] outline-none focus:border-[#E85D04] sm:text-sm"
                />
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884]">
                Official Syllabus PDF (ImageKit Cloud) *
              </label>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E6E2D8] bg-[#F7F5F0]/40 p-5 text-center transition-all hover:border-[#E85D04]">
                <UploadCloud className="h-7 w-7 text-[#E85D04]" />
                <span className="mt-2 font-sans text-xs font-medium text-[#303030]">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : fileName
                    ? `Attached: ${fileName} (Click to replace)`
                    : 'Click to upload Syllabus PDF'}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  disabled={isBusy}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Or enter direct PDF URL (https://ik.imagekit.io/...)"
                disabled={isBusy || Boolean(selectedFile)}
                className="mt-2.5 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-2.5 font-mono text-xs text-[#303030] outline-none focus:border-[#E85D04] disabled:opacity-50"
              />
            </div>

            {/* Visibility Toggle */}
            <button
              type="button"
              disabled={isBusy}
              onClick={() => setIsActive(!isActive)}
              className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                isActive
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950'
                  : 'border-[#E6E2D8] bg-[#F7F5F0]/40 text-[#707884]'
              }`}
            >
              <div>
                <div className="font-sans text-xs font-semibold">
                  {isActive ? 'Publish Immediately on Syllabus Page' : 'Save as Draft'}
                </div>
                <div className="font-sans text-[11px] opacity-80">
                  {isActive ? 'Publicly downloadable by students' : 'Hidden from public view'}
                </div>
              </div>
              <div className={`h-4 w-4 rounded-full border ${isActive ? 'border-emerald-600 bg-emerald-600' : 'border-[#707884]'}`} />
            </button>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E6E2D8] pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-5 py-2.5 font-sans text-xs text-[#707884]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBusy}
                className="flex items-center gap-2 rounded-xl bg-[#303030] px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#F7F5F0] hover:bg-[#E85D04] disabled:opacity-50"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{isUploadingFile ? 'Uploading PDF...' : 'Saving...'}</span>
                  </>
                ) : (
                  <span>{editingSyllabus ? 'Save Changes →' : 'Publish Syllabus →'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

SyllabusFormModal.displayName = 'SyllabusFormModal';

export default SyllabusFormModal;