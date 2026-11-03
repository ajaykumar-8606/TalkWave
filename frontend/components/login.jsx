import React, { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import toast from 'react-hot-toast';
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from 'react-icons/io5';
import TalkWaveLogo from './TalkWaveLogo';

const Login = ({ onSwitchToSignup }) => {
  const { login, loading, error, success, setError } = useAuth();

  const [credentials, setCredentials] = useState({
    userName: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast(
      'To test or explore TalkWave, you can register a new account in seconds or use demo credentials.',
      {
        icon: '🔑',
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
        },
      }
    );
  };

  const handleFillDemo = () => {
    setCredentials({
      userName: 'alexmorgan',
      password: 'Alex@1234',
    });
    if (error) setError('');
    toast.success('Demo credentials loaded!', {
      duration: 3000,
      style: {
        background: '#ffffff',
        color: '#1f2937',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
      },
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#103ebc]">
      {/* Background Graphic with Elegant Wave Curves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep blue rich gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a50db] via-[#103ebc] to-[#0a2988]" />

        {/* Ambient radial glows */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(circle at 15% 35%, rgba(46, 98, 240, 0.6) 0%, transparent 55%), radial-gradient(circle at 85% 70%, rgba(16, 52, 160, 0.7) 0%, transparent 60%)',
          }}
        />

        {/* Fluid curved wave lines matching the reference art */}
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M -200 200 C 200 450, 700 100, 1640 400"
            stroke="white"
            strokeWidth="110"
            strokeLinecap="round"
          />
          <path
            d="M -150 550 C 400 300, 950 850, 1640 320"
            stroke="white"
            strokeWidth="90"
            strokeLinecap="round"
          />
          <path
            d="M -100 800 C 500 500, 1000 950, 1600 650"
            stroke="white"
            strokeWidth="140"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-[32px] px-7 sm:px-8 pt-9 sm:pt-11 pb-8 sm:pb-9 shadow-[0_25px_60px_-15px_rgba(5,20,80,0.5)] transition-all">
        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center mb-6">
          <TalkWaveLogo size="md" className="mb-2" />
          <h1 className="text-2xl sm:text-[24px] font-bold text-[#424d5e] tracking-tight mt-1">
            Welcome Back
          </h1>
          <p className="text-xs text-[#8a95a5] mt-0.5">
            Sign in to start messaging on TalkWave
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 text-center animate-in fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-600 text-center animate-in fade-in">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Username Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9aa4b2]">
              <IoPersonOutline className="w-[18px] h-[18px]" />
            </span>
            <input
              id="userName"
              name="userName"
              type="text"
              required
              value={credentials.userName}
              onChange={handleChange}
              placeholder="Username"
              autoComplete="username"
              className="w-full pl-11 pr-4 py-3 bg-[#f2f4f7] rounded-full text-sm text-[#374151] placeholder-[#9aa4b2] border border-transparent focus:outline-none focus:bg-[#edf0f5] focus:ring-2 focus:ring-[#f77754]/30 transition-all font-normal"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9aa4b2]">
              <IoLockClosedOutline className="w-[18px] h-[18px]" />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full pl-11 pr-11 py-3 bg-[#f2f4f7] rounded-full text-sm text-[#374151] placeholder-[#9aa4b2] border border-transparent focus:outline-none focus:bg-[#edf0f5] focus:ring-2 focus:ring-[#f77754]/30 transition-all font-normal"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9aa4b2] hover:text-[#64748b] transition-colors cursor-pointer"
            >
              {showPassword ? (
                <IoEyeOffOutline className="w-[18px] h-[18px]" />
              ) : (
                <IoEyeOutline className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>

          {/* Remember Me Checkbox */}
          <div className="pt-1 pb-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer ${
                  rememberMe
                    ? 'bg-[#f7993a]'
                    : 'border border-gray-300 bg-white'
                }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs text-[#7c889b] font-normal">
                Remember me
              </span>
            </label>
          </div>

          {/* Submit Gradient Capsule Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-full text-white font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-[#fca639] via-[#f47858] to-[#ea5575] hover:opacity-95 active:scale-[0.99] shadow-[0_8px_20px_rgba(244,120,88,0.32)] transition-all cursor-pointer ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
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
                  <span>Logging in...</span>
                </span>
              ) : (
                'LOG IN'
              )}
            </button>
          </div>

          {/* Forget Password */}
          <div className="pt-1 pb-10 sm:pb-12 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-[#8a95a5] hover:text-[#525f70] transition-colors cursor-pointer"
            >
              Forget Password
            </button>
          </div>
        </form>

        {/* Footer Link: Not a member? Sign up now */}
        <div className="text-center text-xs text-[#8a95a5]">
          Not a member?{' '}
          {onSwitchToSignup ? (
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-[#3b66de] hover:text-[#254fc7] font-medium transition-colors cursor-pointer"
            >
              Sign up now
            </button>
          ) : (
            <a
              href="/signup"
              className="text-[#3b66de] hover:text-[#254fc7] font-medium transition-colors"
            >
              Sign up now
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
