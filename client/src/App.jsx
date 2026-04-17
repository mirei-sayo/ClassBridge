import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Upload from './components/Upload';
import Processing from './components/Processing';
import Review from './components/Review';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabaseClient';

function App() {
  const [currentStep, setCurrentStep] = useState('LOADING');
  const [uploadedData, setUploadedData] = useState(null);
  const [extractedTasks, setExtractedTasks] = useState([]);

  // On app load, check if the student already has tasks saved
  useEffect(() => {
    const checkExistingTasks = async () => {
      try {
        const { count, error } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true });

        if (!error && count > 0) {
          // Returning user — go straight to Dashboard
          setCurrentStep('DASHBOARD');
        } else {
          // First-time user — show the onboarding splash
          setCurrentStep('SPLASH');
        }
      } catch {
        // If Supabase is unreachable, default to splash
        setCurrentStep('SPLASH');
      }
    };

    checkExistingTasks();
  }, []);

  const startApp = () => {
    setCurrentStep('UPLOAD');
  };

  const handleUpload = (data) => {
    setUploadedData(data);
    setCurrentStep('PROCESSING');
  };

  const finishProcessing = (tasks) => {
    setExtractedTasks(tasks);
    setCurrentStep('REVIEW');
  };

  const confirmTasks = () => {
    setCurrentStep('DASHBOARD');
  };

  const resetToUpload = () => {
    setCurrentStep('UPLOAD');
    setUploadedData(null);
    setExtractedTasks([]);
  };

  return (
    <div className={`min-h-screen w-full bg-[#0a0a0a] text-slate-200 ${
      currentStep === 'DASHBOARD' ? '' : 'flex items-center justify-center'
    } overflow-x-hidden`}>
      {currentStep === 'LOADING' && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div>
          <p className="text-slate-500 text-sm">Loading your workspace...</p>
        </div>
      )}

      {currentStep === 'SPLASH' && (
        <Splash onEnter={startApp} />
      )}

      {currentStep === 'UPLOAD' && (
        <Upload onUpload={handleUpload} />
      )}
      
      {currentStep === 'PROCESSING' && (
        <Processing data={uploadedData} onComplete={finishProcessing} />
      )}
      
      {currentStep === 'REVIEW' && (
        <Review tasks={extractedTasks} onConfirm={confirmTasks} />
      )}
      
      {currentStep === 'DASHBOARD' && (
        <Dashboard onAddClick={resetToUpload} />
      )}
    </div>
  );
}

export default App;
