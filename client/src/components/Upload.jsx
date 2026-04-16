import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

const Upload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate file drop
    onUpload();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold gradient-text mb-4">ClassBridge</h1>
        <p className="text-slate-400 text-lg">Turn chaotic school announcements into actionable tasks.</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full aspect-video glass rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
          isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-white/10'
        }`}
        onClick={onUpload}
      >
        <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
          <UploadIcon className="w-10 h-10 text-indigo-400" />
        </div>
        <p className="text-xl font-medium text-white mb-2">Drop announcement screenshots here</p>
        <p className="text-slate-500">or click to browse from your device</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mt-8">
        <div className="glass p-4 rounded-2xl flex items-center space-x-3 text-sm text-slate-300">
          <ImageIcon className="w-5 h-5 text-indigo-400" />
          <span>Upload Messenger Screenshots</span>
        </div>
        <div className="glass p-4 rounded-2xl flex items-center space-x-3 text-sm text-slate-300">
          <FileText className="w-5 h-5 text-purple-400" />
          <span>Paste raw text announcements</span>
        </div>
      </div>
      
      <div className="mt-8 flex items-center space-x-2 text-slate-500 text-sm italic">
        <AlertCircle className="w-4 h-4" />
        <span>ClassBridge uses local processing to keep your academic data private.</span>
      </div>
    </div>
  );
};

export default Upload;
