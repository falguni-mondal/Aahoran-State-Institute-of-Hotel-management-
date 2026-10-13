import React, { useState, forwardRef } from 'react';
import {
  X,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import apiClient from '../../api/axios.js';

const ProvisionAdminModal = forwardRef(
  ({ isOpen, onClose, onAdminProvisioned }, ref) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Admin');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    if (!isOpen) return null;

    const handleGenerateKey = () => {
      const charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#\$%^&*()_+';
      let generated = '';
      for (let i = 0; i < 16; i++) {
        generated += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      setPassword(generated);
      setShowPassword(true);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);

      if (!email.trim() || !password.trim()) {
        setErrorMessage('Both official email and temporary passphrase are required.');
        return;
      }

      if (password.length < 8) {
        setErrorMessage('Temporary passphrase must be at least 8 characters long.');
        return;
      }

      setIsSubmitting(true);

      try {
        // Points to POST /api/v1/admins
        const response = await apiClient.post('/admins', {
          email: email.trim().toLowerCase(),
          password,
          role,
        });

        if (response.data?.status === 'success') {
          setSuccessMessage(response.data.message);
          if (onAdminProvisioned && response.data.admin) {
            onAdminProvisioned(response.data.admin);
          }
          setTimeout(() => {
            setEmail('');
            setPassword('');
            setRole('Admin');
            setSuccessMessage(null);
            onClose();
          }, 1200);
        }
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message || 'Failed to enroll administrative account.'
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#303030]/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <div
          ref={ref}
          className="relative z-10 w-full max-w-lg rounded-3xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-2xl sm:p-8 2xl:max-w-xl 2xl:p-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-12 2xl:w-12">
                <UserPlus className="h-5 w-5 2xl:h-6 2xl:w-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-normal text-[#303030] sm:text-2xl 2xl:text-3xl">
                  Provision Administrator
                </h3>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#707884] 2xl:text-xs">
                  Cryptographic Access Enrollment
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl p-1.5 text-[#707884] transition-colors hover:bg-[#F7F5F0] hover:text-[#303030]"
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
            {/* Personnel Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs"
              >
                Official Personnel Email
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707884]" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@sihm.gov.in"
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-3 pl-10 pr-4 font-sans text-xs text-[#303030] outline-none transition-all placeholder:text-[#A0A8B4] focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#E85D04]/10 sm:text-sm 2xl:py-3.5 2xl:text-base"
                />
              </div>
            </div>

            {/* Clearance Tier */}
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs">
                Clearance Tier
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  disabled={isSubmitting}
                  className={`rounded-xl border py-2.5 font-sans text-xs font-medium transition-all sm:text-sm ${
                    role === 'Admin'
                      ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]'
                      : 'border-[#E6E2D8] bg-[#FFFFFF] text-[#707884] hover:bg-[#F7F5F0]'
                  }`}
                >
                  Standard Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SuperAdmin')}
                  disabled={isSubmitting}
                  className={`rounded-xl border py-2.5 font-sans text-xs font-medium transition-all sm:text-sm ${
                    role === 'SuperAdmin'
                      ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]'
                      : 'border-[#E6E2D8] bg-[#FFFFFF] text-[#707884] hover:bg-[#F7F5F0]'
                  }`}
                >
                  SuperAdmin (Root)
                </button>
              </div>
            </div>

            {/* Temporary Passphrase */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs"
                >
                  Temporary Passphrase
                </label>
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 font-sans text-xs font-medium text-[#E85D04] transition-colors hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate Key</span>
                </button>
              </div>

              <div className="relative mt-2">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#707884]" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-3 pl-10 pr-11 font-sans text-xs text-[#303030] outline-none transition-all placeholder:text-[#A0A8B4] focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#E85D04]/10 sm:text-sm 2xl:py-3.5 2xl:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#707884] hover:text-[#303030]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-5 py-2.5 font-sans text-xs text-[#707884] transition-all hover:bg-[#F7F5F0] hover:text-[#303030] sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-[#303030] px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] disabled:opacity-50 sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Enrolling...</span>
                  </>
                ) : (
                  <span>Confirm Enrollment →</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

ProvisionAdminModal.displayName = 'ProvisionAdminModal';

export default ProvisionAdminModal;