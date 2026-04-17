import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Upload from './components/Upload';
import Processing from './components/Processing';
import Review from './components/Review';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { supabase } from './lib/supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [currentStep, setCurrentStep] = useState('LOADING');
  const [uploadedData, setUploadedData] = useState(null);
  const [extractedTasks, setExtractedTasks] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
         setCurrentStep('LOADING'); // Reset when logged out
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // When session changes, check if they are new or returning, ONLY on initial load
  useEffect(() => {
    if (!session || currentStep !== 'LOADING') return;

    const checkExistingTasks = async () => {
      try {
        const { count, error } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);

        if (!error && count > 0) {
          setCurrentStep('DASHBOARD');
        } else {
          setCurrentStep('SPLASH');
        }
      } catch {
        setCurrentStep('SPLASH');
      }
    };

    checkExistingTasks();
  }, [session, currentStep]);

  const startApp = () => {
    setCurrentStep('UPLOAD');
  };

  const handleUpload = (data) => {
    setUploadedData(data);
    setCurrentStep('PROCESSING');
  };

  const finishProcessing = (tasks) => {
    if (tasks.length === 0) {
      alert("We couldn't find any actionable academic tasks in this image. Please ensure the screenshot contains keywords like 'quiz', 'deadline', or 'activity' before uploading.");
      setCurrentStep('UPLOAD');
      setUploadedData(null);
      return;
    }
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

  if (!session) {
    return <Login />;
  }

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
        <Review tasks={extractedTasks} onConfirm={confirmTasks} user={session.user} />
      )}
      
      {currentStep === 'DASHBOARD' && (
        <Dashboard onAddClick={resetToUpload} user={session.user} />
      )}
    </div>
  );
}

export default App;
