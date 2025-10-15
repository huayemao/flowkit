import React, { useState, useMemo, useEffect } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@flowkit/shared-ui';
import { Button } from '@flowkit/shared-ui';
import { Input } from '@flowkit/shared-ui';
import { DynamicIconComponent } from './dynamic-icon';
import { IconCategories } from './types';
import { TFunction } from 'i18next';

interface IconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
  iconCategories: IconCategories;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  t: TFunction;
}

export const IconPicker: React.FC<IconPickerProps> = ({ 
  open, 
  onOpenChange, 
  selectedIcon, 
  onSelectIcon, 
  iconCategories, 
  selectedCategory, 
  onSelectCategory, 
  t
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50; // 每页显示50个图标
  
  // 使用 useDebounce 钩子创建防抖后的搜索词
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // 处理搜索状态
  useEffect(() => {
    // 只有当搜索词长度大于等于2且不为空时才显示加载状态
    if (searchTerm.trim().length >= 1) {
      setIsSearching(true);
      
      // 创建一个短暂的延迟以确保用户能看到加载状态
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);
  
  // 获取所有图标名称
  const allIcons = useMemo(() => {
    return Object.values(iconCategories).flat();
  }, [iconCategories]);
  
  // 重置页码当搜索词或分类改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory]);
  
  // 过滤图标 - 最少两个字符才开始搜索
  const filteredIcons = useMemo(() => {
    // 如果没有搜索词或搜索词少于两个字符，显示当前分类的图标
    if (!debouncedSearchTerm.trim()) {
      return iconCategories[selectedCategory as keyof typeof iconCategories];
    }
    
    const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
    
    // 正常搜索过滤
    return allIcons.filter(iconName => 
      iconName.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [debouncedSearchTerm, selectedCategory, iconCategories, allIcons]);
  
  // 计算分页后的图标列表
  const paginatedIcons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredIcons.slice(startIndex, endIndex);
  }, [filteredIcons, currentPage, itemsPerPage]);
  
  // 计算总页数
  const totalPages = Math.ceil(filteredIcons.length / itemsPerPage);
  
  // 获取图标所属分类
  const getIconCategory = (iconName: string): string => {
    for (const [category, icons] of Object.entries(iconCategories)) {
      if (icons.includes(iconName)) {
        return category;
      }
    }
    return 'other';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] min-w-[300px]  h-[90dvh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg font-semibold">{t('logoDash.selectIcon')}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 flex-grow flex flex-col min-h-0">
          {/* 搜索框 */}
          <div className="mb-4">
            <Input
              placeholder={t('logoDash.searchIcons')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* 分类标签 - 只在没有搜索时显示 */}
          {!searchTerm.trim() && (
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2 pr-1 -mx-1 px-1 scrollbar-thin scrollbar-thumb-muted">
              {Object.keys(iconCategories).map(category => (
                <Button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'secondary'}
                  size="sm"
                  className="whitespace-nowrap transition-all hover:scale-105"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          )}
          
          {/* 图标网格 - 如果有搜索结果，显示搜索结果，否则显示当前分类的图标 */}
          <div className="grid grid-cols-5  gap-2  overflow-y-auto scrollbar-thin scrollbar-thumb-muted">
            {/* 显示加载中状态 */}
            {isSearching && searchTerm.trim().length >= 2 ? (
              <div className="col-span-full flex justify-center items-center h-[300px]">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  <span className="text-gray-500">{t('logoDash.searching')}</span>
                </div>
              </div>
            ) : (
              paginatedIcons.map((iconName: string) => {
                // 如果在搜索模式下，显示图标所属分类
                const categoryName = debouncedSearchTerm.trim() ? getIconCategory(iconName) : selectedCategory;
                return (
                  <button 
                    key={iconName} 
                    onClick={() => {
                      onSelectIcon(iconName);
                      onOpenChange(false);
                    }}
                    className={`p-2 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition-all transform hover:scale-105
                      ${selectedIcon === iconName ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-300' : ''}`}
                    title={iconName}
                    aria-label={iconName}
                  >
                    <DynamicIconComponent icon={iconName} size={20} />
                    <span className="text-xs mt-1 truncate text-center w-full line-clamp-1">
                      {iconName}
                    </span>
                    {searchTerm.trim().length >= 2 && (
                      <span className="text-xs text-gray-500 truncate text-center w-full line-clamp-1">
                        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center gap-2 py-2 border-t">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {t('logoDash.previousPage')}
              </Button>
              <span className="text-sm text-gray-500">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                {t('logoDash.nextPage')}
              </Button>
            </div>
          )}
          
          {/* 搜索结果计数 */}
          {debouncedSearchTerm.trim() && (
            <div className="mt-2 text-center text-xs text-gray-500">
              {t('logoDash.totalIconsFound', { count: filteredIcons?.length || 0 })}
              {totalPages > 1 && `，${t('logoDash.currentlyShowing', { start: (currentPage - 1) * itemsPerPage + 1, end: Math.min(currentPage * itemsPerPage, filteredIcons?.length || 0) })}`}
            </div>
          )}
          
          {/* 搜索结果为空时的提示 */}
          {debouncedSearchTerm.trim() && filteredIcons.length === 0 && (
            <div className="flex-grow flex items-center justify-center p-8 text-gray-500">
              <div className="text-center">
                <div className="text-xl mb-2">🔍</div>
                <p>{t('logoDash.noIconsFound')}</p>
                <p className="text-sm mt-1">{t('logoDash.tryDifferentSearch')}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};