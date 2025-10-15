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
 * 同时并行请求高德地图API和Nominatim API，任一API成功返回有效数据就立即返回结果
 * @param latitude 纬度
 * @param longitude 经度
 * @returns 包含城市、地区、国家信息的对象
 */
export const getLocationInfoByCoordinates = async (latitude: number, longitude: number): Promise<{ city?: string; region?: string; country?: string }> => {
  // 创建一个Promise，当任一API成功返回有效数据时解析
  const racePromise = new Promise<{ city?: string; region?: string; country?: string }>((resolve, reject) => {
    // 标记是否已经解析
    let resolved = false;
    
    // 确保只解析一次的辅助函数
    const safeResolve = (data: { city?: string; region?: string; country?: string }) => {
      if (!resolved) {
        resolved = true;
        resolve(data);
      }
    };
    
    // 定义高德地图API请求函数
    const fetchAmapData = async () => {
      try {
        // 高德地图逆地理编码API - 需要替换为有效的key
        // 文档地址：https://lbs.amap.com/api/webservice/guide/api/georegeo#t5
        const key = '8042697f27400d4a8fbdfcb4520ed439'; // 请替换为实际的高德地图API密钥
        const url = `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${key}&extensions=base`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`高德API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 检查响应状态和数据有效性
        if (data.status !== '1' || !data.regeocode) {
          throw new Error('高德API返回无效数据');
        }
        
        // 提取地址信息
        const addressComponent = data.regeocode.addressComponent || {};
        
        // 检查是否返回了有效数据（非空数组）
        const countryArray = addressComponent.country || [];
        if (Array.isArray(countryArray) && countryArray.length === 0) {
          throw new Error('高德API未能获取到有效地址信息');
        }
        
        // 构造并返回位置信息
        const locationData = {
          city: addressComponent.city || addressComponent.district,
          region: addressComponent.province,
          country: '中国' // 高德地图主要覆盖中国地区
        };
        
        // 确保返回的数据至少有一个字段有值
        const { city, region, country } = locationData;
        if (city || region || country) {
          safeResolve(locationData);
        }
      } catch (error) {
        console.error('高德地图API获取位置信息失败:', error);
        // 不抛出错误，让其他API有机会执行
      }
    };

    // 定义Nominatim API请求函数
    const fetchNominatimData = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'AltitudeApp/1.0 (https://example.com/altitude-app)'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Nominatim API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        const address = data.address || {};
        
        // 检查是否有有效的地址信息
        if (!address.country && !address.state && !address.city) {
          throw new Error('Nominatim API未能获取到有效地址信息');
        }
        
        const locationData = {
          city: address.city || address.town || address.village || address.hamlet,
          region: address.state || address.region,
          country: address.country
        };
        
        // 确保返回的数据至少有一个字段有值
        const { city, region, country } = locationData;
        if (city || region || country) {
          safeResolve(locationData);
        }
      } catch (error) {
        console.error('Nominatim API获取位置信息失败:', error);
        // 不抛出错误，让其他API有机会执行
      }
    };

    // 并行启动两个API请求
    fetchAmapData();
    fetchNominatimData();
    
    // 设置超时，确保即使所有API都失败也能返回
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        reject(new Error('所有API请求超时'));
      }
    }, 10000); // 10秒超时
  });

  try {
    // 等待第一个成功的API响应
    return await racePromise;
  } catch (error) {
    console.error('所有主要API都未能及时返回有效数据:', error);
    
    // 如果主要API都失败或超时，尝试备用API
    try {
      const url = `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}&lang=zh`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`备用API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      const properties = data.features?.[0]?.properties || {};
      
      const locationData = {
        city: properties.city || properties.town || properties.village,
        region: properties.state,
        country: properties.country
      };
      
      // 检查备用API返回的数据是否有效
      const { city, region, country } = locationData;
      if (city || region || country) {
        return locationData;
      }
    } catch (backupError) {
      console.error('备用API获取位置信息失败:', backupError);
    }
    
    // 所有API都失败或返回无效数据，返回空对象
    return {};
  }
};