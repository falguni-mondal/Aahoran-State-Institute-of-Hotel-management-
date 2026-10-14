import React, { useState, useEffect, forwardRef } from 'react';
import {
  X,
  Bell,
  FolderOpen,
  Calendar,
  UploadCloud,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import apiClient from '../../api/axios.js';
import { uploadToImageKit } from '../../utils/imagekitUpload.js';
import { NOTICE_CATEGORIES } from './NoticeFilterBar.jsx';

const getTodayInputDate = () => new Date().toISOString().slice(0, 10);

const formatInputDate = (dateValue) => {
  if (!dateValue) return getTodayInputDate();
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return getTodayInputDate();
    return d.toISOString().slice(0, 10);
  } catch {
    return getTodayInputDate();
  }
};

const NoticeFormModal = forwardRef(
  ({ isOpen, editingNotice, onClose, onNoticeSaved }, ref) => {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('student');
    const [publishDate, setPublishDate] = useState(getTodayInputDate());
    const [isNew, setIsNew] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [url, setUrl] = useState('');
    const [fileId, setFileId] = useState(null);
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Populate or reset form fields whenever modal opens or target notice changes
    useEffect(() => {
      if (!isOpen) return;

      if (editingNotice) {
        setTitle(editingNotice.title || '');
        setCategoryId(editingNotice.categoryId || 'student');
        setPublishDate(formatInputDate(editingNotice.publishDate));
        setIsNew(Boolean(editingNotice.isNew));
        setIsActive(Boolean(editingNotice.isActive));
        setUrl(editingNotice.url || '');
        setFileId(editingNotice.fileId || null);
        setFileName(editingNotice.fileName || '');
      } else {
        setTitle('');
        setCategoryId('student');
        setPublishDate(getTodayInputDate());
        setIsNew(true);
        setIsActive(true);
        setUrl('');
        setFileId(null);
        setFileName('');
      }

      setSelectedFile(null);
      setErrorMessage(null);
      setSuccessMessage(null);
    }, [isOpen, editingNotice]);

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        setErrorMessage('Only official PDF documents (.pdf) are permitted.');
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setErrorMessage('Document file size cannot exceed 20 MB.');
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
        setErrorMessage('Notice headline title is required.');
        return;
      }

      if (!selectedFile && !url.trim()) {
        setErrorMessage(
          'Please select a PDF document to upload or provide a direct document URL.'
        );
        return;
      }

      setIsSubmitting(true);

      try {
        let finalUrl = url.trim();
        let finalFileId = fileId;
        let finalFileName = fileName;

        // 1. Upload PDF to ImageKit CDN if a new file was selected
        if (selectedFile) {
          setIsUploadingFile(true);
          const uploadedAsset = await uploadToImageKit(selectedFile, '/notices');
          finalUrl = uploadedAsset.url;
          finalFileId = uploadedAsset.fileId;
          finalFileName = selectedFile.name;
          setIsUploadingFile(false);
        }

        const payload = {
          title: title.trim(),
          categoryId,
          publishDate,
          isNew,
          isActive,
          url: finalUrl,
          fileId: finalFileId,
          fileName: finalFileName || finalUrl.split('/').pop(),
        };

        // 2. Commit mutation to backend API
        if (editingNotice) {
          const targetId = editingNotice._id || editingNotice.id;
          const response = await apiClient.put(`/notices/${targetId}`, payload);
          if (response.data?.notice) {
            onNoticeSaved?.(response.data.notice, true);
          }
          setSuccessMessage(
            response.data?.message || 'Notice record updated in the registry.'
          );
        } else {
          const response = await apiClient.post('/notices', payload);
          if (response.data?.notice) {
            onNoticeSaved?.(response.data.notice, false);
          }
          setSuccessMessage(
            response.data?.message ||
              'Official notice published to the institutional registry.'
          );
        }

        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 900);
      } catch (err) {
        setIsUploadingFile(false);
        setErrorMessage(
          err.response?.data?.message ||
            err.message ||
            'Failed to save notice record.'
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    const isBusy = isSubmitting || isUploadingFile;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Backdrop */}
        <div
          onClick={() => !isBusy && onClose()}
          className="fixed inset-0 bg-[#303030]/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <div
          ref={ref}
          data-lenis-prevent="true"
          className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-2xl sm:p-8 md:max-w-xl lg:max-w-2xl 2xl:max-w-3xl 2xl:p-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#E6E2D8] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-12 2xl:w-12">
                <Bell className="h-5 w-5 2xl:h-6 2xl:w-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-normal text-[#303030] sm:text-2xl 2xl:text-3xl">
                  {editingNotice
                    ? 'Update Official Notice'
                    : 'Publish Official Notice'}
                </h3>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#707884] 2xl:text-xs">
                  Institutional Circular & Document Dispatch
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="rounded-xl p-1.5 text-[#707884] transition-colors hover:bg-[#F7F5F0] hover:text-[#303030] disabled:opacity-40"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 sm:text-sm">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800 sm:text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Notice Headline */}
            <div>
              <label
                htmlFor="notice-title"
                className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs"
              >
                Notice Headline Title *
              </label>
              <textarea
                id="notice-title"
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Fee Structure for B.Sc HHA Academic Program (Batch 2026-29)"
                required
                disabled={isBusy}
                className="mt-2 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 p-3.5 font-sans text-xs text-[#303030] outline-none transition-all placeholder:text-[#A0A8B4] focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#E85D04]/10 sm:text-sm 2xl:text-base"
              />
            </div>

            {/* Category & Publish Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="notice-category"
                  className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs"
                >
                  Department Category *
                </label>
                <div className="relative mt-2">
                  <FolderOpen className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707884]" />
                  <select
                    id="notice-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={isBusy}
                    className="w-full appearance-none rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-3 pl-10 pr-8 font-sans text-xs text-[#303030] outline-none transition-all focus:border-[#E85D04] focus:bg-[#FFFFFF] sm:text-sm 2xl:py-3.5 2xl:text-base"
                  >
                    {NOTICE_CATEGORIES.filter((cat) => cat.id !== 'all').map(
                      (cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      )
                    )}
                  </select>
                  <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-[#707884]" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="notice-date"
                  className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs"
                >
                  Official Publish Date *
                </label>
                <div className="relative mt-2">
                  <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707884]" />
                  <input
                    id="notice-date"
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    required
                    disabled={isBusy}
                    className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-3 pl-10 pr-4 font-sans text-xs text-[#303030] outline-none transition-all focus:border-[#E85D04] focus:bg-[#FFFFFF] sm:text-sm 2xl:py-3.5 2xl:text-base"
                  />
                </div>
              </div>
            </div>

            {/* PDF Upload Dropzone */}
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs">
                Official PDF Circular (ImageKit Cloud) *
              </label>

              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E6E2D8] bg-[#F7F5F0]/40 p-5 text-center transition-all hover:border-[#E85D04] hover:bg-[#F7F5F0] 2xl:p-6">
                <UploadCloud className="h-7 w-7 text-[#E85D04] 2xl:h-8 2xl:w-8" />
                <span className="mt-2 font-sans text-xs font-medium text-[#303030] sm:text-sm 2xl:text-base">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : fileName
                    ? `Attached: ${fileName} (Click to replace PDF)`
                    : 'Click to upload an official PDF circular'}
                </span>
                <span className="mt-1 font-sans text-[11px] text-[#707884] 2xl:text-xs">
                  PDF format only • Max 20 MB • Stored on ImageKit CDN
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  disabled={isBusy}
                  className="hidden"
                />
              </label>

              {/* Direct / Fallback URL Input */}
              <div className="mt-3">
                <span className="block font-sans text-[10px] uppercase tracking-wider text-[#707884] 2xl:text-[11px]">
                  Or specify direct / local document URL:
                </span>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://ik.imagekit.io/... or /files/notices/..."
                  disabled={isBusy || Boolean(selectedFile)}
                  className="mt-1.5 w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 px-3.5 py-2.5 font-mono text-xs text-[#303030] outline-none transition-all placeholder:text-[#A0A8B4] focus:border-[#E85D04] focus:bg-[#FFFFFF] disabled:opacity-50 2xl:py-3 2xl:text-sm"
                />
              </div>
            </div>

            {/* Badge & Visibility Toggles */}
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
              <button
                type="button"
                disabled={isBusy}
                onClick={() => setIsNew(!isNew)}
                className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isNew
                    ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#303030]'
                    : 'border-[#E6E2D8] bg-[#F7F5F0]/40 text-[#707884]'
                }`}
              >
                <div>
                  <div className="font-sans text-xs font-semibold 2xl:text-sm">
                    "New Update" Badge
                  </div>
                  <div className="font-sans text-[11px] opacity-80 2xl:text-xs">
                    Highlight notice with accent pill
                  </div>
                </div>
                <div
                  className={`h-4 w-4 shrink-0 rounded-full border ${
                    isNew
                      ? 'border-[#E85D04] bg-[#E85D04]'
                      : 'border-[#707884] bg-transparent'
                  }`}
                />
              </button>

              <button
                type="button"
                disabled={isBusy}
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950'
                    : 'border-[#E6E2D8] bg-[#F7F5F0]/40 text-[#707884]'
                }`}
              >
                <div>
                  <div className="font-sans text-xs font-semibold 2xl:text-sm">
                    {isActive ? 'Publish Immediately' : 'Save as Draft'}
                  </div>
                  <div className="font-sans text-[11px] opacity-80 2xl:text-xs">
                    {isActive
                      ? 'Visible on public Notice Board'
                      : 'Withheld from public visitors'}
                  </div>
                </div>
                <div
                  className={`h-4 w-4 shrink-0 rounded-full border ${
                    isActive
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-[#707884] bg-transparent'
                  }`}
                />
              </button>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E6E2D8] pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-5 py-2.5 font-sans text-xs text-[#707884] transition-all hover:bg-[#F7F5F0] hover:text-[#303030] disabled:opacity-50 sm:text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isBusy}
                className="flex items-center gap-2 rounded-xl bg-[#303030] px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] disabled:opacity-50 sm:text-sm"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      {isUploadingFile
                        ? 'Uploading PDF to CDN...'
                        : 'Saving Notice...'}
                    </span>
                  </>
                ) : (
                  <span>
                    {editingNotice ? 'Save Changes →' : 'Publish Circular →'}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

NoticeFormModal.displayName = 'NoticeFormModal';

export default NoticeFormModal;