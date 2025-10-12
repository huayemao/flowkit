// 海拔数据API服务

/**
 * 获取指定经纬度的海拔高度
 * 使用高精度海拔数据API
 * @param latitude 纬度
 * @param longitude 经度
 * @returns 海拔高度（米）
 */
export const getElevationByCoordinates = async (latitude: number, longitude: number): Promise<number> => {
  try {
    // 高精度海拔数据API
    // 这个API提供全球覆盖的高精度海拔数据
    const url = `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`;
    
    // 发送API请求
    const response = await fetch(url);
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    // 解析JSON响应
    const data = await response.json();
    
    // 提取海拔高度数据
    const elevation = data.results[0]?.elevation;
    
    // 验证海拔数据
    if (elevation === undefined || elevation === null || isNaN(elevation)) {
      throw new Error('未能获取有效的海拔数据');
    }
    
    // 返回整数形式的海拔高度
    return Math.floor(elevation);
  } catch (error) {
    console.error('获取海拔数据失败:', error);
    
    // 尝试备用API
    try {
      // Open Topo Data API (备用)
      const backupUrl = `https://api.opentopodata.org/v1/srtm90m?locations=${latitude},${longitude}`;
      const backupResponse = await fetch(backupUrl);
      
      if (!backupResponse.ok) {
        throw new Error(`备用API请求失败: ${backupResponse.status}`);
      }
      
      const backupData = await backupResponse.json();
      const backupElevation = backupData.results[0]?.elevation;
      
      if (backupElevation === undefined || backupElevation === null || isNaN(backupElevation)) {
        throw new Error('备用API未能获取有效的海拔数据');
      }
      
      return Math.floor(backupElevation);
    } catch (backupError) {
      console.error('备用API获取海拔数据失败:', backupError);
      
      // 在API调用全部失败时返回默认值
      return 0;
    }
  }
};

/**
 * 获取指定位置的详细地理信息（城市、地区、国家等）
 * 使用高德地图逆地理编码API
 * @param latitude 纬度
 * @param longitude 经度
 * @returns 包含城市、地区、国家信息的对象
 */
export const getLocationInfoByCoordinates = async (latitude: number, longitude: number): Promise<{ city?: string; region?: string; country?: string }> => {
  try {
    // 高德地图逆地理编码API - 需要替换为有效的key
    // 文档地址：https://lbs.amap.com/api/webservice/guide/api/georegeo#t5
    const key = '8042697f27400d4a8fbdfcb4520ed439'; // 请替换为实际的高德地图API密钥
    const url = `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${key}&extensions=base`;
    
    // 发送API请求
    const response = await fetch(url);
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    // 解析JSON响应
    const data = await response.json();
    
    // 检查响应状态
    if (data.status !== '1' || !data.regeocode) {
      throw new Error('API返回无效数据');
    }
    
    // 提取地址信息
    const addressComponent = data.regeocode.addressComponent || {};
    
    // 构造并返回位置信息
    return {
      city: addressComponent.city || addressComponent.district,
      region: addressComponent.province,
      country: '中国' // 高德地图主要覆盖中国地区
    };
  } catch (error) {
    console.error('高德地图API获取位置信息失败:', error);
    
    // 尝试备用API - Nominatim API（基于OpenStreetMap数据）
    try {
      const backupUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
      const backupResponse = await fetch(backupUrl, {
        headers: {
          'User-Agent': 'AltitudeApp/1.0 (https://example.com/altitude-app)'
        }
      });
      
      if (!backupResponse.ok) {
        throw new Error(`备用API请求失败: ${backupResponse.status}`);
      }
      
      const backupData = await backupResponse.json();
      const address = backupData.address || {};
      
      return {
        city: address.city || address.town || address.village || address.hamlet,
        region: address.state || address.region,
        country: address.country
      };
    } catch (backupError) {
      console.error('备用API获取位置信息失败:', backupError);
      
      // 尝试第二个备用API
      try {
        const secondBackupUrl = `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}&lang=zh`;
        const secondBackupResponse = await fetch(secondBackupUrl);
        
        if (!secondBackupResponse.ok) {
          throw new Error(`第二个备用API请求失败: ${secondBackupResponse.status}`);
        }
        
        const secondBackupData = await secondBackupResponse.json();
        const properties = secondBackupData.features?.[0]?.properties || {};
        
        return {
          city: properties.city || properties.town || properties.village,
          region: properties.state,
          country: properties.country
        };
      } catch (secondBackupError) {
        console.error('第二个备用API获取位置信息失败:', secondBackupError);
        
        // 在API调用全部失败时返回空对象
        return {};
      }
    }
  }
};