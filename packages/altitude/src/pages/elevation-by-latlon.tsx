import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { getElevationByCoordinates, getLocationInfoByCoordinates } from '../utils/apiService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@flowkit/shared-ui';
import { Button } from '@flowkit/shared-ui';
import { Input } from '@flowkit/shared-ui';
import { Label } from '@flowkit/shared-ui';
import { Alert, AlertDescription } from '@flowkit/shared-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapPin, faMountain, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import "../index.css";
import "@flowkit/shared-ui/dist/index.css";
// 定义页面组件
export const ElevationByLatLon: React.FC = () => {
  const { t } = useTranslation();
  
  // 表单状态
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  
  // 结果状态
  const [elevation, setElevation] = useState<number | null>(null);
  const [locationInfo, setLocationInfo] = useState<{ city?: string; region?: string; country?: string } | null>(null);
  
  // UI状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 验证经纬度输入
  const validateCoordinates = (lat: string, lon: string): boolean => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    if (isNaN(latNum) || isNaN(lonNum)) {
      setError(t('latlon.error.invalidNumbers'));
      return false;
    }
    
    if (latNum < -90 || latNum > 90) {
      setError(t('latlon.error.latitudeRange'));
      return false;
    }
    
    if (lonNum < -180 || lonNum > 180) {
      setError(t('latlon.error.longitudeRange'));
      return false;
    }
    
    return true;
  };

  // 处理查询
  const handleSearch = async () => {
    // 重置状态
    setError(null);
    setElevation(null);
    setLocationInfo(null);
    setSuccess(false);
    
    // 验证输入
    if (!validateCoordinates(latitude, longitude)) {
      return;
    }
    
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    
    setIsLoading(true);
    
    try {
      // 并行请求海拔和位置信息
      const [elevationData, locationData] = await Promise.all([
        getElevationByCoordinates(latNum, lonNum),
        getLocationInfoByCoordinates(latNum, lonNum)
      ]);
      
      setElevation(elevationData);
      setLocationInfo(locationData);
      setSuccess(true);
    } catch (err) {
      console.error('查询失败:', err);
      setError(t('latlon.error.queryFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      // 清除之前的错误信息
      if (error) setError(null);
    };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="text-center my-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('latlon.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('latlon.subtitle')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 查询表单卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSearch} />
              {t('latlon.form.title')}
            </CardTitle>
            <CardDescription>
              {t('latlon.form.description')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 经纬度输入表单 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 纬度输入 */}
              <div className="space-y-2">
                <Label htmlFor="latitude" className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapPin} size="sm" />
                  {t('latlon.form.latitude')}
                </Label>
                <Input
                  id="latitude"
                  type="text"
                  placeholder={t('latlon.form.latitudePlaceholder')}
                  value={latitude}
                  onChange={handleInputChange(setLatitude)}
                  disabled={isLoading}
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">
                  {t('latlon.form.latitudeRangeText')}
                </p>
              </div>
              
              {/* 经度输入 */}
              <div className="space-y-2">
                <Label htmlFor="longitude" className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapPin} size="sm" />
                  {t('latlon.form.longitude')}
                </Label>
                <Input
                  id="longitude"
                  type="text"
                  placeholder={t('latlon.form.longitudePlaceholder')}
                  value={longitude}
                  onChange={handleInputChange(setLongitude)}
                  disabled={isLoading}
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">
                  {t('latlon.form.longitudeRangeText')}
                </p>
              </div>
            </div>
            
            {/* 错误消息 */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faInfoCircle} size="sm" />
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {/* 查询按钮 */}
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !latitude || !longitude}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></div>
                  {t('latlon.form.searching')}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSearch} className="mr-2" />
                  {t('latlon.form.search')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* 结果显示卡片 */}
        {success && elevation !== null && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="bg-green-100/50">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <FontAwesomeIcon icon={faMountain} />
                {t('latlon.result.title')}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* 海拔结果 */}
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-1">{t('latlon.result.elevation')}</p>
                <p className="text-4xl font-bold text-green-700">
                  {elevation} {t('latlon.result.meters')}
                </p>
              </div>
              
              {/* 坐标信息 */}
              <div className="grid grid-cols-2 gap-4 border-t border-green-200 pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">{t('latlon.form.latitude')}</p>
                  <p className="font-mono text-green-700">{parseFloat(latitude).toFixed(6)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">{t('latlon.form.longitude')}</p>
                  <p className="font-mono text-green-700">{parseFloat(longitude).toFixed(6)}</p>
                </div>
              </div>
              
              {/* 位置信息 */}
              {locationInfo && (locationInfo.city || locationInfo.region || locationInfo.country) && (
                <div className="border-t border-green-200 pt-4 space-y-2">
                  <h3 className="font-medium text-gray-700">{t('latlon.result.locationInfo')}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {locationInfo.city && (
                      <p className="flex gap-2 items-center">
                        <span className="text-sm text-gray-500 w-16">{t('latlon.result.city')}:</span>
                        <span className="font-medium text-green-700">{locationInfo.city}</span>
                      </p>
                    )}
                    {locationInfo.region && (
                      <p className="flex gap-2 items-center">
                        <span className="text-sm text-gray-500 w-16">{t('latlon.result.region')}:</span>
                        <span className="font-medium text-green-700">{locationInfo.region}</span>
                      </p>
                    )}
                    {locationInfo.country && (
                      <p className="flex gap-2 items-center">
                        <span className="text-sm text-gray-500 w-16">{t('latlon.result.country')}:</span>
                        <span className="font-medium text-green-700">{locationInfo.country}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* 页脚 */}
      <div className="mt-16 text-center text-gray-500 text-sm py-8">
        <p>{t('latlon.footer.copyright')}</p>
      </div>
    </div>
  );
};

export default ElevationByLatLon;

// SEO信息
export const seo = {
  title: 'latlon.title',
  description: 'latlon.description',
  keywords: 'latlon.keywords',
  author: 'latlon.author',
  ogTitle: 'latlon.ogTitle',
  ogDescription: 'latlon.ogDescription',
  twitterTitle: 'latlon.twitterTitle',
  twitterDescription: 'latlon.twitterDescription'
};