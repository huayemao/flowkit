import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@flowKit/shared-ui';
import { Badge } from '@flowKit/shared-ui';
import { University, ViewMode } from '../../types/university';

interface UniversityListProps {
  universities: University[];
  viewMode: ViewMode;
  onUniversitySelect: (university: University) => void;
}

const UniversityList: React.FC<UniversityListProps> = ({
  universities,
  viewMode,
  onUniversitySelect
}) => {
  if (viewMode === 'map') return null;

  return (
    <Card className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="text-lg font-semibold">大学列表</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          共显示 {universities.length} 所大学
        </p>
      </CardHeader>
      <div className="max-h-[60vh] overflow-y-auto">
        {universities.map((university) => (
          <div
            key={university.id}
            className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all duration-300 transform hover:translate-x-1"
            onClick={() => onUniversitySelect(university)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {university.name}
              </h3>
              <Badge 
                variant="secondary" 
                className="ml-2 transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                {university.type}
              </Badge>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>
                {university.city}, {university.province}
              </span>
            </div>
            <p className="mt-2 text-sm line-clamp-2 text-gray-600 dark:text-gray-300">
              {university.description}
            </p>
          </div>
        ))}
      </div>
      {universities.length === 0 && (
        <CardContent className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            没有找到符合条件的大学
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            请尝试调整筛选条件
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default UniversityList;