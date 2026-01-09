
import React, { useState, useMemo, useRef } from 'react';
import { ProjectState, Room, Material, DesignItem } from '../types';
import { ROOM_TYPES } from '../constants';

interface FloorPlannerProps {
  project: ProjectState;
  setProject: React.Dispatch<React.SetStateAction<ProjectState>>;
  materials: Material[];
}

const FloorPlanner: React.FC<FloorPlannerProps> = ({ project, setProject, materials }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(project.rooms[0]?.id || null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [activeTool, setActiveTool] = useState<'select' | 'place'>('select');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newRoom, setNewRoom] = useState({ 
    name: '', 
    type: '客厅', 
    width: 5, 
    length: 5 
  });

  const selectedRoom = project.rooms.find(r => r.id === selectedRoomId);

  // 构件库数据分类
  const drawingTools = useMemo(() => 
    materials.filter(m => ['家具', '灯具', '结构'].includes(m.category)), 
  [materials]);

  // 计算当前房间的材质贴图
  const roomMaterials = useMemo(() => {
    const selected = materials.filter(m => project.selectedMaterialIds.includes(m.id));
    return {
      floor: selected.find(m => m.category === '地板')?.image || 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=400',
      wall: selected.find(m => m.category === '墙面')?.image || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'
    };
  }, [project.selectedMaterialIds, materials]);

  const handleAddRoom = () => {
    if (!newRoom.name.trim()) return;
    
    const room: Room = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRoom.name,
      type: newRoom.type,
      width: Math.max(1, newRoom.width),
      length: Math.max(1, newRoom.length),
      items: []
    };

    setProject(prev => ({ ...prev, rooms: [...prev.rooms, room] }));
    setSelectedRoomId(room.id);
    setIsAddingRoom(false);
    setNewRoom({ name: '', type: '客厅', width: 5, length: 5 });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'place' || !selectedMaterialId || !selectedRoom) {
      if (activeTool === 'select' && e.target === e.currentTarget) {
        setSelectedItemId(null);
      }
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / 50) * 10) / 10;
    const y = Math.round(((e.clientY - rect.top) / 50) * 10) / 10;

    const newItem: DesignItem = {
      id: Math.random().toString(36).substr(2, 9),
      materialId: selectedMaterialId,
      quantity: 1,
      posX: x,
      posY: y,
      rotation: 0
    };

    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === selectedRoom.id ? { ...r, items: [...r.items, newItem] } : r)
    }));
    
    setSelectedItemId(newItem.id);
    setActiveTool('select');
  };

  const updateItemRotation = (roomId: string, itemId: string, delta: number) => {
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? {
        ...r,
        items: r.items.map(i => i.id === itemId ? { ...i, rotation: (i.rotation + delta) % 360 } : i)
      } : r)
    }));
  };

  const removeItem = (roomId: string, itemId: string) => {
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, items: r.items.filter(i => i.id !== itemId) } : r)
    }));
    setSelectedItemId(null);
  };

  const updateRoomDimensions = (id: string, width: number, length: number) => {
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === id ? { ...r, width: Math.max(1, width), length: Math.max(1, length) } : r)
    }));
  };

  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedItemId || !selectedRoom) return;

    // 仅支持 GLB/GLTF
    if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
      alert('请上传 .glb 或 .gltf 格式的 3D 模型文件');
      return;
    }

    const modelUrl = URL.createObjectURL(file);
    
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === selectedRoom.id ? {
        ...r,
        items: r.items.map(i => i.id === selectedItemId ? { ...i, customModelUrl: modelUrl } : i)
      } : r)
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-160px)] animate-fadeIn">
      {/* 隐藏的文件上传控件 */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".glb,.gltf" 
        onChange={handleModelUpload} 
      />

      {/* 侧边栏：绘图库 */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 flex flex-col h-full overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <i className="fas fa-cubes text-indigo-500"></i>
              空间资产
            </h3>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => { setActiveTool('select'); setSelectedMaterialId(null); }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${activeTool === 'select' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <i className="fas fa-mouse-pointer text-sm"></i>
              </button>
              <button 
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${activeTool === 'place' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <i className="fas fa-plus text-sm"></i>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
            <button 
              onClick={() => setIsAddingRoom(true)}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-bold text-xs flex items-center justify-center gap-2 mb-2"
            >
              <i className="fas fa-plus-circle"></i> 新建空间
            </button>
            
            {['结构', '家具', '灯具'].map(cat => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat}类资源</p>
                  <div className="h-[1px] flex-1 ml-4 bg-slate-100"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {drawingTools.filter(m => m.category === cat).map(mat => (
                    <button
                      key={mat.id}
                      onClick={() => {
                        setSelectedMaterialId(mat.id);
                        setActiveTool('place');
                        setSelectedItemId(null);
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                        selectedMaterialId === mat.id
                          ? 'border-indigo-600 bg-indigo-50 shadow-md translate-y-[-2px]' 
                          : 'border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center p-2 border border-slate-100 group-hover:shadow-sm">
                        <img src={mat.image} alt={mat.name} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 text-center line-clamp-1">{mat.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 主画布区域 */}
      <div className={`flex-1 rounded-[2.5rem] border-2 relative overflow-hidden flex flex-col transition-all duration-700 ${viewMode === '3D' ? 'bg-slate-950 border-slate-800 shadow-2xl shadow-indigo-500/10' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
        {selectedRoom ? (
          <>
            {/* 画布控制栏 */}
            <div className={`${viewMode === '3D' ? 'bg-slate-900/60 text-white' : 'bg-white/80 text-slate-800'} backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between z-20`}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40"></div>
                   <div className="flex items-center gap-2">
                     <select 
                      value={selectedRoomId || ''} 
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="bg-transparent font-black tracking-tight outline-none cursor-pointer hover:text-indigo-600 transition-colors text-lg"
                     >
                       {project.rooms.map(r => <option key={r.id} value={r.id} className="text-slate-900">{r.name}</option>)}
                     </select>
                   </div>
                </div>
                
                <div className="h-6 w-[1px] bg-slate-300/30"></div>
                
                <div className="flex items-center gap-6 text-[11px] font-mono text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="opacity-50">WIDTH:</span>
                    <input 
                      type="number" 
                      value={selectedRoom.width} 
                      onChange={(e) => updateRoomDimensions(selectedRoom.id, Number(e.target.value), selectedRoom.length)}
                      className="bg-slate-100/50 dark:bg-slate-800/50 w-12 py-1 px-2 rounded font-bold text-center outline-none focus:ring-1 ring-indigo-500"
                    />
                    <span>M</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="opacity-50">LENGTH:</span>
                    <input 
                      type="number" 
                      value={selectedRoom.length} 
                      onChange={(e) => updateRoomDimensions(selectedRoom.id, selectedRoom.width, Number(e.target.value))}
                      className="bg-slate-100/50 dark:bg-slate-800/50 w-12 py-1 px-2 rounded font-bold text-center outline-none focus:ring-1 ring-indigo-500"
                    />
                    <span>M</span>
                  </div>
                  <div className="bg-indigo-600/10 px-2 py-1 rounded text-indigo-500 font-black">
                    {(selectedRoom.width * selectedRoom.length).toFixed(1)} ㎡
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-300/30 backdrop-blur-sm">
                  <button onClick={() => setViewMode('2D')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === '2D' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>
                    <i className="fas fa-drafting-compass"></i> 2D 平面
                  </button>
                  <button onClick={() => setViewMode('3D')} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === '3D' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>
                    <i className="fas fa-cubes"></i> 3D 渲染
                  </button>
                </div>
              </div>
            </div>

            {/* 核心显示区 */}
            <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden">
              {viewMode === '2D' ? (
                <div 
                  className={`bg-white shadow-2xl relative transition-all duration-500 border-[12px] border-slate-900 ${activeTool === 'place' ? 'cursor-crosshair' : 'cursor-default'}`}
                  style={{ width: `${selectedRoom.width * 50}px`, height: `${selectedRoom.length * 50}px` }}
                  onClick={handleCanvasClick}
                >
                  {/* 精致网格背景 */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                    style={{ background: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', backgroundSize: '50px 50px' }}
                  ></div>

                  {/* 物品绘制层 */}
                  {selectedRoom.items.map(item => {
                    const material = materials.find(m => m.id === item.materialId);
                    if (!material) return null;
                    const isSelected = selectedItemId === item.id;
                    const isStructure = material.category === '结构';

                    return (
                      <div 
                        key={item.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); setActiveTool('select'); }}
                        className={`absolute flex items-center justify-center transition-all ${isSelected ? 'z-30' : 'z-10'} ${activeTool === 'select' ? 'hover:scale-105 cursor-grab active:cursor-grabbing' : ''}`}
                        style={{ 
                          left: `${item.posX * 50}px`, 
                          top: `${item.posY * 50}px`,
                          transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                        }}
                      >
                        <div className={`
                          ${isStructure ? 'w-32 h-6 border-[3px]' : 'w-20 h-20 border-2'} 
                          ${isSelected ? 'border-indigo-600 bg-indigo-50/80 ring-8 ring-indigo-500/10 shadow-2xl scale-110' : 'border-slate-800 bg-white/95'} 
                          relative flex items-center justify-center shadow-sm transition-all duration-300
                        `}>
                          {!isStructure && <img src={material.image} className="w-16 h-16 object-contain opacity-60 grayscale group-hover:grayscale-0" alt="" />}
                          {isStructure && (
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-[8px] font-black uppercase tracking-tighter text-slate-400">STRUCTURAL</div>
                              {item.customModelUrl && <i className="fas fa-cube text-[8px] text-emerald-500"></i>}
                            </div>
                          )}
                          
                          {/* 交互控制环 */}
                          {isSelected && (
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-2 bg-white border border-slate-200 p-2 rounded-2xl shadow-2xl animate-scaleIn">
                              <button onClick={() => updateItemRotation(selectedRoom.id, item.id, -45)} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600"><i className="fas fa-undo"></i></button>
                              <button onClick={() => updateItemRotation(selectedRoom.id, item.id, 45)} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600"><i className="fas fa-redo"></i></button>
                              
                              {isStructure && (
                                <button 
                                  onClick={() => fileInputRef.current?.click()} 
                                  className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center justify-center"
                                  title="导入 3D 模型 (.glb/.gltf)"
                                >
                                  <i className="fas fa-file-import"></i>
                                </button>
                              )}

                              <div className="w-[1px] bg-slate-100 mx-1"></div>
                              <button onClick={() => removeItem(selectedRoom.id, item.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"><i className="fas fa-trash-alt"></i></button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="perspective-container" style={{ perspective: '2000px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                    <div 
                      className="room-3d"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transform: 'rotateX(55deg) rotateZ(35deg)',
                        width: `${selectedRoom.width * 60}px`,
                        height: `${selectedRoom.length * 60}px`,
                        position: 'relative',
                        transition: 'transform 1s cubic-bezier(0.2, 0, 0, 1)'
                      }}
                    >
                      {/* 地面和墙壁保持不变 */}
                      <div className="absolute inset-0 shadow-2xl" style={{ backgroundImage: `url(${roomMaterials.floor})`, backgroundSize: '120px 120px', transform: 'translateZ(0)', border: '4px solid #1e293b' }} />
                      <div className="absolute w-full h-[180px] bottom-full left-0 origin-bottom" style={{ backgroundImage: `url(${roomMaterials.wall})`, backgroundSize: '240px 180px', transform: 'rotateX(-90deg)', filter: 'brightness(0.9)', borderBottom: '4px solid #0f172a' }} />
                      <div className="absolute w-[180px] h-full right-full top-0 origin-right" style={{ backgroundImage: `url(${roomMaterials.wall})`, backgroundSize: '180px 240px', transform: 'rotateY(90deg)', filter: 'brightness(0.7)', borderRight: '4px solid #0f172a' }} />

                      {/* 3D 物品动态渲染 */}
                      {selectedRoom.items.map(item => {
                        const material = materials.find(m => m.id === item.materialId);
                        if (!material) return null;
                        const isLamp = material.category === '灯具';
                        const isStructure = material.category === '结构';
                        const height = isStructure ? 160 : (isLamp ? 15 : 40);
                        const zPos = isLamp ? 150 : 0;
                        
                        return (
                          <div 
                            key={item.id}
                            className="absolute"
                            style={{ 
                              left: `${item.posX * 60}px`, 
                              top: `${item.posY * 60}px`,
                              transform: `translate3d(-50%, -50%, ${zPos}px) rotateZ(${item.rotation}deg)`,
                              transformStyle: 'preserve-3d'
                            }}
                          >
                            <div className="relative group" style={{ width: isStructure ? '100px' : '50px', height: isStructure ? '12px' : '50px', transformStyle: 'preserve-3d' }}>
                              
                              {/* 渲染外部导入模型 */}
                              {item.customModelUrl ? (
                                <div style={{ width: '100px', height: '100px', transform: 'rotateX(-90deg) translateZ(50px)' }}>
                                   {/* FIX: Removed @ts-ignore as 'model-viewer' is now declared in types.ts */}
                                   <model-viewer 
                                      src={item.customModelUrl} 
                                      auto-rotate 
                                      camera-controls 
                                      touch-action="pan-y" 
                                      alt="A 3D model"
                                      style={{ width: '100px', height: '160px' }}
                                    ></model-viewer>
                                </div>
                              ) : (
                                <>
                                  <div className="absolute inset-0 bg-white" style={{ transform: `translateZ(${height}px)`, backgroundImage: `url(${material.image})`, backgroundSize: 'cover' }}></div>
                                  <div className="absolute w-full bg-slate-100 origin-top" style={{ height: `${height}px`, top: '100%', left: 0, transform: 'rotateX(-90deg)', filter: 'brightness(0.8)' }}></div>
                                  <div className="absolute h-full bg-slate-300 origin-left" style={{ width: `${height}px`, top: 0, left: '100%', transform: 'rotateY(90deg)', filter: 'brightness(0.6)' }}></div>
                                </>
                              )}
                              
                              {!isLamp && <div className="absolute inset-0 bg-black/40 blur-xl scale-110" style={{ transform: 'translateZ(-1px)' }}></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
             <button onClick={() => setIsAddingRoom(true)} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold">立即创建房间</button>
          </div>
        )}
      </div>

      {/* 创建房间弹窗保持不变... */}
      {isAddingRoom && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-2xl z-[100] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-scaleIn">
             {/* 保持之前的弹窗内容... */}
             <div className="bg-indigo-600 p-10 text-white relative">
               <button onClick={() => setIsAddingRoom(false)} className="absolute top-8 right-8 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <i className="fas fa-times"></i>
               </button>
               <h3 className="text-3xl font-black">空间定义</h3>
               <p className="text-indigo-100 font-medium opacity-80">设定房间的用途及其建筑尺寸基础</p>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">房间识别名称</label>
                  <input type="text" autoFocus value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} placeholder="例如：主卧 Master Bedroom" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-slate-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">空间功能</label>
                  <select value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold">
                    {ROOM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div className="flex gap-4 items-end">
                   <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">宽度 (M)</label>
                      <input type="number" step="0.1" value={newRoom.width} onChange={e => setNewRoom({...newRoom, width: Number(e.target.value)})} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-mono font-bold" />
                   </div>
                   <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">长度 (M)</label>
                      <input type="number" step="0.1" value={newRoom.length} onChange={e => setNewRoom({...newRoom, length: Number(e.target.value)})} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-mono font-bold" />
                   </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsAddingRoom(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-bold">取消</button>
                <button onClick={handleAddRoom} disabled={!newRoom.name.trim()} className={`flex-1 py-5 rounded-2xl font-black shadow-2xl transition-all ${!newRoom.name.trim() ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>创建房间</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanner;
