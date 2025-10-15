import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import UniversityFilters from './UniversityFilters';
import UniversityList from './UniversityList';
import UniversityMapComponent from './UniversityMapComponent';
import UniversityDetailDialog from './UniversityDetailDialog';
import { University, FilterState, ViewMode } from '../../types/university';
import { universityData } from '../../constants/university';
import { filterUniversities } from '../../utils/universityUtils';

const UniversityMap: React.FC = () => {
  const { theme = 'system' } = useTheme();
  const isDark = theme === 'dark';
  
  // 状态管理
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>(universityData);
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  
  // 过滤条件状态
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedProvince: 'all',
    selectedRegion: 'all',
    selectedType: 'all'
  });

  // 处理过滤条件变化
  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 重置所有过滤条件
  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      selectedProvince: 'all',
      selectedRegion: 'all',
      selectedType: 'all'
    });
  };

  // 处理大学选择
  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
    setIsDialogOpen(true);
  };

  // 处理地图加载完成
  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  // 当过滤条件变化时，更新筛选后的大学列表
  useEffect(() => {
    const filtered = filterUniversities(
      universityData,
      filters.searchTerm,
      filters.selectedProvince,
      filters.selectedRegion,
      filters.selectedType
    );
    setFilteredUniversities(filtered);
  }, [filters]);

  // // 地图加载状态显示
  // if (!mapLoaded) {
  //   return (
  //     <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
  //       <div className="text-center p-8">
  //         <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
  //           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10a9 9 0 016-8.65l2.64 2.64A4 4 0 0011.37 8l1.06 1.06a3 3 0 01-.87 4.17l-1.06 1.06a4 4 0 00-1.53 1.53L6.35 16A9 9 0 013 10z" />
  //           </svg>
  //         </div>
  //         <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">地图加载中...</div>
  //         <div className="text-gray-500 dark:text-gray-400">
  //           正在获取地图数据，请稍候
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-[80vh] p-4 md:p-6 space-y-6">
      <div className="relative">
        {/* 筛选控件 */}
        <UniversityFilters
          filters={filters}
          viewMode={viewMode}
          onFiltersChange={handleFiltersChange}
          onViewModeChange={setViewMode}
          onReset={handleResetFilters}
        />

        {/* 地图组件 */}
        <UniversityMapComponent
          universities={filteredUniversities}
          selectedUniversity={selectedUniversity}
          viewMode={viewMode}
          isDark={isDark}
          onUniversitySelect={handleUniversitySelect}
          onMapLoad={handleMapLoad}
        />
      </div>

      {/* 大学列表 */}
      <UniversityList
        universities={filteredUniversities}
        viewMode={viewMode}
        onUniversitySelect={handleUniversitySelect}
      />

      {/* 大学详情对话框 */}
      <UniversityDetailDialog
        isOpen={isDialogOpen}
        selectedUniversity={selectedUniversity}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default UniversityMap;