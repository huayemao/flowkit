// 海拔数据API服务

/**
 * 获取指定经纬度的海拔高度
 * 使用Open Topo Data API - 一个免费的开源海拔数据API
 * @param latitude 纬度
 * @param longitude 经度
 * @returns 海拔高度（米）
 */
export const getElevationByCoordinates = async (latitude: number, longitude: number): Promise<number> => {
  try {
    // Open Topo Data API URL
    // 使用SRTM90m数据集，这是一个全球覆盖的海拔数据集
    const url = `https://api.opentopodata.org/v1/srtm90m?locations=${latitude},${longitude}`;
    
    // 发送API请求
    const response = await fetch(url);
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    // 解析JSON响应
    const data = await response.json();
    
    // 提取海拔高度数据
    // API返回的是一个数组，我们取第一个结果
    const elevation = data.results[0]?.elevation;
    
    // 验证海拔数据
    if (elevation === undefined || elevation === null || isNaN(elevation)) {
      throw new Error('未能获取有效的海拔数据');
    }
    
    // 返回整数形式的海拔高度
    return Math.floor(elevation);
  } catch (error) {
    console.error('获取海拔数据失败:', error);
    
    // 在API调用失败时返回默认值（可以根据需要调整）
    return 0;
  }
};

/**
 * 获取指定位置的详细地理信息（城市、地区、国家等）
 * 使用Nominatim API（基于OpenStreetMap数据）
 * @param latitude 纬度
 * @param longitude 经度
 * @returns 包含城市、地区、国家信息的对象
 */
export const getLocationInfoByCoordinates = async (latitude: number, longitude: number): Promise<{ city?: string; region?: string; country?: string }> => {
  try {
    // Nominatim API URL - 反向地理编码
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
    
    // 发送API请求
    const response = await fetch(url, {
      headers: {
        // 按照Nominatim API的要求添加User-Agent
        'User-Agent': 'AltitudeApp/1.0 (https://example.com/altitude-app)'
      }
    });
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    // 解析JSON响应
    const data = await response.json();
    
    // 提取地址信息
    const address = data.address || {};
    
    // 构造并返回位置信息
    return {
      city: address.city || address.town || address.village || address.hamlet,
      region: address.state || address.region,
      country: address.country
    };
  } catch (error) {
    console.error('获取位置信息失败:', error);
    
    // 在API调用失败时返回空对象
    return {};
  }
};