import React, { useState, useEffect } from 'react';
import { Check, Calendar, BookOpen, Clock, AlertCircle, Edit2, Trash2, Plus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Review = ({ tasks: initialTasks, onConfirm }) => {
  const [tasks, setTasks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTasks(initialTasks || []);
  }, [initialTasks]);

  const handleUpdateTask = (id, field, value) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddNewFallbackTask = () => {
    setTasks([...tasks, {
      id: Date.now(),
      title: 'New Manual Task',
      subject: '',
      date: new Date().toISOString().split('T')[0],
      time: '11:59 PM',
      priority: 'Medium'
    }]);
  };

  const saveToSupabase = async () => {
    if (tasks.length === 0) {
      onConfirm();
      return;
    }
    
    setIsSaving(true);
    try {
      // Clean up local IDs before storing in Supabase (which auto-generates UUIDs)
      const tasksToInsert = tasks.map(t => {
        const { id, ...taskData } = t;
        return taskData;
      });

      const { error } = await supabase
        .from('tasks')
        .insert(tasksToInsert);

      if (error) {
        console.error('Error saving tasks:', error);
        alert('Failed to save tasks. Make sure your Supabase table is set up correctly.');
      } else {
        onConfirm();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 underline decoration-indigo-500">Review & Confirm</h2>
        <p className="text-slate-400">We've extracted these tasks. Tap to edit or confirm to add to your dashboard.</p>
      </div>

      <div className="space-y-4 mb-8 text-left">
        {tasks.length === 0 ? (
          <div className="glass p-8 text-center rounded-2xl text-slate-400">
            No tasks found. Try adding one manually.
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="glass p-6 rounded-2xl border-l-4 border-indigo-500 hover:border-purple-500 transition-colors relative group">
              <button 
                onClick={() => handleDeleteTask(task.id)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="flex justify-between items-start mb-4 pr-8">
                <input 
                  value={task.title}
                  onChange={(e) => handleUpdateTask(task.id, 'title', e.target.value)}
                  className="bg-transparent text-xl font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded px-1 transition-all w-full"
                  placeholder="Task Title"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-slate-400 bg-white/5 p-2 rounded-lg">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <input 
                    value={task.subject} 
                    onChange={(e) => handleUpdateTask(task.id, 'subject', e.target.value)}
                    className="bg-transparent focus:outline-none focus:text-slate-200 w-full" 
                    placeholder="Subject/Class"
                  />
                </div>
                <div className="flex items-center space-x-2 text-slate-400 bg-white/5 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <input 
                    type="date" 
                    value={task.date} 
                    onChange={(e) => handleUpdateTask(task.id, 'date', e.target.value)}
                    className="bg-transparent focus:outline-none focus:text-slate-200 w-full [color-scheme:dark]" 
                  />
                </div>
                <div className="flex items-center space-x-2 text-slate-400 bg-white/5 p-2 rounded-lg">
                  <Clock className="w-4 h-4 shrink-0" />
                  <input 
                    value={task.time} 
                    onChange={(e) => handleUpdateTask(task.id, 'time', e.target.value)}
                    className="bg-transparent focus:outline-none focus:text-slate-200 w-full" 
                    placeholder="Time (e.g. 11:59 PM)"
                  />
                </div>
                <div className="flex items-center space-x-2 text-slate-400 bg-white/5 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <select 
                    value={task.priority}
                    onChange={(e) => handleUpdateTask(task.id, 'priority', e.target.value)}
                    className={`bg-transparent focus:outline-none font-bold outline-none cursor-pointer w-full ${
                      task.priority === 'High' ? 'text-red-400' : task.priority === 'Low' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    <option className="bg-slate-800 text-red-400">High</option>
                    <option className="bg-slate-800 text-amber-400">Medium</option>
                    <option className="bg-slate-800 text-emerald-400">Low</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleAddNewFallbackTask}
          className="flex-1 glass hover:bg-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Missing Task</span>
        </button>
        
        <button 
          onClick={saveToSupabase}
          disabled={isSaving}
          className="flex-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {isSaving ? (
            <span className="flex items-center gap-2"><Loader2 className="w-6 h-6 animate-spin" /> Saving to Database...</span>
          ) : (
            <span className="flex items-center gap-2"><Check className="w-6 h-6" /> Confirm {tasks.length} Task{tasks.length !== 1 ? 's' : ''}</span>
          )}
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
        <AlertCircle className="w-3 h-3" />
        <span>HCI Tip: Double-checking prevents errors during AI extraction (Error Prevention Principle)</span>
      </div>
    </div>
  );
};

export default Review;
