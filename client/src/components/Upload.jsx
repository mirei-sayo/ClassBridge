import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

const Upload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (!file) return;
    // We can simulate parsing here or just pass the file info
    onUpload({ type: 'file', file, name: file.name });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      onUpload({ type: 'text', content: textInput });
    }
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
        className={`w-full aspect-video glass rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 border-dashed relative overflow-hidden ${
          isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-white/10 hover:border-white/30'
        }`}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,.pdf,.txt" 
          onChange={handleFileChange} 
        />
        <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 pointer-events-none">
          <UploadIcon className="w-10 h-10 text-indigo-400" />
        </div>
        <p className="text-xl font-medium text-white mb-2 pointer-events-none">Drop announcement screenshots here</p>
        <p className="text-slate-500 pointer-events-none">or click to browse from your device</p>
      </div>

      <div className="w-full mt-6">
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="mx-4 text-xs font-bold text-slate-500 uppercase tracking-widest">OR PASTE TEXT</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>
        
        <form onSubmit={handleTextSubmit} className="relative">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste raw text announcements from Canvas, Blackboard, or Messenger..."
            className="w-full glass rounded-2xl p-4 pr-16 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-32"
          ></textarea>
          <button 
            type="submit"
            disabled={!textInput.trim()}
            className="absolute bottom-4 right-4 bg-indigo-500 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-400 transition-colors"
          >
            <UploadIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="mt-8 flex items-center space-x-2 text-slate-500 text-sm italic">
        <AlertCircle className="w-4 h-4" />
        <span>ClassBridge uses local processing to keep your academic data private.</span>
      </div>
    </div>
  );
};

export default Upload;
