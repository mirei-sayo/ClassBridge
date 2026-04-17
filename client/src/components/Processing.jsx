import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, BrainCircuit, FileText } from 'lucide-react';
import { extractTasksFromInput } from '../lib/extractor';

const Processing = ({ data, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing AI vision engine...");

  useEffect(() => {
    let isMounted = true;
    
    const processData = async () => {
      try {
        // We pass a callback to the extractor to hook into its progress updates
        const extractedTasks = await extractTasksFromInput(data, (newStatus) => {
          if (isMounted) {
            setStatus(newStatus);
            // Increment progress pseudo-randomly for visual feedback
            setProgress(prev => Math.min(prev + Math.floor(Math.random() * 15) + 5, 95));
          }
        });
        
        if (isMounted) {
          setProgress(100);
          setStatus("Extraction complete!");
          // Short delay so the user sees 100%
          setTimeout(() => onComplete(extractedTasks), 800);
        }
      } catch (err) {
        console.error("Processing failed", err);
        if (isMounted) {
          setStatus("Extraction failed. Switching to manual mode.");
          setTimeout(() => onComplete([]), 1500);
        }
      }
    };
    
    processData();
    
    return () => {
      isMounted = false;
    };
  }, [data, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl mx-auto h-[400px]">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-red-700/20 rounded-full animate-ping"></div>
        <div className="relative glass w-full h-full rounded-full flex flex-col items-center justify-center border-red-700/50 overflow-hidden">
          {data?.type === 'text' ? (
            <FileText className="w-12 h-12 text-red-500 animate-pulse mb-2" />
          ) : (
            <BrainCircuit className="w-12 h-12 text-red-500 animate-pulse mb-2" />
          )}
          <div className="w-full h-1 bg-red-700/30 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          AI is analyzing your content
        </h2>
        <p className="text-slate-400 min-h-[24px]">{status}</p>
      </div>

      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-red-700 to-amber-500 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex items-center space-x-2 text-red-500 text-sm font-mono">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{Math.min(progress, 100)}% Extracted</span>
      </div>
    </div>
  );
};

export default Processing;
