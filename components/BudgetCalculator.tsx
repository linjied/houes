
import React, { useState } from 'react';
import { ProjectState, Material } from '../types';
import { analyzeBudget } from '../services/geminiService';

interface BudgetCalculatorProps {
  project: ProjectState;
  materials: Material[];
}

const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({ project, materials }) => {
  const [analysis, setAnalysis] = useState<{ analysis: string, suggestions: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedMaterials = materials.filter(m => project.selectedMaterialIds.includes(m.id));
  
  const totalArea = project.rooms.reduce((acc, r) => acc + (r.width * r.length), 0);
  
  const budgetItems = selectedMaterials.map(m => {
    let qty = 1;
    if (m.unit === '平米') qty = totalArea;
    return { ...m, quantity: qty, total: qty * m.price };
  });

  const grandTotal = budgetItems.reduce((acc, i) => acc + i.total, 0);

  const handleAnalyze = async () => {
    setLoading(true);
    const simplified = budgetItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }));
    const result = await analyzeBudget(simplified);
    if (result) setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 左侧：表格 */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">项目装修预算估算</h3>
              <span className="text-xs font-mono text-slate-400">基于 {totalArea.toFixed(1)} 平米 总面积</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {budgetItems.length > 0 ? (
                budgetItems.map(item => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-400">{item.quantity} {item.unit} x ￥{item.price}</p>
                    </div>
                    <span className="font-bold text-slate-900">￥{item.total.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 italic">
                  尚未选择任何材料。
                </div>
              )}
            </div>

            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <span className="font-medium text-indigo-100 uppercase tracking-widest text-xs">总计预估费用</span>
              <span className="text-2xl font-black">￥{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-4">
            <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-700">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-800 text-sm">估算说明</h4>
              <p className="text-xs text-amber-700 leading-relaxed">此预算是根据房间面积和单价自动计算的。实际施工费用和材料损耗（建议预留 10%）不包含在内。</p>
            </div>
          </div>
        </div>

        {/* 右侧：AI 分析 */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i className="fas fa-brain text-indigo-500"></i>
              AI 预算顾问
            </h3>
            
            {analysis ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-xs text-slate-600 bg-indigo-50 p-4 rounded-xl leading-relaxed">
                  {analysis.analysis}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">核心节省建议</p>
                  {analysis.suggestions.map((tip, i) => (
                    <div key={i} className="flex gap-2 text-xs text-slate-700 p-2 border-l-2 border-indigo-200 hover:bg-slate-50 transition-colors">
                      <span className="text-indigo-400 font-bold">{i+1}.</span>
                      {tip}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="w-full text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors pt-2"
                >
                  <i className="fas fa-redo mr-1"></i> 重新分析
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 mb-6">想知道如何优化本次装修的支出吗？</p>
                <button 
                  onClick={handleAnalyze}
                  disabled={loading || budgetItems.length === 0}
                  className={`w-full py-3 rounded-2xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                    loading || budgetItems.length === 0 ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                  }`}
                >
                  {loading ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                  ) : (
                    <i className="fas fa-wand-magic-sparkles"></i>
                  )}
                  {loading ? '分析中...' : '分析支出'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
