import universityDataJson from '../../public/resources/university-data.json';
import chinaProvincesJson from '../../public/resources/china-provinces.json';

// 预处理大学数据
export const universityData = universityDataJson.universities;

// 计算每个省份的大学数量
export const countByProvince: Record<string, number> = universityData.reduce(
  (acc: Record<string, number>, uni) => {
    acc[uni.province] = (acc[uni.province] || 0) + 1;
    return acc;
  },
  {}
);

// 常量定义
export const provinces = chinaProvincesJson.features.map((feature: any) => feature.properties.name);
export const regions = [
  'all',
  '华东',
  '华南',
  '华北',
  '华中',
  '西南',
  '西北',
  '东北',
];
export const types = [
  'all',
  '综合类',
  '理工类',
  '农林类',
  '医药类',
  '师范类',
  '财经类',
  '政法类',
];

// 地图初始状态
export const initialViewState = {
  longitude: 105,
  latitude: 35,
  zoom: 3.5,
};

// 地图box token（应该考虑移到环境变量中）
export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiaHVheWVtYW8iLCJhIjoiY2xvbDA4eWd3MHRrcDJrbWl5YTE0Z3VlMSJ9.HXGuYn45BMY_4hCSyNs98A';