import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@flowkit/shared-ui';
import { Button } from '@flowkit/shared-ui';
import { Input } from '@flowkit/shared-ui';
import { Label } from '@flowkit/shared-ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@flowkit/shared-ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@flowkit/shared-ui';
import { Switch } from '@flowkit/shared-ui';
import { Progress } from '@flowkit/shared-ui';
import { Alert, AlertDescription } from '@flowkit/shared-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faSearch, faArrowsUpDown, faGlobe, faChevronDown, faChevronUp, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { UserLocation, CityData, AltitudeComparisonItem } from './types';
import { mockCitiesData } from './mockData';
import { getElevationByCoordinates, getLocationInfoByCoordinates } from './apiService';
import AltitudeChart from './AltitudeChart';
import CityList from './CityList';
import CurrentLocationPanel from './CurrentLocationPanel';
import CityDatabasePanel from './CityDatabasePanel';
import AltitudeComparisonPanel from './AltitudeComparisonPanel';

// 主组件
const Altitude: React.FC = () => {
  // 初始化翻译
  const { t } = useTranslation();
  
  // 状态管理
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [cities, setCities] = useState<CityData[]>(mockCitiesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [continentFilter, setContinentFilter] = useState('all');
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [comparisonData, setComparisonData] = useState<AltitudeComparisonItem[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [showFeet, setShowFeet] = useState(false);

  // 获取用户位置
  const getUserLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    setUserLocation(null); // 重置用户位置状态

    if (!navigator.geolocation) {
      setLocationError(t('altitude.locationNotSupported'));
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // 创建初始用户位置对象，包含经纬度信息
        const initialUserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: 0, // 默认值，稍后会更新
          city: '获取中...',
          region: '获取中...',
          country: '获取中...'
        };

        // 设置初始用户位置状态
        setUserLocation(initialUserLocation);

        // 跟踪API调用是否全部完成
        let apiCallsCompleted = 0;
        const totalApiCalls = 2;

        // 定义完成处理函数
        const handleApiCallComplete = () => {
          apiCallsCompleted++;
          if (apiCallsCompleted === totalApiCalls) {
            setIsLocating(false);
          }
        };

        // 并行执行两个API调用
        // 1. 获取海拔高度
        getElevationByCoordinates(position.coords.latitude, position.coords.longitude)
          .then(altitude => {
            // 更新用户位置状态的海拔信息
            setUserLocation(prev => prev ? {
              ...prev,
              altitude: altitude
            } : initialUserLocation);
          })
          .catch(error => {
            console.error('获取海拔数据失败:', error);
            setLocationError(t('altitude.elevationDataError'));
            // 即使出错，也继续使用当前状态
          })
          .finally(() => {
            handleApiCallComplete();
          });

        // 2. 获取位置详情
        getLocationInfoByCoordinates(position.coords.latitude, position.coords.longitude)
          .then(locationInfo => {
            // 更新用户位置状态的位置信息
            setUserLocation(prev => prev ? {
              ...prev,
              city: locationInfo.city || '当前位置',
              region: locationInfo.region || '未知地区',
              country: locationInfo.country || '未知国家'
            } : initialUserLocation);
          })
          .catch(error => {
            console.error('获取位置信息失败:', error);
            setLocationError(prev => prev || t('altitude.locationError'));
            // 即使出错，也继续使用当前状态
          })
          .finally(() => {
            handleApiCallComplete();
          });
      },
      (error) => {
        let errorMessage = t('altitude.locationError');
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t('altitude.locationPermissionDenied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = t('altitude.locationError');
              break;
            case error.TIMEOUT:
              errorMessage = t('altitude.locationError');
              break;
          }
          setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // 搜索和筛选城市
  useEffect(() => {
    let filtered = mockCitiesData;
    
    // 应用搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(city => 
        city.name.toLowerCase().includes(term) || 
        city.country.toLowerCase().includes(term)
      );
    }
    
    // 应用大洲筛选
    if (continentFilter !== 'all') {
      filtered = filtered.filter(city => city.continent === continentFilter);
    }
    
    setCities(filtered);
  }, [searchTerm, continentFilter]);

  // 更新对比数据
  useEffect(() => {
    let newComparisonData: AltitudeComparisonItem[] = [];
    
    // 添加用户位置（如果有）
    if (userLocation) {
      newComparisonData.push({
        id: 'user-location',
        name: userLocation.city || '当前位置',
        altitude: userLocation.altitude,
        isUserLocation: true
      });
    }
    
    // 添加选中的城市
    selectedCities.forEach(cityId => {
      const city = mockCitiesData.find(c => c.id === cityId);
      if (city) {
        newComparisonData.push({
          id: city.id,
          name: city.name,
          altitude: city.altitude,
          isUserLocation: false
        });
      }
    });
    
    // 排序
    newComparisonData.sort((a, b) => {
      return sortDirection === 'asc' ? a.altitude - b.altitude : b.altitude - a.altitude;
    });
    
    setComparisonData(newComparisonData);
  }, [selectedCities, userLocation, sortDirection]);

  // 处理城市选择
  const handleCitySelect = (cityId: string) => {
    const newSelected = new Set(selectedCities);
    newSelected.add(cityId);
    setSelectedCities(newSelected);
  };

  // 处理城市取消选择
  const handleCityDeselect = (cityId: string) => {
    const newSelected = new Set(selectedCities);
    newSelected.delete(cityId);
    setSelectedCities(newSelected);
  };

  // 切换排序方向
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // 添加用户位置到对比
  const handleAddUserLocation = () => {
    console.log('添加用户位置到对比列表');
  };

  // 清除选择
  const handleClearSelection = () => {
    setSelectedCities(new Set());
  };

  // 切换离线模式
  useEffect(() => {
    // 在实际应用中，这里应该处理离线数据缓存
    console.log('离线模式:', isOfflineMode);
  }, [isOfflineMode]);

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('altitude.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('altitude.subtitle')}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <Switch
              id="offline-mode"
              checked={isOfflineMode}
              onCheckedChange={setIsOfflineMode}
            />
            <Label htmlFor="offline-mode" className="text-sm text-gray-600">
              {t('altitude.offlineMode')}
            </Label>
          </div>
        </div>

        {/* 主要内容区 */}
        <Tabs defaultValue="current-location" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="current-location">
                <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                {t('altitude.currentLocation')}
              </TabsTrigger>
              <TabsTrigger value="city-database">
                <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                {t('altitude.citiesDatabase')}
              </TabsTrigger>
              <TabsTrigger value="altitude-comparison">
                <FontAwesomeIcon icon={faArrowsUpDown} className="mr-2" />
                {t('altitude.altitudeComparison')}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 实时海拔查询面板 */}
          <TabsContent value="current-location" className="space-y-8">
            <CurrentLocationPanel
              userLocation={userLocation}
              isLocating={isLocating}
              locationError={locationError}
              onGetLocation={getUserLocation}
            />
          </TabsContent>

          {/* 全球城市数据库面板 */}
          <TabsContent value="city-database" className="space-y-8">
            <CityDatabasePanel
              cities={cities}
              searchTerm={searchTerm}
              continentFilter={continentFilter}
              selectedCities={selectedCities}
              onSearchChange={setSearchTerm}
              onContinentFilterChange={setContinentFilter}
              onCitySelect={handleCitySelect}
              onCityDeselect={handleCityDeselect}
              onClearSelection={handleClearSelection}
            />
          </TabsContent>

          {/* 海拔对比分析面板 */}
          <TabsContent value="altitude-comparison" className="space-y-8">
            <AltitudeComparisonPanel
              comparisonData={comparisonData}
              selectedCities={selectedCities}
              userLocation={userLocation}
              sortDirection={sortDirection}
              onToggleSortDirection={toggleSortDirection}
              onCityDeselect={handleCityDeselect}
              onAddUserLocation={handleAddUserLocation}
            />
          </TabsContent>
        </Tabs>

        {/* 页脚信息 */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>{t('altitude.copyright')}</p>
        </div>
      </div>
    </div>
  );
};

export default Altitude;