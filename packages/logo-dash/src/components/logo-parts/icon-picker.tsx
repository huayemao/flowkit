import React, { useState, useMemo, useEffect } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@flowkit/shared-ui';
import { Button } from '@flowkit/shared-ui';
import { Input } from '@flowkit/shared-ui';
import * as LucideIcons from 'lucide-react';
import { DynamicIconComponent } from './dynamic-icon';
import { IconCategories } from './types';

interface IconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
  iconCategories: IconCategories;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  t: (key: string) => string;
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
  
  // 使用 useDebounce 钩子创建防抖后的搜索词
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // 处理搜索状态
  useEffect(() => {
    // 只有当搜索词长度大于等于2且不为空时才显示加载状态
    if (searchTerm.trim().length >= 2) {
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
  
  // 过滤图标 - 最少两个字符才开始搜索
  const filteredIcons = useMemo(() => {
    // 如果没有搜索词或搜索词少于两个字符，显示当前分类的图标
    if (!debouncedSearchTerm.trim() || debouncedSearchTerm.trim().length < 2) {
      return iconCategories[selectedCategory as keyof typeof iconCategories];
    }
    
    const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
    return allIcons.filter(iconName => 
      iconName.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [debouncedSearchTerm, selectedCategory, iconCategories, allIcons]);
  
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('logoDash.selectIcon')}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
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
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
              {Object.keys(iconCategories).map(category => (
                <Button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'secondary'}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          )}
          
          {/* 图标网格 - 如果有搜索结果，显示搜索结果，否则显示当前分类的图标 */}
          <div className="grid grid-cols-5 gap-3 max-h-[400px] overflow-y-auto">
            {/* 显示加载中状态 */}
            {isSearching && searchTerm.trim().length >= 2 ? (
              <div className="col-span-5 flex justify-center items-center h-[400px]">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  <span className="text-gray-500">{t('logoDash.searching')}</span>
                </div>
              </div>
            ) : (
              filteredIcons.map((iconName: string) => {
              const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
              
              // 如果在搜索模式下，显示图标所属分类
              const categoryName = debouncedSearchTerm.trim() ? getIconCategory(iconName) : selectedCategory;
              
              return IconComponent ? (
                <button
                  key={iconName}
                  onClick={() => {
                    onSelectIcon(iconName);
                    onOpenChange(false);
                  }}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition-colors
                    ${selectedIcon === iconName ? 'bg-indigo-100 text-indigo-600' : ''}`}
                  title={iconName}
                >
                  <DynamicIconComponent icon={iconName} size={24} />
                  <span className="text-xs mt-2 truncate text-center w-full">{iconName}</span>
                  {searchTerm.trim().length >= 2 && (
                    <span className="text-xs text-gray-500 truncate text-center w-full">
                      {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                    </span>
                  )}
                </button>
              ) : null;
              })
            )}
          </div>
          
          {/* 搜索结果为空时的提示 */}
          {debouncedSearchTerm.trim() && filteredIcons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {t('logoDash.noIconsFound')}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};