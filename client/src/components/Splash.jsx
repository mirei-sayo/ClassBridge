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
        <div className="absolute inset-0 bg-red-700/20 rounded-full animate-ping blur-xl"></div>
        <div className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-2xl shadow-red-700/50">
          <img src="/logo.png" alt="ClassBridge Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
        Class<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Bridge</span>
      </h1>
      <p className="text-xl text-slate-400 mb-12 max-w-md">
        Your AI Academic Assistant. Turn fragmented announcements into actionable tasks.
      </p>

      {loading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-700/30 border-t-red-700 rounded-full animate-spin"></div>
          <span className="text-amber-500 font-mono text-sm tracking-widest uppercase">Initializing System...</span>
        </div>
      ) : (
        <button 
          onClick={onEnter}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-red-700 font-pj rounded-2xl hover:bg-red-600 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 shadow-lg shadow-red-700/30 scale-100 hover:scale-105 active:scale-95"
        >
          <span className="mr-2">Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default Splash;
