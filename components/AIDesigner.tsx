
import React, { useState } from 'react';
import { ProjectState, GeneratedDesign } from '../types';
import { generateDesignVisual, getDesignAdvice } from '../services/geminiService';

interface AIDesignerProps {
  project: ProjectState;
  setProject: React.Dispatch<React.SetStateAction<ProjectState>>;
}

const PROMPT_SUGGESTIONS = [
  { label: '寂静风 (Japandi)', text: '简约寂静风风格，中性色调，浅色木材，天然质感，线条简洁。' },
  { label: '工业阁楼', text: '现代工业风阁楼，裸露的砖墙，高天花板，大金属框窗户，水泥地板。' },
  { label: '中古风格', text: '中古风格客厅，胡桃木家具，细腿设计，芥末黄和橄榄绿点缀。' },
  { label: '斯堪的纳维亚', text: '明亮的北欧室内设计，白墙，舒适的氛围，浅色橡木地板，极简家具。' },
  { label: '亲生物设计', text: '亲生物室内设计，茂盛的室内植物，天然石墙，天窗，有机形状。' },
  { label: '大理石奢华', text: '顶级奢华现代厨房，白色大理石瀑布岛台，金色五金配件，嵌入式智能电器。' },
  { label: '电影感灯光', text: '戏剧性的电影感灯光，温暖的环境光辉，建筑阴影，专业摄影风格。' },
  { label: '沉浸式书房', text: '学院风家用办公室，深蓝色墙壁，皮椅，复古书桌，柔和的台灯。' }
];

const AIDesigner: React.FC<AIDesignerProps> = ({ project, setProject }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery' | 'advice'>('generate');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const imageUrl = await generateDesignVisual(prompt);
      const newDesign: GeneratedDesign = {
        id: Math.random().toString(36).substr(2, 9),
        prompt,
        imageUrl,
        timestamp: Date.now()
      };
      setProject(prev => ({
        ...prev,
        generatedDesigns: [newDesign, ...prev.generatedDesigns]
      }));
      setPrompt('');
      setActiveTab('gallery');
    } catch (error) {
      alert("生成设计失败，请检查控制台详情。");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAdvice = async () => {
    setLoading(true);
    try {
      const res = await getDesignAdvice(`项目：${project.name}。房间：${project.rooms.map(r => r.name).join(', ')}`);
      setAdvice(res || "暂无建议。");
      setActiveTab('advice');
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* 左侧：操作面板 */}
        <div className="w-full md:w-1/3 glass-panel p-6 rounded-3xl sticky top-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-sparkles text-indigo-500"></i>
            设计工作室
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-semibold text-slate-700">描述您的愿景</label>
                <button 
                  onClick={() => setPrompt('')}
                  className="text-[10px] text-slate-400 hover:text-indigo-600 font-bold uppercase tracking-wider transition-colors"
                >
                  清空
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：一个简约的寂静风客厅，拥有大窗户，浅色木地板..."
                className="w-full h-32 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm bg-slate-50 transition-all shadow-inner"
              />
            </div>

            {/* 灵感推荐 */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-lightbulb text-amber-400"></i>
                灵感推荐
              </p>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => applySuggestion(s.text)}
                    className="text-[10px] px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                loading || !prompt ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <i className="fas fa-bolt"></i>
              )}
              {loading ? '生成中...' : '生成 3D 效果图'}
            </button>

            <button
              onClick={handleGetAdvice}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-magic"></i>
              AI 专家建议
            </button>
          </div>
        </div>

        {/* 右侧：结果面板 */}
        <div className="flex-1 w-full">
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all ${activeTab === 'gallery' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              灵感画廊 ({project.generatedDesigns.length})
            </button>
            <button 
              onClick={() => setActiveTab('advice')}
              className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all ${activeTab === 'advice' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              专家指导
            </button>
          </div>

          {activeTab === 'gallery' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.generatedDesigns.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <i className="fas fa-wand-magic-sparkles text-2xl text-slate-300"></i>
                  </div>
                  <p className="font-medium">您生成的杰作将出现在这里。</p>
                  <p className="text-xs mt-2 opacity-70">使用左侧的设计器开始您的创作。</p>
                </div>
              ) : (
                project.generatedDesigns.map(design => (
                  <div key={design.id} className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group animate-scaleIn">
                    <div className="rounded-2xl overflow-hidden aspect-video relative">
                      <img src={design.imageUrl} alt={design.prompt} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110">
                          <i className="fas fa-expand"></i>
                        </button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">{design.prompt}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(design.timestamp).toLocaleDateString()}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold uppercase tracking-tighter">AI 渲染</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 min-h-[400px] shadow-sm animate-fadeIn">
              {advice ? (
                <div className="prose prose-indigo max-w-none">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 border-b pb-4 border-slate-100">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <i className="fas fa-clipboard-list text-indigo-500"></i>
                    </div>
                    项目分析与指导
                  </h3>
                  <div className="whitespace-pre-wrap text-slate-600 leading-relaxed text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    {advice}
                  </div>
                  <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-700 flex gap-3 italic">
                    <i className="fas fa-info-circle mt-0.5"></i>
                    此建议由 AI 根据您当前的项目结构生成。在实际施工前，请务必咨询专业人员。
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                    <i className="fas fa-user-tie text-4xl opacity-30"></i>
                  </div>
                  <h4 className="text-slate-900 font-bold mb-2">需要专业视角？</h4>
                  <p className="max-w-xs text-center text-sm leading-relaxed">我们的 AI 顾问可以查看您的项目详情，并建议布局、照明和色彩策略。</p>
                  <button onClick={handleGetAdvice} className="mt-8 px-8 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all">
                    咨询设计师
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDesigner;
