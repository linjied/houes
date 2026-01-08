
import React from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  projectName: string;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, projectName }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
          <i className="fas fa-home text-lg"></i>
        </div>
        <div>
          <h1 className="font-bold text-slate-900 tracking-tight">ZenHome AI</h1>
          <p className="text-xs text-slate-500 uppercase font-semibold">{projectName}</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1">
        {[
          { id: ViewMode.DASHBOARD, label: '控制面板', icon: 'fa-chart-pie' },
          { id: ViewMode.PLANNER, label: '平面规划', icon: 'fa-drafting-compass' },
          { id: ViewMode.DESIGNER, label: 'AI 设计师', icon: 'fa-magic' },
          { id: ViewMode.MATERIALS, label: '材料库', icon: 'fa-box' },
          { id: ViewMode.BUDGET, label: '预算清单', icon: 'fa-dollar-sign' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeView === item.id 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className={`fas ${item.icon} text-xs`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
          <i className="fas fa-bell"></i>
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-200 overflow-hidden">
          <img src="https://picsum.photos/seed/user/100" alt="头像" />
        </div>
      </div>
    </header>
  );
};

export default Header;
