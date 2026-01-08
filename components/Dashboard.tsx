
import React from 'react';
import { ProjectState, ViewMode } from '../types';

interface DashboardProps {
  project: ProjectState;
  onNavigate: (view: ViewMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ project, onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">欢迎回来，设计师。</h2>
        <p className="text-slate-500">您的项目中有 {project.rooms.length} 个房间和 {project.generatedDesigns.length} 个 AI 灵感。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-xl">
            <i className="fas fa-ruler-combined"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">空间规划</h3>
          <p className="text-slate-500 text-sm mb-4">配置房间尺寸和布局细节，以获得准确的估算。</p>
          <button onClick={() => onNavigate(ViewMode.PLANNER)} className="text-blue-600 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
            继续规划 <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 text-xl">
            <i className="fas fa-paint-roller"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">风格探索</h3>
          <p className="text-slate-500 text-sm mb-4">使用 Gemini AI 为您的空间生成令人惊叹的视觉概念。</p>
          <button onClick={() => onNavigate(ViewMode.DESIGNER)} className="text-purple-600 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
            生成概念图 <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 text-xl">
            <i className="fas fa-wallet"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">预算追踪</h3>
          <p className="text-slate-500 text-sm mb-4">根据您的材料和物品选择，实时更新成本数据。</p>
          <button onClick={() => onNavigate(ViewMode.BUDGET)} className="text-emerald-600 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
            查看预算 <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {project.generatedDesigns.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <i className="fas fa-history text-slate-400"></i>
            最近的 AI 灵感
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.generatedDesigns.slice(0, 3).map((design) => (
              <div key={design.id} className="group relative rounded-2xl overflow-hidden shadow-lg aspect-video">
                <img src={design.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt={design.prompt} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <p className="text-white text-xs font-medium opacity-80 mb-1">{new Date(design.timestamp).toLocaleDateString()}</p>
                  <p className="text-white font-medium line-clamp-1">{design.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
