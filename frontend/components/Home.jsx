import React from 'react';
import Sidebar from './Sidebar';
import MessageContainer from './MessageContainer';
import { useChat } from '../src/context/ChatContext';

const Home = () => {
  const { isMobileChatOpen } = useChat();

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#0c39b8] p-2 sm:p-4 md:p-6 overflow-hidden text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
      {/* Background Graphic with Elegant Wave Curves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Base Rich Royal Blue Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a55e2] via-[#0f3ebf] to-[#07247a]" />

        {/* Ambient Radial Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3b72f5]/25 rounded-full blur-[160px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2563eb]/35 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#092b8d]/60 rounded-full blur-[120px]" />

        {/* Fluid Wave Lines */}
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M -200 180 C 150 420, 600 60, 1640 380"
            stroke="url(#homeWaveGrad1)"
            strokeWidth="140"
            strokeLinecap="round"
          />
          <path
            d="M -150 560 C 350 320, 900 860, 1640 300"
            stroke="url(#homeWaveGrad2)"
            strokeWidth="110"
            strokeLinecap="round"
          />
          <path
            d="M -100 820 C 450 540, 1000 980, 1600 620"
            stroke="url(#homeWaveGrad1)"
            strokeWidth="160"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="homeWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="homeWaveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Decorative subtle ambient particles */}
        <div className="absolute top-[15%] left-[20%] w-2 h-2 bg-white/30 rounded-full blur-[0.5px]" />
        <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 bg-white/40 rounded-full blur-[0.5px] animate-pulse" />
        <div className="absolute bottom-[25%] left-[30%] w-2 h-2 bg-sky-200/40 rounded-full blur-[0.5px]" />
      </div>

      {/* Main Ceramic Chat Shell Container */}
      <div className="relative z-10 w-full max-w-7xl h-full flex flex-col min-h-0 rounded-[28px] sm:rounded-[36px] bg-white/98 shadow-[0_25px_70px_-15px_rgba(5,20,80,0.5),0_0_0_1px_rgba(255,255,255,0.9)_inset] border border-white/60 overflow-hidden backdrop-blur-2xl">
        <div className="relative w-full h-full min-h-0 flex flex-row overflow-hidden">
          {/* Sidebar Pane */}
          <div
            className={`w-full md:w-80 lg:w-96 flex-shrink-0 h-full flex flex-col min-h-0 border-r border-slate-200/80 overflow-hidden ${
              isMobileChatOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            <Sidebar />
          </div>

          {/* Messages Main Pane */}
          <div
            className={`flex-1 h-full min-w-0 flex flex-col min-h-0 overflow-hidden ${
              !isMobileChatOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            <MessageContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
