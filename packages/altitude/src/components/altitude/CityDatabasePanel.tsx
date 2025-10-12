import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@flowkit/shared-ui';
import { Button } from '@flowkit/shared-ui';
import { Input } from '@flowkit/shared-ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@flowkit/shared-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { CityData } from './types';
import CityList from './CityList';

interface CityDatabasePanelProps {
  cities: CityData[];
  searchTerm: string;
  continentFilter: string;
  selectedCities: Set<string>;
  onSearchChange: (term: string) => void;
  onContinentFilterChange: (continent: string) => void;
  onCitySelect: (cityId: string) => void;
  onCityDeselect: (cityId: string) => void;
  onClearSelection: () => void;
}

const CityDatabasePanel: React.FC<CityDatabasePanelProps> = ({
  cities,
  searchTerm,
  continentFilter,
  selectedCities,
  onSearchChange,
  onContinentFilterChange,
  onCitySelect,
  onCityDeselect,
  onClearSelection
}) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-700">全球城市海拔数据库</CardTitle>
        <CardDescription>
          收录全球500+主要城市的海拔数据，支持搜索和筛选
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 搜索和筛选区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="搜索城市或国家..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="w-full justify-between">
                  {continentFilter === 'all' ? '选择大洲' : continentFilter}
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onContinentFilterChange('all')}>全部大洲</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('亚洲')}>亚洲</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('欧洲')}>欧洲</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('北美洲')}>北美洲</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('南美洲')}>南美洲</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('非洲')}>非洲</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('大洋洲')}>大洋洲</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('欧洲/亚洲')}>欧洲/亚洲</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 城市列表 */}
          <CityList
            cities={cities}
            selectedCities={selectedCities}
            onCitySelect={onCitySelect}
            onCityDeselect={onCityDeselect}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-gray-600">
          找到 {cities.length} 个城市
        </div>
        <Button
          onClick={onClearSelection}
          disabled={selectedCities.size === 0}
          variant="secondary"
        >
          清除选择
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CityDatabasePanel;