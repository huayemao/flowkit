import React from 'react';
import { Card, CardHeader, CardTitle } from '@flowKit/shared-ui';
import { Input } from '@flowKit/shared-ui';
import { Label } from '@flowKit/shared-ui';
import { Button } from '@flowKit/shared-ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@flowKit/shared-ui';
import { provinces, regions, types, countByProvince } from '../../constants/university';
import { FilterState, ViewMode } from '../../types/university';

interface UniversityFiltersProps {
  filters: FilterState;
  viewMode: ViewMode;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onReset: () => void;
}

const UniversityFilters: React.FC<UniversityFiltersProps> = ({
  filters,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onReset
}) => {
  return (
    <Card className="absolute top-4 left-4 z-10 max-w-md shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">筛选条件</CardTitle>
      </CardHeader>
      <div className="p-4 pt-2 space-y-4">
        {/* 搜索框 */}
        <div>
          <Input
            type="text"
            placeholder="搜索大学名称、城市或省份"
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 省份选择 */}
        <div className="space-y-1">
          <Label htmlFor="province" className="font-medium">省份</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                {filters.selectedProvince === 'all' ? '全部' : filters.selectedProvince}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
              <DropdownMenuItem
                onClick={() => onFiltersChange({ selectedProvince: 'all' })}
                className={filters.selectedProvince === 'all' ? 'bg-accent' : ''}
              >
                全部
              </DropdownMenuItem>
              {provinces.map((province) => (
                <DropdownMenuItem
                  key={province}
                  onClick={() => onFiltersChange({ selectedProvince: province })}
                  className={filters.selectedProvince === province ? 'bg-accent' : ''}
                >
                  {`${province} (${countByProvince[province] || 0}所)`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 地区选择 */}
        <div className="space-y-1">
          <Label htmlFor="region" className="font-medium">地区</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                {filters.selectedRegion === 'all' ? '全部' : filters.selectedRegion}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
              {regions.map((region) => (
                <DropdownMenuItem
                  key={region}
                  onClick={() => onFiltersChange({ selectedRegion: region })}
                  className={filters.selectedRegion === region ? 'bg-accent' : ''}
                >
                  {region === 'all' ? '全部' : region}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 类型选择 */}
        <div className="space-y-1">
          <Label htmlFor="type" className="font-medium">类型</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                {filters.selectedType === 'all' ? '全部' : filters.selectedType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
              {types.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => onFiltersChange({ selectedType: type })}
                  className={filters.selectedType === type ? 'bg-accent' : ''}
                >
                  {type === 'all' ? '全部' : type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 视图模式选择 */}
        <div className="space-y-1">
          <Label htmlFor="viewMode" className="font-medium">视图模式</Label>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              className="flex-1 transition-all duration-300"
              onClick={() => onViewModeChange('map')}
            >
              仅地图
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              className="flex-1 transition-all duration-300"
              onClick={() => onViewModeChange('list')}
            >
              仅列表
            </Button>
            <Button
              variant={viewMode === 'both' ? 'default' : 'outline'}
              className="flex-1 transition-all duration-300"
              onClick={() => onViewModeChange('both')}
            >
              两者都
            </Button>
          </div>
        </div>

        {/* 重置按钮 */}
        <Button
          variant="secondary"
          className="w-full transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/30"
          onClick={onReset}
        >
          重置筛选
        </Button>
      </div>
    </Card>
  );
};

export default UniversityFilters;