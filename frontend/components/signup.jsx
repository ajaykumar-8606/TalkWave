import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import toast from 'react-hot-toast';
import {
  IoPersonOutline,
  IoAtOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCheckmark,
  IoChevronDown,
  IoFlashOutline,
} from 'react-icons/io5';

const Signup = ({ onSwitchToLogin }) => {
  const {
    formData,
    handleChange,
    handleGenderSelect,
    handleSubmit,
    genderOptions,
    loading,
    error,
    success,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [activeFocus, setActiveFocus] = useState(null);
  const genderDropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(event.target)
      ) {
        setIsGenderOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onGenderSelect = (val) => {
    handleGenderSelect(val);
    setIsGenderOpen(false);
  };

  const selectedGender =
    genderOptions?.find((g) => g.value === formData.gender) ||
    genderOptions?.[0] || { label: 'Male', value: 'male' };
  const passwordsMatch =
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;
  const passwordsMismatch =
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  // Strong password requirements
  const password = formData.password || '';
  const passwordRules = [
    { id: 'length', label: '8+ chars', met: password.length >= 8 },
    { id: 'upper', label: 'A-Z', met: /[A-Z]/.test(password) },
    { id: 'lower', label: 'a-z', met: /[a-z]/.test(password) },
    { id: 'number', label: '0-9', met: /[0-9]/.test(password) },
    {
      id: 'special',
      label: 'Special (!@#...)',
      met: /[!@#$%^&*(),.?":{}|<>_\-+=\\/[\]]/.test(password),
    },
  ];
  const passedRulesCount = passwordRules.filter((r) => r.met).length;

  let strengthLabel = '';
  let strengthColor = 'bg-slate-300';
  let strengthTextColor = 'text-slate-400';
  if (password.length > 0) {
    if (passedRulesCount <= 2) {
      strengthLabel = 'Weak';
      strengthColor = 'bg-rose-500';
      strengthTextColor = 'text-rose-500';
    } else if (passedRulesCount <= 4) {
      strengthLabel = 'Medium';
      strengthColor = 'bg-amber-500';
      strengthTextColor = 'text-amber-500';
    } else {
      strengthLabel = 'Strong';
      strengthColor = 'bg-emerald-500';
      strengthTextColor = 'text-emerald-500';
    }
  }

  // Helper for quick testing
  const handleAutofillDemo = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const mockUser = {
      target: { name: 'fullName', value: 'Taylor Brooks' },
    };
    handleChange(mockUser);
    handleChange({
      target: { name: 'userName', value: `taylor_${randomSuffix}` },
    });
    handleChange({ target: { name: 'password', value: 'Pulse@2026' } });
    handleChange({
      target: { name: 'confirmPassword', value: 'Pulse@2026' },
    });
    handleGenderSelect('female');
    toast.success('Test details filled! Click Create Account.', {
      duration: 3000,
      icon: '⚡',
      style: {
        background: '#ffffff',
        color: '#1e293b',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        fontSize: '13px',
      },
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12 overflow-x-hidden overflow-y-auto bg-[#0c39b8] antialiased select-none">
      {/* ================= Enhanced Wave Background ================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Deep Royal Blue Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a55e2] via-[#0f3ebf] to-[#07247a]" />

        {/* Radial Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#3b72f5]/30 rounded-full blur-[140px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2563eb]/35 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#092b8d]/60 rounded-full blur-[120px]" />

        {/* Fluid Wave Lines */}
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M -200 180 C 150 420, 600 60, 1640 380"
            stroke="url(#signupWaveGrad1)"
            strokeWidth="140"
            strokeLinecap="round"
          />
          <path
            d="M -150 560 C 350 320, 900 860, 1640 300"
            stroke="url(#signupWaveGrad2)"
            strokeWidth="110"
            strokeLinecap="round"
          />
          <path
            d="M -100 820 C 450 540, 1000 980, 1600 620"
            stroke="url(#signupWaveGrad1)"
            strokeWidth="160"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="signupWaveGrad1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient
              id="signupWaveGrad2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Subtle decorative floating particles */}
        <div className="absolute top-[20%] left-[18%] w-2 h-2 bg-white/40 rounded-full blur-[0.5px] animate-pulse" />
        <div className="absolute top-[32%] right-[22%] w-1.5 h-1.5 bg-white/30 rounded-full blur-[0.5px]" />
        <div className="absolute bottom-[22%] left-[24%] w-2 h-2 bg-sky-200/40 rounded-full blur-[0.5px]" />
      </div>

      {/* ================= Enhanced Floating Card Container ================= */}
      <div className="relative z-10 w-full max-w-[370px] sm:max-w-[400px] my-auto">
        <div className="w-full bg-white/98 backdrop-blur-2xl rounded-[34px] px-8 sm:px-9 pt-8 sm:pt-10 pb-7 sm:pb-8 shadow-[0_20px_50px_-10px_rgba(7,25,90,0.38),0_0_0_1px_rgba(255,255,255,0.8)_inset,0_30px_70px_-15px_rgba(5,20,80,0.45)] transition-all">
          {/* Subtle PulseChat Brand Header Pill */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-semibold text-slate-600 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-800">
                Pulse<span className="text-blue-600">Chat</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] text-slate-500 font-normal">
                Register
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-5">
            <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#2e384d] tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-[#8a95a5] mt-1 font-normal">
              Join PulseChat for real-time instant messaging
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-xs text-rose-600 flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-200">
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-xs text-emerald-600 flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div className="relative group">
              <span
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  activeFocus === 'fullName'
                    ? 'text-[#f47858]'
                    : 'text-[#9aa4b2]'
                }`}
              >
                <IoPersonOutline className="w-[18px] h-[18px]" />
              </span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setActiveFocus('fullName')}
                onBlur={() => setActiveFocus(null)}
                placeholder="Full Name"
                autoComplete="name"
                className={`w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-full text-sm text-[#2e384d] placeholder-[#9aa4b2] transition-all duration-200 outline-none font-normal ${
                  activeFocus === 'fullName'
                    ? 'bg-white border border-[#f47858]/50 ring-3 ring-[#f47858]/15 shadow-sm'
                    : 'bg-[#f1f3f7] border border-transparent hover:bg-[#edf0f5]'
                }`}
              />
            </div>

            {/* Username */}
            <div className="relative group">
              <span
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  activeFocus === 'userName'
                    ? 'text-[#f47858]'
                    : 'text-[#9aa4b2]'
                }`}
              >
                <IoAtOutline className="w-[18px] h-[18px]" />
              </span>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                value={formData.userName}
                onChange={handleChange}
                onFocus={() => setActiveFocus('userName')}
                onBlur={() => setActiveFocus(null)}
                placeholder="Username (e.g. alexmorgan)"
                autoComplete="username"
                className={`w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-full text-sm text-[#2e384d] placeholder-[#9aa4b2] transition-all duration-200 outline-none font-normal ${
                  activeFocus === 'userName'
                    ? 'bg-white border border-[#f47858]/50 ring-3 ring-[#f47858]/15 shadow-sm'
                    : 'bg-[#f1f3f7] border border-transparent hover:bg-[#edf0f5]'
                }`}
              />
            </div>

            {/* Gender Capsule Selector */}
            <div className="relative" ref={genderDropdownRef}>
              <button
                type="button"
                onClick={() => setIsGenderOpen(!isGenderOpen)}
                className={`w-full pl-4 pr-4 py-2.5 sm:py-3 rounded-full text-sm flex items-center justify-between text-[#2e384d] transition-all duration-200 outline-none cursor-pointer ${
                  isGenderOpen
                    ? 'bg-white border border-[#f47858]/50 ring-3 ring-[#f47858]/15 shadow-sm'
                    : 'bg-[#f1f3f7] border border-transparent hover:bg-[#edf0f5]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#9aa4b2]">Gender:</span>
                  <span className="font-medium text-[#2e384d]">
                    {selectedGender.label}
                  </span>
                </div>
                <IoChevronDown
                  className={`w-4 h-4 text-[#9aa4b2] transition-transform duration-200 ${
                    isGenderOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Gender Dropdown Menu */}
              {isGenderOpen && (
                <div className="absolute left-0 right-0 mt-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl z-30 animate-in fade-in duration-150">
                  {genderOptions?.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onGenderSelect(opt.value)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        formData.gender === opt.value
                          ? 'bg-[#f47858]/10 text-[#f47858]'
                          : 'text-[#475569] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {opt.icon}
                        <span>{opt.label}</span>
                      </div>
                      {formData.gender === opt.value && (
                        <IoCheckmark className="w-4 h-4 text-[#f47858]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="relative group">
              <span
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  activeFocus === 'password'
                    ? 'text-[#f47858]'
                    : 'text-[#9aa4b2]'
                }`}
              >
                <IoLockClosedOutline className="w-[18px] h-[18px]" />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setActiveFocus('password')}
                onBlur={() => setActiveFocus(null)}
                placeholder="Create Password"
                autoComplete="new-password"
                className={`w-full pl-11 pr-11 py-2.5 sm:py-3 rounded-full text-sm text-[#2e384d] placeholder-[#9aa4b2] transition-all duration-200 outline-none font-normal ${
                  activeFocus === 'password'
                    ? 'bg-white border border-[#f47858]/50 ring-3 ring-[#f47858]/15 shadow-sm'
                    : 'bg-[#f1f3f7] border border-transparent hover:bg-[#edf0f5]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9aa4b2] hover:text-[#475569] active:scale-95 transition-all cursor-pointer"
              >
                {showPassword ? (
                  <IoEyeOffOutline className="w-[18px] h-[18px]" />
                ) : (
                  <IoEyeOutline className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>

            {/* Password Strength Micro-Meter */}
            {password.length > 0 && (
              <div className="px-2 pt-0.5 pb-1">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#8a95a5]">Strength</span>
                  <span className={`font-semibold ${strengthTextColor}`}>
                    {strengthLabel}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      passedRulesCount >= 1 ? strengthColor : 'bg-transparent'
                    } flex-1`}
                  />
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      passedRulesCount >= 3 ? strengthColor : 'bg-transparent'
                    } flex-1`}
                  />
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      passedRulesCount >= 5 ? strengthColor : 'bg-transparent'
                    } flex-1`}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative group">
              <span
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  activeFocus === 'confirmPassword'
                    ? 'text-[#f47858]'
                    : 'text-[#9aa4b2]'
                }`}
              >
                <IoLockClosedOutline className="w-[18px] h-[18px]" />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setActiveFocus('confirmPassword')}
                onBlur={() => setActiveFocus(null)}
                placeholder="Confirm Password"
                autoComplete="new-password"
                className={`w-full pl-11 pr-11 py-2.5 sm:py-3 rounded-full text-sm text-[#2e384d] placeholder-[#9aa4b2] transition-all duration-200 outline-none font-normal ${
                  passwordsMismatch
                    ? 'bg-rose-50/50 border border-rose-300 ring-2 ring-rose-200'
                    : passwordsMatch
                    ? 'bg-emerald-50/50 border border-emerald-300 ring-2 ring-emerald-200'
                    : activeFocus === 'confirmPassword'
                    ? 'bg-white border border-[#f47858]/50 ring-3 ring-[#f47858]/15 shadow-sm'
                    : 'bg-[#f1f3f7] border border-transparent hover:bg-[#edf0f5]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9aa4b2] hover:text-[#475569] active:scale-95 transition-all cursor-pointer"
              >
                {showConfirmPassword ? (
                  <IoEyeOffOutline className="w-[18px] h-[18px]" />
                ) : (
                  <IoEyeOutline className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>

            {/* Submit Sunset Gradient Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full relative group overflow-hidden py-3.5 rounded-full text-white font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-[#fca639] via-[#f47858] to-[#ea5575] hover:opacity-95 active:scale-[0.98] shadow-[0_8px_22px_rgba(244,120,88,0.36),0_1px_0_rgba(255,255,255,0.35)_inset] hover:shadow-[0_12px_28px_rgba(244,120,88,0.48)] transition-all duration-200 cursor-pointer ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {/* Top gloss sheen */}
                <span className="absolute inset-x-0 top-0 h-[1px] bg-white/35 rounded-t-full pointer-events-none" />

                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <span>CREATE ACCOUNT</span>
                    <span className="text-white/80 group-hover:translate-x-1 transition-transform duration-200 font-normal">
                      →
                    </span>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login Link */}
          <div className="mt-5 text-center text-xs text-[#8a95a5]">
            Already a member?{' '}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#3b66de] hover:text-[#254fc7] font-semibold transition-colors cursor-pointer hover:underline underline-offset-4"
              >
                Sign in now
              </button>
            ) : (
              <a
                href="/login"
                className="text-[#3b66de] hover:text-[#254fc7] font-semibold transition-colors hover:underline underline-offset-4"
              >
                Sign in now
              </a>
            )}
          </div>

          {/* Quick Demo Autofill Helper */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center">
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100/90 border border-slate-200/70 text-[11px] font-medium text-slate-500 hover:text-[#f47858] transition-colors cursor-pointer"
            >
              <IoFlashOutline className="w-3 h-3 text-amber-500" />
              <span>Autofill test details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
