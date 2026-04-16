import React, { useState } from 'react';
import Upload from './components/Upload';
import Processing from './components/Processing';
import Review from './components/Review';
import Dashboard from './components/Dashboard';

function App() {
  const [currentStep, setCurrentStep] = useState('UPLOAD');
  const [uploadedData, setUploadedData] = useState(null);
  const [extractedTasks, setExtractedTasks] = useState([]);

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
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center overflow-x-hidden">
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
