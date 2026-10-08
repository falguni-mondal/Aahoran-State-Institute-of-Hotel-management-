import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Building2,
  ShieldCheck,
  QrCode,
  KeyRound,
  Copy,
  Check,
  ArrowRight,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Smartphone,
  Sparkles,
  Shield,
} from 'lucide-react';
import apiClient from '../api/axios.js';

const Setup2FA = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const preAuthToken = location.state?.preAuthToken;
  const email = location.state?.email || 'Authorized Personnel';
  const from = location.state?.from;

  const [qrCode, setQrCode] = useState('');
  const [manualSecret, setManualSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Animation References
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const qrFrameRef = useRef(null);
  const scanBeamRef = useRef(null);
  const elementsRef = useRef([]);

  // Memory Redirect Guard
  useEffect(() => {
    if (!preAuthToken) {
      navigate('/login', { replace: true });
    }
  }, [preAuthToken, navigate]);

  // Request 2FA Setup Payload
  const fetchSetupDetails = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.post(
        '/auth/setup-2fa',
        {},
        {
          headers: {
            Authorization: `Bearer ${preAuthToken}`,
          },
        }
      );

      setQrCode(response.data.qrCode);
      setManualSecret(response.data.manualSecret);
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        'Unable to initialize 2FA provisioning. The pre-authorization session may have elapsed.';
      setErrorMessage(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (preAuthToken) {
      fetchSetupDetails();
    }
  }, [preAuthToken]);

  // Staggered Warm Editorial Entrance
  useGSAP(
    () => {
      if (isLoading || !qrCode) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 35, scale: 0.99 },
        { opacity: 1, y: 0, scale: 1, duration: 1 }
      )
        .fromTo(
          qrFrameRef.current,
          { opacity: 0, scale: 0.92, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)' },
          '-=0.6'
        )
        .fromTo(
          elementsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          '-=0.4'
        );

      // Subtle Terracotta Scanning Sweep
      if (scanBeamRef.current) {
        gsap.fromTo(
          scanBeamRef.current,
          { y: -8, opacity: 0 },
          {
            y: 200,
            opacity: 0.8,
            repeat: -1,
            yoyo: true,
            duration: 2.4,
            ease: 'sine.inOut',
          }
        );
      }
    },
    { scope: containerRef, dependencies: [isLoading, qrCode] }
  );

  const handleCopyKey = async () => {
    if (!manualSecret) return;

    try {
      await navigator.clipboard.writeText(manualSecret);
      setIsCopied(true);

      gsap.fromTo(
        '#copy-key-icon',
        { scale: 0.7, rotate: -15 },
        { scale: 1, rotate: 0, duration: 0.3, ease: 'back.out(2)' }
      );

      setTimeout(() => setIsCopied(false), 2200);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    }
  };

  const handleProceed = () => {
    gsap.to(cardRef.current, {
      opacity: 0,
      y: -20,
      scale: 0.99,
      duration: 0.35,
      ease: 'power3.in',
      onComplete: () => {
        navigate('/verify-2fa', {
          state: {
            preAuthToken,
            email,
            from,
          },
          replace: true,
        });
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center bg-[#F7F5F0] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24"
    >
      {/* Subtle Warm Institutional Architectural Watermark Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#E6E2D8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,93,4,0.04),transparent_50%)]" />

      {/* Main Container Card */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_20px_50px_rgba(48,48,48,0.05)] sm:p-8 md:max-w-xl md:p-10 lg:max-w-2xl lg:p-12 xl:max-w-2xl 2xl:max-w-3xl 2xl:p-16"
      >
        {/* Header Protocol Bar */}
        <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-13 2xl:w-13">
              <Building2 className="h-5 w-5 2xl:h-6 2xl:w-6" />
            </div>
            <div>
              <span className="block font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E85D04] 2xl:text-xs">
                PROVISIONING SEQUENCE
              </span>
              <span className="block font-serif text-xs italic text-[#707884] 2xl:text-sm">
                Multi-Factor Device Registration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[#E6E2D8] bg-[#F7F5F0] px-3 py-1 font-sans text-[10px] font-medium text-[#707884] 2xl:text-xs">
            <Smartphone className="h-3 w-3 text-[#E85D04]" />
            RFC 6238 TOTP
          </div>
        </div>

        {/* Dynamic State Management */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#E6E2D8] border-t-[#E85D04]" />
            </div>
            <p className="mt-4 font-sans text-xs tracking-wider uppercase text-[#707884] 2xl:text-sm">
              Generating Cryptographic Keypair...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="my-8 space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-800 sm:text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <div className="leading-relaxed">
                <span className="font-semibold">Setup Interrupted:</span> {errorMessage}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-4 py-2 font-sans text-xs text-[#707884] transition-colors hover:bg-[#F7F5F0] hover:text-[#303030]"
              >
                Return to Login
              </button>
              <button
                type="button"
                onClick={fetchSetupDetails}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#303030] px-4 py-2 font-sans text-xs font-medium text-[#F7F5F0] transition-colors hover:bg-[#E85D04]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6 2xl:mt-8 2xl:space-y-8">
            <div>
              <h1 className="font-serif text-2xl font-normal tracking-tight text-[#303030] sm:text-3xl lg:text-3xl 2xl:text-4xl">
                Bind Authenticator <span className="italic text-[#E85D04]">Device</span>
              </h1>
              <p className="mt-1.5 font-sans text-xs text-[#707884] sm:text-sm 2xl:text-base">
                Scan the security barcode using Google Authenticator, Microsoft Authenticator, or input the manual provisioning secret.
              </p>
            </div>

            {/* Barcode & Instruction Panel */}
            <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-[#E6E2D8] bg-[#F7F5F0]/60 p-6 md:flex-row md:items-stretch md:p-8 2xl:gap-8 2xl:p-10">
              {/* QR Image with Institutional Focus Corners */}
              <div
                ref={qrFrameRef}
                className="relative flex h-52 w-52 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E6E2D8] bg-white p-3 shadow-[0_4px_20px_rgba(48,48,48,0.06)] 2xl:h-60 2xl:w-60"
              >
                {/* Institutional Reticle Brackets */}
                <div className="pointer-events-none absolute left-1.5 top-1.5 h-3.5 w-3.5 border-l-2 border-t-2 border-[#E85D04]" />
                <div className="pointer-events-none absolute right-1.5 top-1.5 h-3.5 w-3.5 border-r-2 border-t-2 border-[#E85D04]" />
                <div className="pointer-events-none absolute bottom-1.5 left-1.5 h-3.5 w-3.5 border-b-2 border-l-2 border-[#E85D04]" />
                <div className="pointer-events-none absolute bottom-1.5 right-1.5 h-3.5 w-3.5 border-b-2 border-r-2 border-[#E85D04]" />

                {/* Terracotta Focus Line */}
                <div
                  ref={scanBeamRef}
                  className="pointer-events-none absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E85D04] to-transparent shadow-[0_0_8px_#E85D04]"
                />

                <img
                  src={qrCode}
                  alt="2FA Authentication Matrix"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Onboarding Steps */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-3 font-sans text-xs text-[#707884] sm:text-sm 2xl:text-base">
                  <div className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#D5CEBF] bg-[#FFFFFF] font-serif text-[11px] font-semibold text-[#303030]">
                      1
                    </span>
                    <span className="leading-relaxed">
                      Launch your authenticator app on your authorized hardware device.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#D5CEBF] bg-[#FFFFFF] font-serif text-[11px] font-semibold text-[#303030]">
                      2
                    </span>
                    <span className="leading-relaxed">
                      Capture the optical matrix barcode displayed on the left.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#D5CEBF] bg-[#FFFFFF] font-serif text-[11px] font-semibold text-[#303030]">
                      3
                    </span>
                    <span className="leading-relaxed">
                      Retain the active 6-digit rolling passcode for confirmation.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3.5 py-2.5 font-sans text-[11px] text-[#707884] 2xl:text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#E85D04] shrink-0" />
                  <span>Standard 30-second rotating cryptographic cycle</span>
                </div>
              </div>
            </div>

            {/* Manual Provisioning Secret */}
            <div
              ref={(el) => (elementsRef.current[0] = el)}
              className="space-y-2 rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/40 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-[#E85D04]" />
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs">
                    Manual Configuration Secret
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSecretRevealed(!isSecretRevealed)}
                  className="flex items-center gap-1.5 font-sans text-[11px] font-medium text-[#707884] transition-colors hover:text-[#303030] 2xl:text-xs"
                >
                  {isSecretRevealed ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Mask Secret</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      <span>Reveal Secret</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E6E2D8] bg-[#FFFFFF] px-3.5 py-2.5">
                <span className="font-mono text-xs tracking-wider text-[#303030] break-all select-all sm:text-sm">
                  {isSecretRevealed
                    ? manualSecret
                    : manualSecret
                    ? '•'.repeat(Math.min(manualSecret.length, 32))
                    : '••••••••••••••••••••••••••••••••'}
                </span>

                <button
                  id="copy-key-btn"
                  type="button"
                  onClick={handleCopyKey}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E6E2D8] bg-[#F7F5F0] px-3 py-1.5 font-sans text-[11px] font-medium text-[#303030] transition-colors hover:border-[#D5CEBF] hover:bg-[#EFECE6] 2xl:text-xs"
                >
                  <span id="copy-key-icon">
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5 text-[#E85D04]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-[#707884]" />
                    )}
                  </span>
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Navigation & Proceed Triggers */}
            <div
              ref={(el) => (elementsRef.current[1] = el)}
              className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between 2xl:pt-4"
            >
              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="font-sans text-xs text-[#707884] transition-colors hover:text-[#303030] 2xl:text-sm"
              >
                Abort & Return to Sign In
              </button>

              <button
                type="button"
                onClick={handleProceed}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#303030] px-6 py-3.5 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] sm:text-sm 2xl:py-4 2xl:text-base"
              >
                <span>Proceed to Verification</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* Telemetry Footer */}
        <div className="mt-6 border-t border-[#E6E2D8] pt-5 text-center font-sans text-[11px] text-[#707884] sm:flex sm:items-center sm:justify-between sm:text-left 2xl:text-xs">
          <span>TARGET PERSONNEL: {email}</span>
          <span className="mt-1 block sm:mt-0">SPECIFICATION: HMAC-SHA1 BASE32</span>
        </div>
      </div>
    </div>
  );
};

export default Setup2FA;