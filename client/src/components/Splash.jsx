import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Sparkles, ArrowRight } from 'lucide-react';

const Splash = ({ onEnter }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl mx-auto min-h-screen text-center">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping blur-xl"></div>
        <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/50">
          <LayoutDashboard className="w-12 h-12 text-white" />
        </div>
      </div>

      <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
        Class<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Bridge</span>
      </h1>
      <p className="text-xl text-slate-400 mb-12 max-w-md">
        Your AI Academic Assistant. Turn fragmented announcements into actionable tasks.
      </p>

      {loading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-indigo-400 font-mono text-sm tracking-widest uppercase">Initializing System...</span>
        </div>
      ) : (
        <button 
          onClick={onEnter}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-2xl hover:bg-indigo-500 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-lg shadow-indigo-500/30 scale-100 hover:scale-105 active:scale-95"
        >
          <span className="mr-2">Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default Splash;
