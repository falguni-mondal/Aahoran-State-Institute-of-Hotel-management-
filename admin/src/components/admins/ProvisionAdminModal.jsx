import React, { useState, useRef, forwardRef } from 'react';
import gsap from 'gsap';
import {
  UserPlus,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  UserCheck,
  Shield,
  Loader2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import apiClient from '../../api/axios.js';

const ProvisionAdminModal = forwardRef(
  ({ isOpen, onClose, onAdminProvisioned }, ref) => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      role: 'Admin',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [provisionSuccessReceipt, setProvisionSuccessReceipt] = useState(null);
    const [copiedKey, setCopiedKey] = useState(false);

    const formCardRef = useRef(null);

    if (!isOpen) return null;

    const generateSecurePassword = () => {
      const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~';
      let result = '';
      const array = new Uint32Array(16);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < 16; i++) {
        result += chars[array[i] % chars.length];
      }
      setFormData((prev) => ({ ...prev, password: result }));

      gsap.fromTo(
        '#gen-pwd-btn',
        { rotate: 0 },
        { rotate: 360, duration: 0.4, ease: 'power2.out' }
      );
    };

    const triggerModalShake = () => {
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { x: -10 },
          {
            x: 10,
            duration: 0.08,
            repeat: 4,
            yoyo: true,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(formCardRef.current, { x: 0 });
            },
          }
        );
      }
    };

    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formError) setFormError('');
    };

    const handleProvisionSubmit = async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      if (!formData.email || !formData.password) {
        setFormError('Please supply both official email and temporary security passphrase.');
        triggerModalShake();
        return;
      }

      if (formData.password.length < 8) {
        setFormError('Passphrase requires a minimum length of 8 characters.');
        triggerModalShake();
        return;
      }

      setIsSubmitting(true);
      setFormError('');

      try {
        const response = await apiClient.post('/auth/create-admin', {
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        });

        const newAdminEntry = {
          email: formData.email.trim(),
          role: formData.role,
          is2faEnabled: false,
          status: 'PENDING_2FA',
          createdAt: new Date().toISOString(),
          lastLogin: 'Never',
          originIp: 'Unassigned',
        };

        onAdminProvisioned(newAdminEntry);

        setProvisionSuccessReceipt({
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          message:
            response.data?.message ||
            'Administrative personnel successfully provisioned with zero-trust mandates.',
        });
      } catch (error) {
        const serverMessage =
          error.response?.data?.message ||
          'Provisioning rejected. Clearance hierarchy validation failed.';
        setFormError(serverMessage);
        triggerModalShake();
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleCopyReceiptPassword = async () => {
      if (!provisionSuccessReceipt) return;
      try {
        await navigator.clipboard.writeText(provisionSuccessReceipt.password);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      } catch {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#303030]/40 p-4 backdrop-blur-sm sm:p-6 md:p-8 2xl:p-12">
        <div
          ref={ref}
          className="relative w-full max-w-lg rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-2xl sm:p-8 md:max-w-xl 2xl:max-w-2xl 2xl:p-10"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-12 2xl:w-12">
                <UserPlus className="h-4 w-4 2xl:h-5 2xl:w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-normal tracking-tight text-[#303030] sm:text-xl 2xl:text-2xl">
                  Provision Administrator
                </h3>
                <span className="font-sans text-[10px] uppercase text-[#707884] sm:text-[11px] 2xl:text-xs">
                  CRYPTOGRAPHIC ACCESS ENROLLMENT
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#707884] transition-colors hover:bg-[#F7F5F0] hover:text-[#303030]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Conditional Body: Success Receipt vs Form */}
          {provisionSuccessReceipt ? (
            <div className="mt-6 space-y-5">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 2xl:h-5 2xl:w-5" />
                  <span className="font-sans text-xs font-semibold sm:text-sm 2xl:text-base">
                    Enrollment Certified & Logged
                  </span>
                </div>
                <p className="mt-1 font-sans text-xs text-emerald-700 sm:text-xs 2xl:text-sm">
                  {provisionSuccessReceipt.message}
                </p>
              </div>

              <div className="space-y-3 rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/60 p-4 font-sans text-xs sm:text-xs md:text-sm 2xl:text-base">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#707884] 2xl:text-xs">
                    Provisioned Identifier
                  </span>
                  <div className="mt-0.5 font-medium text-[#303030]">
                    {provisionSuccessReceipt.email}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#707884] 2xl:text-xs">
                    Clearance Level
                  </span>
                  <div className="mt-0.5 font-medium text-[#E85D04]">
                    {provisionSuccessReceipt.role}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#707884] 2xl:text-xs">
                    Temporary Passphrase
                  </span>
                  <div className="mt-1 flex items-center justify-between rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] p-2.5">
                    <span className="font-mono text-xs font-semibold text-[#303030] select-all sm:text-sm 2xl:text-base">
                      {provisionSuccessReceipt.password}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyReceiptPassword}
                      className="flex items-center gap-1 font-sans text-[11px] font-semibold text-[#E85D04] hover:underline 2xl:text-xs"
                    >
                      {copiedKey ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-[#303030] px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-colors hover:bg-[#E85D04] sm:text-xs 2xl:py-3 2xl:text-sm"
                >
                  Close Provisioning Window
                </button>
              </div>
            </div>
          ) : (
            <form
              ref={formCardRef}
              onSubmit={handleProvisionSubmit}
              className="mt-6 space-y-4"
            >
              {formError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800 sm:text-xs 2xl:text-sm">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 2xl:h-5 2xl:w-5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
                  OFFICIAL PERSONNEL EMAIL
                </label>
                <div className="group relative flex items-center">
                  <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#707884] group-focus-within:text-[#E85D04] 2xl:h-5 2xl:w-5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="officer@sihm.gov.in"
                    className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-2.5 pl-10 pr-4 font-sans text-xs text-[#303030] placeholder-[#707884]/60 transition-all focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#E85D04]/30 sm:text-xs md:text-sm 2xl:py-3.5 2xl:pl-11 2xl:text-base"
                  />
                </div>
              </div>

              {/* Clearance Tier Grid */}
              <div className="space-y-1.5">
                <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
                  CLEARANCE TIER
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, role: 'Admin' }))
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 font-sans text-xs font-medium transition-all sm:text-xs md:text-sm 2xl:p-3.5 2xl:text-base ${
                      formData.role === 'Admin'
                        ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04] shadow-sm'
                        : 'border-[#E6E2D8] bg-[#F7F5F0]/60 text-[#707884] hover:border-[#D5CEBF] hover:text-[#303030]'
                    }`}
                  >
                    <UserCheck className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
                    <span>Standard Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, role: 'SuperAdmin' }))
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 font-sans text-xs font-medium transition-all sm:text-xs md:text-sm 2xl:p-3.5 2xl:text-base ${
                      formData.role === 'SuperAdmin'
                        ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04] shadow-sm'
                        : 'border-[#E6E2D8] bg-[#F7F5F0]/60 text-[#707884] hover:border-[#D5CEBF] hover:text-[#303030]'
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
                    <span>SuperAdmin (Root)</span>
                  </button>
                </div>
              </div>

              {/* Temporary Passphrase Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
                    TEMPORARY PASSPHRASE
                  </label>
                  <button
                    type="button"
                    id="gen-pwd-btn"
                    onClick={generateSecurePassword}
                    className="flex items-center gap-1 font-sans text-[11px] font-semibold text-[#E85D04] hover:underline 2xl:text-xs"
                  >
                    <Sparkles className="h-3 w-3 2xl:h-3.5 2xl:w-3.5" />
                    <span>Generate Key</span>
                  </button>
                </div>

                <div className="group relative flex items-center">
                  <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#707884] group-focus-within:text-[#E85D04] 2xl:h-5 2xl:w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/50 py-2.5 pl-10 pr-10 font-sans text-xs text-[#303030] placeholder-[#707884]/60 transition-all focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#E85D04]/30 sm:text-xs md:text-sm 2xl:py-3.5 2xl:pl-11 2xl:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#707884] hover:text-[#303030]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 2xl:h-5 2xl:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 2xl:h-5 2xl:w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-4 py-2 font-sans text-xs text-[#707884] transition-colors hover:bg-[#F7F5F0] hover:text-[#303030] sm:text-xs 2xl:py-2.5 2xl:text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-[#303030] px-5 py-2 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] disabled:opacity-50 sm:text-xs 2xl:py-2.5 2xl:text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin 2xl:h-4 2xl:w-4" />
                      <span>Enrolling...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Enrollment</span>
                      <ArrowRight className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
);

ProvisionAdminModal.displayName = 'ProvisionAdminModal';

export default ProvisionAdminModal;