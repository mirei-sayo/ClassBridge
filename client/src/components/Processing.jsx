import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, BrainCircuit, FileText } from 'lucide-react';

const Processing = ({ data, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing AI vision engine...");

  useEffect(() => {
    const statuses = [
      "Scanning document structure...",
      "Identifying academic entities...",
      "Extracting course subjects...",
      "Detecting deadline dates and times...",
      "Cross-referencing priorities...",
      "Finalizing extraction..."
    ];

    let currentStep = 0;
    
    // Simulate smart thinking status updates
    const statusInterval = setInterval(() => {
      if (currentStep < statuses.length) {
        setStatus(statuses[currentStep]);
        currentStep++;
      }
    }, 600);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          clearInterval(statusInterval);
          
          // Generate simulated extracted tasks based on input
          const mockExtractedTasks = [
            { 
              id: Date.now(), 
              title: data?.type === 'text' ? 'Extracted Reading Assignment' : 'Exam Submission', 
              subject: 'IT102', 
              date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now
              time: '11:59 PM', 
              priority: 'High' 
            },
            { 
              id: Date.now() + 1, 
              title: 'Chapter Summary', 
              subject: 'GenEd', 
              date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // 7 days from now
              time: '5:00 PM', 
              priority: 'Medium' 
            }
          ];
          
          setTimeout(() => onComplete(mockExtractedTasks), 500);
          return 100;
        }
        // Randomize speed of progress to feel more "real"
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 100);
    
    return () => {
      clearInterval(timer);
      clearInterval(statusInterval);
    };
  }, [data, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl mx-auto h-[400px]">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
        <div className="relative glass w-full h-full rounded-full flex flex-col items-center justify-center border-indigo-500/50 overflow-hidden">
          {data?.type === 'text' ? (
            <FileText className="w-12 h-12 text-indigo-400 animate-pulse mb-2" />
          ) : (
            <BrainCircuit className="w-12 h-12 text-indigo-400 animate-pulse mb-2" />
          )}
          <div className="w-full h-1 bg-indigo-500/30 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          AI is analyzing your content
        </h2>
        <p className="text-slate-400 min-h-[24px]">{status}</p>
      </div>

      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex items-center space-x-2 text-indigo-400 text-sm font-mono">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{Math.min(progress, 100)}% Extracted</span>
      </div>
    </div>
  );
};

export default Processing;
