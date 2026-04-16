import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Calendar, Search, Bell, Menu, Plus, Trash2, CheckCircle, Clock, AlertTriangle, ArrowDown, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Dashboard = ({ onAddClick }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('date', { ascending: true });
        
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    // Optimistic UI update
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        // Revert on error
        setTasks(tasks.map(t => t.id === id ? { ...t, status: currentStatus } : t));
        throw error;
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) {
        setTasks(previousTasks);
        throw error;
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-red-500 text-white';
    if (priority === 'Medium') return 'bg-amber-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.subject && task.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pendingTasks = filteredTasks.filter(t => t.status !== 'completed');
  // Miller's Law: Limit to 7 items max to reduce cognitive load
  const visiblePendingTasks = pendingTasks.slice(0, 7);
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-200">
      {/* Sidebar - Same as before */}
      <aside className="w-64 glass border-r border-white/5 p-6 hidden md:flex flex-col">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ClassBridge</span>
        </div>

        <nav className="space-y-2 flex-grow">
          <button className="w-full flex items-center space-x-3 p-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-all">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-white/5 text-slate-400 rounded-xl transition-all">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Calendar</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-white/5 text-slate-400 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center space-x-3 p-3 glass rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-white text-sm">Leighmarie</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Premium Student</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0">
        <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-white/5">
          <div className="flex items-center flex-grow max-w-xl glass rounded-full px-4 py-2 mx-auto md:mx-0">
            <Search className="w-5 h-5 text-slate-500 mr-2" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks or subjects..." 
              className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 text-white" 
            />
          </div>
          
          <button 
            onClick={onAddClick}
            className="ml-4 bg-indigo-500 hover:bg-indigo-400 text-white p-3 rounded-full flex items-center space-x-2 transition-all shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <Plus className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 md:p-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Academic Dashboard</h1>
              <p className="text-slate-400">
                {loading ? 'Loading your tasks...' : `Welcome back, Leighmarie. You have ${pendingTasks.length} pending task(s).`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl text-center">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
              <p className="text-slate-400 max-w-md mb-8">You don't have any pending tasks. Click the plus button to extract tasks from a new announcement.</p>
              <button 
                onClick={onAddClick}
                className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-400 transition-colors"
              >
                <Plus className="w-5 h-5" /> Start Extraction
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {pendingTasks.length > 0 && (
                <div>
                  <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">
                    Action Required {pendingTasks.length > 7 && <span className="text-indigo-400 ml-2">(Showing 7 of {pendingTasks.length})</span>}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {visiblePendingTasks.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onToggle={() => handleToggleStatus(task.id, task.status)} 
                        onDelete={() => handleDelete(task.id)}
                        getPriorityColor={getPriorityColor}
                      />
                    ))}
                  </div>
                  {pendingTasks.length > 7 && (
                    <div className="mt-6 flex justify-center">
                      <button className="flex items-center space-x-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                        <span>View All {pendingTasks.length} Pending Tasks</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {completedTasks.length > 0 && (
                <div>
                  <h3 className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-4">Completed</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 opacity-60">
                    {completedTasks.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onToggle={() => handleToggleStatus(task.id, task.status)} 
                        onDelete={() => handleDelete(task.id)}
                        getPriorityColor={getPriorityColor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const TaskCard = ({ task, onToggle, onDelete, getPriorityColor }) => {
  const isCompleted = task.status === 'completed';
  
  return (
    <div className={`glass group rounded-3xl p-6 transition-all border-b-2 border-transparent hover:border-indigo-500/50 hover:bg-white/10 ${isCompleted ? 'grayscale' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
          {task.priority === 'High' && <AlertTriangle className="w-3 h-3" />}
          {task.priority === 'Low' && <ArrowDown className="w-3 h-3" />}
          {task.priority === 'Medium' && <span className="w-2 h-2 rounded-full bg-current opacity-75"></span>}
          {task.priority || 'Medium'}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onDelete}
            className="p-2 glass rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className={`text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors capitalize ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
        {task.title}
      </h3>
      
      <div className="flex items-center space-x-2 text-slate-400 text-sm mb-6 pb-6 border-b border-white/5">
        <span className="font-medium text-slate-300 bg-white/5 px-2 py-1 rounded-md">{task.subject || 'No Subject'}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span className={`${isCompleted ? '' : 'text-indigo-400 font-bold'}`}>
            {task.date ? new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Date'}
            {task.time ? ` at ${task.time}` : ''}
          </span>
        </span>
      </div>
      
      <button 
        onClick={onToggle}
        className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
          isCompleted 
          ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
        }`}
      >
        <CheckCircle className="w-4 h-4" />
        {isCompleted ? 'Mark as Pending' : 'Mark as Done'}
      </button>
    </div>
  );
}

export default Dashboard;
