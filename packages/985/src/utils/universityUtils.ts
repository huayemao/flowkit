import { University } from '../types/university';
import { countByProvince } from '../constants/university';

// 生成颜色映射的函数
export const generateColorScale = (isDark: boolean) => {
  const maxCount = Math.max(...Object.values(countByProvince));
  return Object.entries(countByProvince).reduce(
    (acc, [province, count]) => {
      // 根据数量计算颜色深度
      const intensity = count / maxCount;
      const blueValue = Math.round(59 + intensity * 176); // 从蓝色59到蓝色235
      const opacity = 0.1 + intensity * 0.3; // 不透明度从0.1到0.4
      acc[province] = isDark
        ? `rgba(59, 130, 246, ${opacity})`
        : `rgba(${blueValue}, ${blueValue + 71}, ${blueValue + 187}, ${opacity})`;
      return acc;
    },
    {} as Record<string, string>
  );
};

// 过滤大学数据的函数
export const filterUniversities = (
  universities: University[],
  searchTerm: string,
  selectedProvince: string,
  selectedRegion: string,
  selectedType: string
): University[] => {
  let result = [...universities];

  // 搜索过滤
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    result = result.filter(
      (univ) =>
        univ.name.toLowerCase().includes(searchLower) ||
        univ.city.toLowerCase().includes(searchLower) ||
        univ.province.toLowerCase().includes(searchLower)
    );
  }

  // 省份过滤
  if (selectedProvince !== 'all') {
    result = result.filter((univ) => univ.province === selectedProvince);
  }

  // 地区过滤
  if (selectedRegion !== 'all') {
    result = result.filter((univ) => univ.region === selectedRegion);
  }

  // 类型过滤
  if (selectedType !== 'all') {
    result = result.filter((univ) => univ.type === selectedType);
  }

  return result;
};

// 处理省份名称标准化
export const normalizeProvinceName = (name: string): string => {
  return name
    .replace('市', '')
    .replace('省', '')
    .replace('自治区', '')
    .replace('特别行政区', '');
};

// 获取地图样式
export const getMapStyle = (isDark: boolean): string => {
  return isDark
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
};