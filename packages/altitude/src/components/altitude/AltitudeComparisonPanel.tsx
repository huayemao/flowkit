import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@flowkit/shared-ui';
import { Button } from '@flowkit/shared-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { AltitudeComparisonItem, UserLocation } from './types';
import AltitudeChart from './AltitudeChart';
import { mockCitiesData } from './mockData';

interface AltitudeComparisonPanelProps {
  comparisonData: AltitudeComparisonItem[];
  selectedCities: Set<string>;
  userLocation: UserLocation | null;
  sortDirection: 'asc' | 'desc';
  onToggleSortDirection: () => void;
  onCityDeselect: (cityId: string) => void;
  onAddUserLocation: () => void;
}

const AltitudeComparisonPanel: React.FC<AltitudeComparisonPanelProps> = ({
  comparisonData,
  selectedCities,
  userLocation,
  sortDirection,
  onToggleSortDirection,
  onCityDeselect,
  onAddUserLocation
}) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-cyan-700">海拔对比分析</CardTitle>
          <Button
            onClick={onToggleSortDirection}
            variant="ghost"
            className="text-cyan-600"
          >
            {sortDirection === 'asc' ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
            {sortDirection === 'asc' ? '升序' : '降序'}
          </Button>
        </div>
        <CardDescription>
          可视化对比多个城市和您当前位置的海拔高度
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 图表区域 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <AltitudeChart data={comparisonData} sortedBy={sortDirection} />
          </div>

          {/* 已选城市列表 */}
          {selectedCities.size > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">已选择的城市</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedCities).map(cityId => {
                  const city = mockCitiesData.find(c => c.id === cityId);
                  return city ? (
                    <span
                      key={cityId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800"
                    >
                      {city.name}
                      <button
                        className="ml-1 text-cyan-600 hover:text-cyan-800"
                        onClick={() => onCityDeselect(cityId)}
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* 说明文本 */}
          {comparisonData.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="mb-2">暂无对比数据</p>
              <p>请在"实时海拔查询"中获取您的位置，或在"全球城市数据库"中选择城市进行对比</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        {userLocation && !selectedCities.has('user-location') && (
          <Button
            onClick={onAddUserLocation}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
            添加我的位置到对比
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AltitudeComparisonPanel;