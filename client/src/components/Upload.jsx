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
    <div className="flex flex-col items-center justify-center px-5 py-8 w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-3" style={{ textWrap: 'balance' }}>ClassBridge</h1>
        <p className="text-slate-400 text-base sm:text-lg leading-snug" style={{ textWrap: 'balance' }}>
          Turn chaotic school announcements into actionable tasks.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full aspect-video glass rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 border-dashed relative overflow-hidden ${
          isDragging ? 'border-red-700 bg-red-700/10 scale-[1.02]' : 'border-white/10 hover:border-white/30'
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
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-700/20 flex items-center justify-center mb-4 shadow-lg shadow-red-700/20 pointer-events-none shrink-0">
          <UploadIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
        </div>
        <p className="text-base sm:text-xl font-semibold text-white mb-1 pointer-events-none px-4 text-center leading-tight" style={{ textWrap: 'balance' }}>
          Drop announcement screenshots here
        </p>
        <p className="text-sm text-slate-500 pointer-events-none text-center px-4" style={{ textWrap: 'balance' }}>
          or click to browse from your device
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full mt-6">
        <div className="glass p-3 sm:p-4 rounded-2xl flex items-start gap-3 text-sm text-slate-300">
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 shrink-0" />
          <span className="leading-snug">Upload Messenger Screenshots</span>
        </div>
        <div className="glass p-3 sm:p-4 rounded-2xl flex items-start gap-3 text-sm text-slate-300">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mt-0.5 shrink-0" />
          <span className="leading-snug">Paste raw text announcements</span>
        </div>
      </div>

      <div className="w-full mt-5">
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="mx-3 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">OR PASTE TEXT</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>
        
        <form onSubmit={handleTextSubmit} className="relative">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste raw text announcements from Canvas, Blackboard, or Messenger..."
            className="w-full glass rounded-2xl p-4 pr-14 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-700 resize-none h-28 text-sm sm:text-base leading-relaxed"
          ></textarea>
          <button 
            type="submit"
            disabled={!textInput.trim()}
            className="absolute bottom-4 right-4 bg-red-700 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
          >
            <UploadIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="mt-6 flex items-start gap-2 text-slate-500 text-xs sm:text-sm not-italic">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span className="leading-snug" style={{ textWrap: 'balance' }}>
          ClassBridge uses local processing to keep your academic data private.
        </span>
      </div>
    </div>
  );
};

export default Upload;
