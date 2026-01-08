
import { Material } from './types';

export const INITIAL_MATERIALS: Material[] = [
  // 地板
  {
    id: 'mat-1',
    name: '北欧原木色实木多层地板',
    category: '地板',
    price: 458,
    unit: '平米',
    image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=400',
    description: '采用E0级环保标准，耐磨性能出色。',
    brand: '圣象地板',
    spec: '1210*165*15mm'
  },
  {
    id: 'mat-2',
    name: '鱼肚白大理石瓷砖',
    category: '地板',
    price: 288,
    unit: '平米',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=400',
    description: '全抛釉工艺，纹理自然连贯。',
    brand: '马可波罗',
    spec: '800*800mm'
  },
  // 结构 (新增)
  {
    id: 'struct-1',
    name: '标准单开室内门',
    category: '结构',
    price: 2200,
    unit: '套',
    image: 'https://images.unsplash.com/photo-1517646331032-9e8563c520a1?w=400',
    description: '实木复合材质，静音磁吸锁。',
    brand: 'TATA木门',
    spec: '2100*900mm'
  },
  {
    id: 'struct-2',
    name: '极简窄边落地窗',
    category: '结构',
    price: 1500,
    unit: '平米',
    image: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=400',
    description: '断桥铝合金材质，三层中空玻璃。',
    brand: '系统窗专业定制',
    spec: '定制尺寸'
  },
  // 灯具
  {
    id: 'mat-3',
    name: '无主灯线性轨道灯',
    category: '灯具',
    price: 120,
    unit: '米',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400',
    description: '4000K色温，高显指，支持智能调光。',
    brand: '雷士照明',
    spec: 'DC48V磁吸轨道'
  },
  // 家具
  {
    id: 'mat-5',
    name: '意式极简磨砂皮沙发',
    category: '家具',
    price: 12800,
    unit: '组',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    description: '羽绒填充，坐感饱满，头层磨砂牛皮。',
    brand: '顾家家居',
    spec: '2800*1050*850mm'
  }
];

export const ROOM_TYPES = ['客厅', '卧室', '厨房', '卫生间', '餐厅', '书房'];
