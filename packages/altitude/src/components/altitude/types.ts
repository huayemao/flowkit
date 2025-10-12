// 城市数据接口
export interface CityData {
  id: string;
  name: string;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
  altitude: number; // 海拔高度（米）
}

// 用户位置接口
export interface UserLocation {
  latitude: number;
  longitude: number;
  altitude: number;
  city?: string;
  region?: string;
  country?: string;
}

// 海拔对比数据接口
export interface AltitudeComparisonItem {
  id: string;
  name: string;
  altitude: number;
  isUserLocation: boolean;
}