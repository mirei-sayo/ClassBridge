import React from 'react';
import { LayoutDashboard, Calendar, Search, Bell, Menu, Plus, Trash2, Edit2 } from 'lucide-react';

const Dashboard = ({ onAddClick }) => {
  const tasks = [
    { title: 'Term Paper Submission', subject: 'Digital Ethics', date: 'Oct 25', priority: 'High', color: 'bg-red-500' },
    { title: 'Chapter 4 Quiz', subject: 'Data structures', date: 'Oct 22', priority: 'Medium', color: 'bg-amber-500' },
    { title: 'System Documentation', subject: 'Software Eng', date: 'Oct 28', priority: 'Low', color: 'bg-emerald-500' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 p-6 hidden md:flex flex-col">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ClassBridge</span>
        </div>

        <nav className="space-y-2 flex-grow">
          <a href="#" className="flex items-center space-x-3 p-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-all">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-xl transition-all">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Calendar</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
          </a>
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
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5">
          <div className="flex items-center flex-grow max-w-xl glass rounded-full px-4 py-2 mx-auto md:mx-0">
            <Search className="w-5 h-5 text-slate-500 mr-2" />
            <input placeholder="Search tasks or subjects..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          
          <button 
            onClick={onAddClick}
            className="ml-4 bg-indigo-500 hover:bg-indigo-400 text-white p-3 rounded-full flex items-center space-x-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-6 h-6" />
          </button>
        </header>

        <div className="p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Academic Dashboard</h1>
              <p className="text-slate-400">Welcome back, Leighmarie. You have {tasks.length} pending tasks this week.</p>
            </div>
            
            <div className="flex space-x-2">
              <div className="glass px-4 py-2 rounded-xl text-xs font-bold text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> High Priority
              </div>
              <div className="glass px-4 py-2 rounded-xl text-xs font-bold text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> Upcoming
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tasks.map((task, index) => (
              <div key={index} className="glass group rounded-3xl p-6 transition-all border-b-2 border-transparent hover:border-indigo-500/50 hover:bg-white/10">
                <div className="flex justify-between items-center mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white ${task.color}`}>
                    {task.priority}
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-indigo-400"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors capitalize">
                  {task.title}
                </h3>
                
                <div className="flex items-center space-x-2 text-slate-400 text-sm mb-6 pb-6 border-b border-white/5">
                  <span className="font-medium text-slate-300">{task.subject}</span>
                  <span>•</span>
                  <span>Deadline: <span className="text-indigo-400 font-bold">{task.date}</span></span>
                </div>
                
                <button className="w-full py-3 glass rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                  View Announcement Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
