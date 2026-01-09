
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
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">查看详情</span>
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
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-6 animate-fadeIn cursor-pointer" 
          onClick={() => setSelectedDetail(null)}
        >
          <div 
            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden animate-scaleIn flex flex-col md:flex-row relative cursor-default" 
            onClick={e => e.stopPropagation()}
          >
             {/* 移动端/桌面通用关闭按钮 */}
             <button 
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/90 hover:bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-900 shadow-xl transition-all hover:scale-110 active:scale-95"
                onClick={() => setSelectedDetail(null)}
              >
                <i className="fas fa-times text-xl"></i>
              </button>

             <div className="md:w-3/5 h-[400px] md:h-auto overflow-hidden relative group">
                <img src={selectedDetail.image} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt={selectedDetail.name} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>
             </div>
             
             <div className="p-8 md:p-12 md:w-2/5 flex flex-col">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em]">{selectedDetail.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-slate-400 font-bold text-xs">SKU: {selectedDetail.id.toUpperCase()}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight tracking-tight">{selectedDetail.name}</h3>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">生产品牌</span>
                        <span className="text-sm font-bold text-slate-800">{selectedDetail.brand || '甄选合作品牌'}</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">标准规格</span>
                        <span className="text-sm font-bold text-slate-800">{selectedDetail.spec || '工厂定制尺寸'}</span>
                     </div>
                  </div>
                </div>

                <div className="mb-10">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">产品描述与选购建议</p>
                   <p className="text-slate-600 leading-relaxed text-sm">
                      {selectedDetail.description} 该材料在现代室内设计中具有极高的应用价值。其表面处理工艺确保了长期使用的耐久性与美观度。
                   </p>
                </div>

                <div className="mt-auto space-y-4">
                   <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400">参考预算价格</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900">￥{selectedDetail.price}</span>
                        <span className="text-sm font-bold text-slate-400">/{selectedDetail.unit}</span>
                      </div>
                   </div>

                   <button 
                    onClick={() => { toggleMaterial(selectedDetail.id); setSelectedDetail(null); }}
                    className={`w-full py-5 rounded-[1.5rem] font-black shadow-2xl transition-all flex items-center justify-center gap-3 transform active:scale-95 ${
                      project.selectedMaterialIds.includes(selectedDetail.id) 
                        ? 'bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100' 
                        : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
                    }`}
                   >
                     <i className={`fas ${project.selectedMaterialIds.includes(selectedDetail.id) ? 'fa-minus-circle' : 'fa-plus-circle'} text-xl`}></i>
                     {project.selectedMaterialIds.includes(selectedDetail.id) ? '从项目中移除' : '加入选项目清单'}
                   </button>
                   
                   <p className="text-[10px] text-center text-slate-400 font-medium">
                     <i className="fas fa-info-circle mr-1"></i> 价格仅供参考，实际金额以供应商最终报价为准
                   </p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialLibrary;
