import React, { useState } from 'react';
import Upload from './components/Upload';
import Processing from './components/Processing';
import Review from './components/Review';
import Dashboard from './components/Dashboard';

function App() {
  // States: 'UPLOAD', 'PROCESSING', 'REVIEW', 'DASHBOARD'
  const [currentStep, setCurrentStep] = useState('UPLOAD');

  const startProcessing = () => {
    setCurrentStep('PROCESSING');
  };

  const finishProcessing = () => {
    setCurrentStep('REVIEW');
  };

  const confirmTasks = () => {
    setCurrentStep('DASHBOARD');
  };

  const resetToUpload = () => {
    setCurrentStep('UPLOAD');
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center overflow-x-hidden">
      {currentStep === 'UPLOAD' && (
        <Upload onUpload={startProcessing} />
      )}
      
      {currentStep === 'PROCESSING' && (
        <Processing onComplete={finishProcessing} />
      )}
      
      {currentStep === 'REVIEW' && (
        <Review onConfirm={confirmTasks} />
      )}
      
      {currentStep === 'DASHBOARD' && (
        <Dashboard onAddClick={resetToUpload} />
      )}
    </div>
  );
}

export default App;
