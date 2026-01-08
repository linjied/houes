
import React, { useState } from 'react';
import { Material, ProjectState } from '../types';

interface MaterialLibraryProps {
  materials: Material[];
  project: ProjectState;
  setProject: React.Dispatch<React.SetStateAction<ProjectState>>;
}

const MaterialLibrary: React.FC<MaterialLibraryProps> = ({ materials, project, setProject }) => {
  const [filter, setFilter] = useState<string>('全部');
  const [selectedDetail, setSelectedDetail] = useState<Material | null>(null);

  const categories = ['全部', ...Array.from(new Set(materials.map(m => m.category)))];

  const filteredMaterials = filter === '全部' 
    ? materials 
    : materials.filter(m => m.category === filter);

  const toggleMaterial = (id: string) => {
    setProject(prev => {
      const exists = prev.selectedMaterialIds.includes(id);
      return {
        ...prev,
        selectedMaterialIds: exists 
          ? prev.selectedMaterialIds.filter(mid => mid !== id)
          : [...prev.selectedMaterialIds, id]
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">物料中心 <span className="text-indigo-600">Material Hub</span></h2>
          <p className="text-slate-500 font-medium">浏览专业家装材料库，同步更新您的设计预算。</p>
        </div>
        
        <div className="flex gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === cat 
                  ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredMaterials.map(mat => {
          const isSelected = project.selectedMaterialIds.includes(mat.id);
          return (
            <div 
              key={mat.id} 
              className={`group bg-white rounded-[2rem] border-2 transition-all duration-500 overflow-hidden flex flex-col h-full ${
                isSelected ? 'border-indigo-600 ring-8 ring-indigo-50 shadow-2xl' : 'border-slate-100 hover:border-slate-200 hover:shadow-xl'
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => setSelectedDetail(mat)}>
                <img 
                  src={mat.image} 
                  alt={mat.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-indigo-600 shadow-sm">
                    {mat.category}
                  </span>
                  {mat.brand && (
                    <span className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-white shadow-sm">
                      {mat.brand}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h4 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{mat.name}</h4>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {mat.spec && <span className="text-[9px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-md">{mat.spec}</span>}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{mat.description}</p>
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">预估单价</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">￥{mat.price}</span>
                      <span className="text-[10px] font-bold text-slate-400">/{mat.unit}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleMaterial(mat.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isSelected ? 'bg-indigo-600 text-white shadow-lg rotate-12' : 'bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    <i className={`fas ${isSelected ? 'fa-check' : 'fa-plus'} text-lg`}></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 材料详细信息模态框 */}
      {selectedDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-6 animate-fadeIn" onClick={() => setSelectedDetail(null)}>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-scaleIn flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
             <div className="md:w-1/2 h-[400px] md:h-auto overflow-hidden relative">
                <img src={selectedDetail.image} className="w-full h-full object-cover" alt="" />
                <button 
                  className="absolute top-6 left-6 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
                  onClick={() => setSelectedDetail(null)}
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
             </div>
             <div className="p-10 md:w-1/2 flex flex-col">
                <div className="mb-8">
                  <span className="text-indigo-600 font-black text-xs uppercase tracking-widest">{selectedDetail.category} | 专业选样</span>
                  <h3 className="text-3xl font-black text-slate-900 mt-2 mb-4 leading-tight">{selectedDetail.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">生产品牌</p>
                        <p className="text-sm font-bold text-slate-800">{selectedDetail.brand || '优选品牌'}</p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">主要规格</p>
                        <p className="text-sm font-bold text-slate-800">{selectedDetail.spec || '通用标准'}</p>
                     </div>
                  </div>
                </div>
                <div className="space-y-4 mb-10">
                   <p className="text-slate-600 leading-relaxed text-sm">
                      {selectedDetail.description} 该材料经过严苛测试，适用于各种室内装修风格。建议在施工前进行现场调样。
                   </p>
                </div>
                <div className="mt-auto flex gap-4">
                   <button 
                    onClick={() => { toggleMaterial(selectedDetail.id); setSelectedDetail(null); }}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                   >
                     <i className="fas fa-cart-plus"></i>
                     {project.selectedMaterialIds.includes(selectedDetail.id) ? '移除选样' : '加入选样'}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialLibrary;
