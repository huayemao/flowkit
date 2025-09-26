import React from 'react';
import { Card, CardContent } from '@flowkit/shared-ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@flowkit/shared-ui';
import { Slider } from '@flowkit/shared-ui';
import { Switch } from '@flowkit/shared-ui';
import { Input } from '@flowkit/shared-ui';
import { Label } from '@flowkit/shared-ui';
import { Button } from '@flowkit/shared-ui';
import { SplitMode } from '../types';

interface SplitSettingsProps {
  splitMode: SplitMode | null;
  setSplitMode: (mode: SplitMode) => void;
  splitDuration: number;
  setSplitDuration: (duration: number) => void;
  splitParts: number;
  setSplitParts: (parts: number) => void;
  useDurationMode: boolean;
  setUseDurationMode: (use: boolean) => void;
  showAdvancedSettings: boolean;
  setShowAdvancedSettings: (show: boolean) => void;
  outputFormat: string;
  setOutputFormat: (format: string) => void;
  quality: string;
  setQuality: (quality: string) => void;
  t: (key: string, options?: any) => string;
}

const SplitSettings: React.FC<SplitSettingsProps> = ({
  splitMode,
  setSplitMode,
  splitDuration,
  setSplitDuration,
  splitParts,
  setSplitParts,
  useDurationMode,
  setUseDurationMode,
  showAdvancedSettings,
  setShowAdvancedSettings,
  outputFormat,
  setOutputFormat,
  quality,
  setQuality,
  t
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">{t('videoSplitter.splitMode')}</h3>

        <Tabs defaultValue="fast" className="w-full" onValueChange={(value) => setSplitMode(value as SplitMode)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="fast">{t('videoSplitter.fastSplit')}</TabsTrigger>
            <TabsTrigger value="precise">{t('videoSplitter.preciseSplit')}</TabsTrigger>
          </TabsList>

          <TabsContent value="fast" className="space-y-4">
            <p className="text-gray-500">{t('videoSplitter.fastSplit')} - {t('videoSplitter.selectSplitMode')}</p>
          </TabsContent>

          <TabsContent value="precise" className="space-y-4">
            <p className="text-gray-500">{t('videoSplitter.preciseSplit')} - {t('videoSplitter.selectSplitMode')}</p>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          {/* 分割方式切换 */}
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              <Button
                variant={useDurationMode ? "default" : "secondary"}
                onClick={() => setUseDurationMode(true)}
              >
                {t('videoSplitter.byDuration')}
              </Button>
              <Button
                variant={!useDurationMode ? "default" : "secondary"}
                onClick={() => setUseDurationMode(false)}
              >
                {t('videoSplitter.byParts')}
              </Button>
            </div>
          </div>

          {/* 按时长分割 */}
          {useDurationMode && (
            <div className="space-y-2">
              <Label htmlFor="split-duration">{t('videoSplitter.splitDuration')}</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="split-duration"
                  min={1}
                  max={300}
                  step={1}
                  value={[splitDuration]}
                  onValueChange={(value) => setSplitDuration(value[0])}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={splitDuration}
                  onChange={(e) => setSplitDuration(parseInt(e.target.value) || 1)}
                  min={1}
                  max={300}
                  className="w-20"
                />
              </div>
            </div>
          )}

          {/* 按等分分割 */}
          {!useDurationMode && (
            <div className="space-y-2">
              <Label htmlFor="split-parts">{t('videoSplitter.splitParts')}</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="split-parts"
                  min={1}
                  max={20}
                  step={1}
                  value={[splitParts]}
                  onValueChange={(value) => setSplitParts(value[0])}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={splitParts}
                  onChange={(e) => setSplitParts(parseInt(e.target.value) || 1)}
                  min={1}
                  max={20}
                  className="w-20"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="advanced-settings"
                checked={showAdvancedSettings}
                onCheckedChange={setShowAdvancedSettings}
              />
              <Label htmlFor="advanced-settings">{t('videoSplitter.advancedSettings')}</Label>
            </div>
          </div>

          {showAdvancedSettings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="output-format">{t('videoSplitter.outputFormat')}</Label>
                <select
                  id="output-format"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                  <option value="avi">AVI</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">{t('videoSplitter.quality')}</Label>
                <select
                  id="quality"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                >
                  <option value="high">{t('videoSplitter.high')}</option>
                  <option value="medium">{t('videoSplitter.medium')}</option>
                  <option value="low">{t('videoSplitter.low')}</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SplitSettings;