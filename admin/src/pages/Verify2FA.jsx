import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Building2,
  Shield,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Smartphone,
  Lock,
} from 'lucide-react';
import apiClient from '../api/axios.js';
import { setCredentials } from '../store/features/authSlice.js';

const Verify2FA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const preAuthToken = location.state?.preAuthToken;
  const email = location.state?.email || 'Authorized Personnel';

  // Ensure destination is strictly an application view, never an auth URL
  const rawFrom = location.state?.from?.pathname;
  const isAuthRoute =
    !rawFrom ||
    rawFrom === '/login' ||
    rawFrom === '/verify-2fa' ||
    rawFrom === '/setup-2fa' ||
    rawFrom === '/unauthorized';
  const targetDestination = isAuthRoute ? '/dashboard' : rawFrom;

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const inputsContainerRef = useRef(null);
  const inputRefs = useRef([]);
  const footerRef = useRef(null);

  useEffect(() => {
    if (!preAuthToken) {
      navigate('/login', { replace: true });
    }
  }, [preAuthToken, navigate]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 35, scale: 0.99 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 }
      )
        .fromTo(
          inputsContainerRef.current?.children || [],
          { opacity: 0, scale: 0.9, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.05 },
          '-=0.4'
        )
        .fromTo(
          footerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.2'
        );
    },
    { scope: containerRef }
  );

  const triggerErrorShake = () => {
    gsap.fromTo(
      inputsContainerRef.current,
      { x: -10 },
      {
        x: 10,
        duration: 0.07,
        repeat: 5,
        yoyo: true,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(inputsContainerRef.current, { x: 0 });
        },
      }
    );
  };

  const handleInputChange = (index, value) => {
    const numericChar = value.replace(/\D/g, '');

    const nextDigits = [...digits];
    nextDigits[index] = numericChar ? numericChar.slice(-1) : '';
    setDigits(nextDigits);

    if (errorMessage) setErrorMessage('');

    if (numericChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const combinedCode = nextDigits.join('');
    if (combinedCode.length === 6 && !nextDigits.includes('')) {
      executeVerification(combinedCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const nextDigits = [...digits];
        nextDigits[index - 1] = '';
        setDigits(nextDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const cleanNumbers = pastedData.replace(/\D/g, '').slice(0, 6);

    if (!cleanNumbers) return;

    const nextDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = cleanNumbers[i] || '';
    }
    setDigits(nextDigits);

    const targetFocusIndex = Math.min(cleanNumbers.length, 5);
    inputRefs.current[targetFocusIndex]?.focus();

    if (cleanNumbers.length === 6) {
      executeVerification(cleanNumbers);
    }
  };

  const executeVerification = async (codeToVerify) => {
    if (isLoading || isSuccess) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.post(
        '/auth/verify-2fa',
        {
          totpCode: codeToVerify,
        },
        {
          headers: {
            Authorization: `Bearer ${preAuthToken}`,
          },
        }
      );

      const { accessToken, user, admin } = response.data;
      const activeUser = user || admin || { email, role: 'Admin' };

      setIsSuccess(true);

      // Perform exit animation FIRST before dispatching to prevent router unmount conflicts
      const tl = gsap.timeline();
      tl.to(cardRef.current, {
        scale: 1.01,
        duration: 0.15,
        ease: 'power2.out',
      }).to(cardRef.current, {
        opacity: 0,
        y: -15,
        scale: 0.99,
        duration: 0.25,
        ease: 'power3.in',
        onComplete: () => {
          // Commit full credentials payload matching any slice shape
          dispatch(
            setCredentials({
              user: activeUser,
              role: activeUser.role,
              accessToken,
              token: accessToken,
            })
          );
          navigate(targetDestination, { replace: true });
        },
      });
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        'Verification failed. The 6-digit passcode is invalid or has expired.';
      setErrorMessage(serverMessage);
      triggerErrorShake();

      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please provide the full 6-digit rolling authentication passcode.');
      triggerErrorShake();
      return;
    }
    executeVerification(fullCode);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center bg-[#F7F5F0] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#E6E2D8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,93,4,0.04),transparent_50%)]" />

      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_20px_50px_rgba(48,48,48,0.05)] sm:p-8 md:max-w-lg md:p-10 lg:max-w-xl lg:p-12 xl:max-w-xl 2xl:max-w-2xl 2xl:p-16"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-13 2xl:w-13">
                <Building2 className="h-5 w-5 2xl:h-6 2xl:w-6" />
              </div>
              <div>
                <span className="block font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E85D04] 2xl:text-xs">
                  CLEARANCE CHALLENGE
                </span>
                <span className="block font-serif text-xs italic text-[#707884] 2xl:text-sm">
                  Second Factor Verification
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-[#E6E2D8] bg-[#F7F5F0] px-3 py-1 font-sans text-[10px] font-medium text-[#707884] 2xl:text-xs">
              <Lock className="h-3 w-3 text-[#E85D04]" />
              CHALLENGE ACTIVE
            </div>
          </div>

          <div className="pt-2">
            <h1 className="font-serif text-2xl font-normal tracking-tight text-[#303030] sm:text-3xl lg:text-3xl 2xl:text-4xl">
              Enter Authenticator <span className="italic text-[#E85D04]">Code</span>
            </h1>
            <p className="mt-1.5 font-sans text-xs text-[#707884] sm:text-sm 2xl:text-base">
              Input the rolling 6-digit TOTP code from your linked device for{' '}
              <span className="font-medium text-[#303030]">{email}</span>.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 sm:text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800 sm:text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="font-medium">Passcode verified. Establishing institutional session...</span>
          </div>
        )}

        <form onSubmit={handleManualSubmit} className="mt-6 space-y-6 sm:mt-8 2xl:mt-10 2xl:space-y-8">
          <div
            ref={inputsContainerRef}
            className="flex items-center justify-between gap-1.5 sm:gap-2.5 md:gap-3 2xl:gap-4"
          >
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={isLoading || isSuccess}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`h-12 w-10 sm:h-14 sm:w-12 md:h-16 md:w-14 lg:h-16 lg:w-14 2xl:h-20 2xl:w-16 rounded-xl border text-center font-mono text-lg sm:text-2xl 2xl:text-3xl font-semibold transition-all focus:outline-none ${
                  digit
                    ? 'border-[#E85D04] bg-[#FFFFFF] text-[#303030] shadow-[0_0_15px_rgba(232,93,4,0.12)] ring-1 ring-[#E85D04]/40'
                    : 'border-[#E6E2D8] bg-[#F7F5F0]/60 text-[#303030] placeholder-[#707884] hover:border-[#D5CEBF] focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#E85D04]/30'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              />
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isLoading || isSuccess || digits.join('').length !== 6}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#303030] py-3.5 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm 2xl:py-4 2xl:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#F7F5F0]" />
                  <span>Validating Code...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#F7F5F0]" />
                  <span>Access Granted</span>
                </>
              ) : (
                <>
                  <span>Verify & Grant Clearance</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center pt-1">
              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="font-sans text-xs text-[#707884] transition-colors hover:text-[#303030] 2xl:text-sm"
              >
                Sign out or switch administrative account
              </button>
            </div>
          </div>
        </form>

        <div
          ref={footerRef}
          className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[#E6E2D8] pt-5 text-center font-sans text-[11px] text-[#707884] sm:flex-row sm:text-left 2xl:text-xs"
        >
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-[#E85D04]" />
            <span>TIME STEP TOLERANCE: ±120s</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-[#707884]" />
            <span>SESSION ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;