
export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  DESIGNER = 'DESIGNER',
  PLANNER = 'PLANNER',
  MATERIALS = 'MATERIALS',
  BUDGET = 'BUDGET'
}

export interface Material {
  id: string;
  name: string;
  category: '地板' | '墙面' | '灯具' | '家具' | '卫浴' | '结构';
  price: number;
  unit: string;
  image: string;
  description: string;
  brand?: string;
  spec?: string; // 规格如 800x800mm
}

export interface Room {
  id: string;
  name: string;
  width: number;
  length: number;
  type: string;
  items: DesignItem[];
}

export interface DesignItem {
  id: string;
  materialId: string;
  quantity: number;
  posX: number;
  posY: number;
  rotation: number; // 旋转角度
  customModelUrl?: string; // 外部 3D 模型 URL (GLB/GLTF)
}

export interface GeneratedDesign {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: number;
}

export interface ProjectState {
  id: string;
  name: string;
  rooms: Room[];
  generatedDesigns: GeneratedDesign[];
  selectedMaterialIds: string[];
}

// FIX: Declare 'model-viewer' as a valid JSX element to resolve TypeScript errors for custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}
