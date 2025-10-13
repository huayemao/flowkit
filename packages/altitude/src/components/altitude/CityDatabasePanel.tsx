import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@flowkit/shared-ui';
import { Button } from '@flowkit/shared-ui';
import { Input } from '@flowkit/shared-ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@flowkit/shared-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { CityData } from './types';
import CityList from './CityList';
import { useTranslation } from '../../i18n';

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
  const { t } = useTranslation();
  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-2xl text-cyan-700">{t('altitude.citiesDatabase')}</CardTitle>
        <CardDescription>
                    浏览全球主要城市的海拔数据，支持按大洲筛选和按海拔排序
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
                placeholder={t('altitude.searchCities')}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="w-full justify-between">
                  {continentFilter === 'all' ? t('altitude.all') : continentFilter}
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onContinentFilterChange('all')}>{t('altitude.all')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('亚洲')}>{t('altitude.asia')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('欧洲')}>{t('altitude.europe')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('北美洲')}>{t('altitude.northAmerica')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('南美洲')}>{t('altitude.southAmerica')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('非洲')}>{t('altitude.africa')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('大洋洲')}>{t('altitude.oceania')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContinentFilterChange('欧洲/亚洲')}>{t('altitude.europe')}/{t('altitude.asia')}</DropdownMenuItem>
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
          {t('altitude.totalCities', { count: cities.length })}
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