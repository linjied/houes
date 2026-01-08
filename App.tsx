
import React, { useState, useEffect } from 'react';
import { ViewMode, ProjectState, Material } from './types';
import { INITIAL_MATERIALS } from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AIDesigner from './components/AIDesigner';
import FloorPlanner from './components/FloorPlanner';
import MaterialLibrary from './components/MaterialLibrary';
import BudgetCalculator from './components/BudgetCalculator';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [project, setProject] = useState<ProjectState>({
    id: 'proj-1',
    name: '我的梦想之家',
    rooms: [
      { id: 'room-1', name: '主客厅', width: 6, length: 8, type: '客厅', items: [] }
    ],
    generatedDesigns: [],
    selectedMaterialIds: ['mat-1', 'mat-3']
  });

  const [materials] = useState<Material[]>(INITIAL_MATERIALS);

  useEffect(() => {
    const saved = localStorage.getItem('zenhome_project');
    if (saved) {
      try {
        setProject(JSON.parse(saved));
      } catch (e) {
        console.error("加载项目失败", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zenhome_project', JSON.stringify(project));
  }, [project]);

  const renderView = () => {
    switch (activeView) {
      case ViewMode.DASHBOARD:
        return <Dashboard project={project} onNavigate={setActiveView} />;
      case ViewMode.DESIGNER:
        return <AIDesigner project={project} setProject={setProject} />;
      case ViewMode.PLANNER:
        return <FloorPlanner project={project} setProject={setProject} materials={materials} />;
      case ViewMode.MATERIALS:
        return <MaterialLibrary materials={materials} project={project} setProject={setProject} />;
      case ViewMode.BUDGET:
        return <BudgetCalculator project={project} materials={materials} />;
      default:
        return <Dashboard project={project} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeView={activeView} setActiveView={setActiveView} projectName={project.name} />
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto p-4 md:p-8">
          {renderView()}
        </div>
      </main>
      
      {/* 快速访问浮动栏 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full shadow-2xl flex items-center gap-8 border border-slate-200 z-50">
        <button 
          onClick={() => setActiveView(ViewMode.DASHBOARD)}
          className={`text-xl ${activeView === ViewMode.DASHBOARD ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          title="控制面板"
        >
          <i className="fas fa-th-large"></i>
        </button>
        <button 
          onClick={() => setActiveView(ViewMode.PLANNER)}
          className={`text-xl ${activeView === ViewMode.PLANNER ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          title="平面规划"
        >
          <i className="fas fa-vector-square"></i>
        </button>
        <button 
          onClick={() => setActiveView(ViewMode.DESIGNER)}
          className={`text-xl ${activeView === ViewMode.DESIGNER ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          title="AI 设计师"
        >
          <i className="fas fa-wand-magic-sparkles"></i>
        </button>
        <button 
          onClick={() => setActiveView(ViewMode.MATERIALS)}
          className={`text-xl ${activeView === ViewMode.MATERIALS ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          title="材料库"
        >
          <i className="fas fa-swatchbook"></i>
        </button>
        <button 
          onClick={() => setActiveView(ViewMode.BUDGET)}
          className={`text-xl ${activeView === ViewMode.BUDGET ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          title="预算清单"
        >
          <i className="fas fa-calculator"></i>
        </button>
      </div>
    </div>
  );
};

export default App;
