import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@flowKit/shared-ui';
import { Button } from '@flowKit/shared-ui';
import { Badge } from '@flowKit/shared-ui';
import { Separator } from '@flowKit/shared-ui';
import { University } from '../../types/university';

interface UniversityDetailDialogProps {
  isOpen: boolean;
  selectedUniversity: University | null;
  onClose: () => void;
}

const UniversityDetailDialog: React.FC<UniversityDetailDialogProps> = ({
  isOpen,
  selectedUniversity,
  onClose
}) => {
  if (!selectedUniversity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">
              {selectedUniversity.name}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-800">
                {selectedUniversity.type}
              </Badge>
              <Badge variant="outline" className="transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                {selectedUniversity.province}
              </Badge>
              <Badge variant="outline" className="transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                {selectedUniversity.city}
              </Badge>
              <Badge variant="outline" className="transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                {selectedUniversity.region}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400 font-medium">所在城市</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedUniversity.city}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400 font-medium">所在省份</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedUniversity.province}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400 font-medium">所属地区</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedUniversity.region}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400 font-medium">学校类型</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedUniversity.type}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                学校简介
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedUniversity.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-0 border-t p-4 bg-gray-50 dark:bg-gray-800/30">
          <Button 
            onClick={onClose}
            className="transition-all duration-300 hover:bg-blue-600"
          >
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UniversityDetailDialog;