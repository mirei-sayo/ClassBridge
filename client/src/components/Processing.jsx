import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';

const Processing = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl mx-auto h-[400px]">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
        <div className="relative glass w-full h-full rounded-full flex items-center justify-center border-indigo-500/50">
          <BrainCircuit className="w-16 h-16 text-indigo-400 animate-pulse" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          AI is scanning your announcements
        </h2>
        <p className="text-slate-400">Extracting deadlines, subjects, and task details...</p>
      </div>

      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex items-center space-x-2 text-indigo-400 text-sm font-mono">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{progress}% Optimized Data Extraction</span>
      </div>
    </div>
  );
};

export default Processing;
