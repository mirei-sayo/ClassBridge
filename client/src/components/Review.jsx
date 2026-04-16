import React, { useState } from 'react';
import { Check, Calendar, BookOpen, Clock, AlertCircle } from 'lucide-react';

const Review = ({ onConfirm }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Term Paper Submission', subject: 'Digital Ethics', date: '2024-10-25', time: '11:59 PM', priority: 'High' },
    { id: 2, title: 'Chapter 4 Quiz', subject: 'Data structures', date: '2024-10-22', time: '2:00 PM', priority: 'Medium' }
  ]);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 underline decoration-indigo-500">Review & Confirm</h2>
        <p className="text-slate-400">We've extracted these tasks. Tap to edit or confirm to add to your dashboard.</p>
      </div>

      <div className="space-y-4 mb-10 text-left">
        {tasks.map((task) => (
          <div key={task.id} className="glass p-6 rounded-2xl border-l-4 border-indigo-500 hover:border-purple-500 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <input 
                defaultValue={task.title}
                className="bg-transparent text-xl font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded px-1 transition-all"
              />
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                task.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {task.priority}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-slate-400">
                <BookOpen className="w-4 h-4" />
                <input defaultValue={task.subject} className="bg-transparent focus:outline-none focus:text-slate-200" />
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                <input type="date" defaultValue={task.date} className="bg-transparent focus:outline-none focus:text-slate-200" />
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <input defaultValue={task.time} className="bg-transparent focus:outline-none focus:text-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onConfirm}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <Check className="w-6 h-6" />
        <span>Confirm All Tasks</span>
      </button>

      <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
        <AlertCircle className="w-3 h-3" />
        <span>HCI Tip: Double-checking prevents errors during AI extraction (Error Prevention Principle)</span>
      </div>
    </div>
  );
};

export default Review;
