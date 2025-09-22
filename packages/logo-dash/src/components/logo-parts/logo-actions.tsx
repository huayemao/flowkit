import React from 'react';
import { Button } from '@flowkit/shared-ui';
import { Copy, Layout, FileDown, Image as ImageIcon } from 'lucide-react';
import { LogoConfig } from './types';


interface LogoActionsProps {
  config: LogoConfig;
  isLoading: boolean;
  isGridVisible: boolean;
  onCopyToClipboard: () => void;
  onGenerateRandomLogo: () => void;
  onToggleGrid: () => void;
  onExportAsPNG: () => void;
  onExportAsSVG: () => void;
  onImportTemplate: () => void;
  onSaveAsTemplate: () => void;
  onLogoCreated?: (logoUrl: string) => void;
  t: (key: string) => string;
}

export const LogoActions: React.FC<LogoActionsProps> = ({
  isLoading,
  isGridVisible,
  onCopyToClipboard,
  onGenerateRandomLogo,
  onExportAsPNG,
  onExportAsSVG,
  onImportTemplate,
  onSaveAsTemplate,
  // @ts-ignore
  onLogoCreated,
  t
}) => {
  return (
    <>
      <div className="flex gap-2 flex-wrap justify-center  mb-6">
        <Button 
          onClick={onCopyToClipboard}
          variant="default"
          size="sm"
          className="flex items-center gap-1"
        >
          <Copy size={16} />
          {t('logoDash.copy')}
        </Button>
        
        <Button 
          onClick={onGenerateRandomLogo}
          variant="secondary"
          size="sm"
          className="flex items-center gap-3"
        >
          <Layout size={16} />
          {t('logoDash.random')}
        </Button>

      </div>
      
      <div className="flex flex-col gap-3">
        <Button 
          onClick={onExportAsPNG}
          variant="default"
          className="w-full flex items-center justify-center gap-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('logoDash.exporting')}
            </span>
          ) : (
            <> <FileDown size={18} /> {t('logoDash.exportPNG')} </>
          )}
        </Button>
        
        <Button 
          onClick={onExportAsSVG}
          variant="secondary"
          className="w-full flex items-center justify-center gap-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('logoDash.exporting')}
            </span>
          ) : (
            <> <ImageIcon size={18} /> {t('logoDash.exportSVG')} </>
          )}
        </Button>
        
        <div className="flex gap-2">
          <Button 
            onClick={onImportTemplate}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {t('logoDash.importTemplate')}
          </Button>
          
          <Button 
            onClick={onSaveAsTemplate}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {t('logoDash.saveTemplate')}
          </Button>
        </div>
      </div>
    </>
  );
};