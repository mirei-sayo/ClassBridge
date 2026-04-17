import React, { useState } from 'react';
import Splash from './components/Splash';
import Upload from './components/Upload';
import Processing from './components/Processing';
import Review from './components/Review';
import Dashboard from './components/Dashboard';

function App() {
  const [currentStep, setCurrentStep] = useState('SPLASH');
  const [uploadedData, setUploadedData] = useState(null);
  const [extractedTasks, setExtractedTasks] = useState([]);

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
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center overflow-x-hidden text-slate-200">
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
