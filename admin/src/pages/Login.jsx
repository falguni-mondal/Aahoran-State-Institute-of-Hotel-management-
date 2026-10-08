import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Building2,
  KeyRound,
} from 'lucide-react';
import apiClient from '../api/axios.js';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Animation References
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const formElementsRef = useRef([]);
  const footerRef = useRef(null);

  // Staggered Editorial Entrance Animation
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 35, scale: 0.99 },
        { opacity: 1, y: 0, scale: 1, duration: 1 }
      )
        .fromTo(
          headerRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.6'
        )
        .fromTo(
          formElementsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          '-=0.4'
        )
        .fromTo(
          footerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        );
    },
    { scope: containerRef }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const triggerErrorShake = () => {
    gsap.fromTo(
      cardRef.current,
      { x: -10 },
      {
        x: 10,
        duration: 0.08,
        repeat: 4,
        yoyo: true,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(cardRef.current, { x: 0 });
        },
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!formData.email || !formData.password) {
      setErrorMessage('Please provide both administrative email and password.');
      triggerErrorShake();
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { is2faEnabled, preAuthToken } = response.data;

      // Graceful Exit Transition
      gsap.to(cardRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.99,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          if (is2faEnabled) {
            navigate('/verify-2fa', {
              state: {
                preAuthToken,
                email: formData.email.trim(),
                from: location.state?.from,
              },
              replace: true,
            });
          } else {
            navigate('/setup-2fa', {
              state: {
                preAuthToken,
                email: formData.email.trim(),
                from: location.state?.from,
              },
              replace: true,
            });
          }
        },
      });
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        'Authentication failed. Please verify your administrative credentials.';
      setErrorMessage(serverMessage);
      triggerErrorShake();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center bg-[#F7F5F0] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24"
    >
      {/* Subtle Warm Institutional Architectural Watermark Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#E6E2D8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,93,4,0.04),transparent_50%)]" />

      {/* Main Authentication Card */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_20px_50px_rgba(48,48,48,0.05)] sm:p-8 md:max-w-lg md:p-10 lg:max-w-xl lg:p-12 xl:max-w-xl 2xl:max-w-2xl 2xl:p-16"
      >
        {/* Institutional Monogram & Header */}
        <div ref={headerRef} className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#E85D04] 2xl:h-13 2xl:w-13">
                <Building2 className="h-5 w-5 2xl:h-6 2xl:w-6" />
              </div>
              <div>
                <span className="block font-sans text-[11px] font-semibold uppercase tracking-widest text-[#E85D04] 2xl:text-xs">
                  SIHM PORTAL
                </span>
                <span className="block font-serif text-xs italic text-[#707884] 2xl:text-sm">
                  State Institute of Hotel Management
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-[#E6E2D8] bg-[#F7F5F0] px-3 py-1 font-sans text-[10px] font-medium text-[#707884] 2xl:text-xs">
              <Shield className="h-3 w-3 text-[#E85D04]" />
              SECURE ACCESS
            </div>
          </div>

          <div className="pt-2">
            <h1 className="font-serif text-2xl font-normal tracking-tight text-[#303030] sm:text-3xl lg:text-3xl 2xl:text-4xl">
              Administrative <span className="italic text-[#E85D04]">Clearance</span>
            </h1>
            <p className="mt-1.5 font-sans text-xs text-[#707884] sm:text-sm 2xl:text-base">
              Enter authorized personnel credentials to proceed to multi-factor validation.
            </p>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800 sm:text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:space-y-5 2xl:mt-8 2xl:space-y-6">
          {/* Email Identifier Input */}
          <div
            ref={(el) => (formElementsRef.current[0] = el)}
            className="space-y-1.5"
          >
            <label
              htmlFor="email"
              className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs"
            >
              ADMINISTRATIVE IDENTIFIER
            </label>
            <div className="group relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 text-[#707884] transition-colors group-focus-within:text-[#E85D04]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="superadmin@sihm.gov.in"
                className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/40 py-3 pl-10 pr-4 font-sans text-xs text-[#303030] placeholder-[#707884]/60 transition-all focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#E85D04]/30 sm:text-sm 2xl:py-3.5 2xl:text-base"
              />
            </div>
          </div>

          {/* Master Passphrase Input */}
          <div
            ref={(el) => (formElementsRef.current[1] = el)}
            className="space-y-1.5"
          >
            <label
              htmlFor="password"
              className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] 2xl:text-xs"
            >
              SECURITY PASSPHRASE
            </label>
            <div className="group relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 text-[#707884] transition-colors group-focus-within:text-[#E85D04]">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••••••••••"
                className="w-full rounded-xl border border-[#E6E2D8] bg-[#F7F5F0]/40 py-3 pl-10 pr-11 font-sans text-xs text-[#303030] placeholder-[#707884]/60 transition-all focus:border-[#E85D04] focus:bg-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#E85D04]/30 sm:text-sm 2xl:py-3.5 2xl:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#707884] transition-colors hover:text-[#303030]"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div ref={(el) => (formElementsRef.current[2] = el)} className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#303030] py-3.5 font-sans text-xs font-medium uppercase tracking-wider text-[#F7F5F0] transition-all hover:bg-[#E85D04] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm 2xl:py-4 2xl:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#F7F5F0]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Initiate Validation</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security & Affiliation Telemetry Footer */}
        <div
          ref={footerRef}
          className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[#E6E2D8] pt-5 text-center font-sans text-[11px] text-[#707884] sm:flex-row sm:text-left 2xl:text-xs"
        >
          <div className="flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-[#E85D04]" />
            <span>TWO-FACTOR TOTP REQUIRED</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-[#707884]" />
            <span>ZERO-TRUST ENFORCED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;