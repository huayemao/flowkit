import React, { useState, useRef } from 'react';
import { ThemeToggle, LanguageSwitcher, ImageDiffViewer, ImageBatchUploader, Input, AppLayout } from '@flowkit/shared-ui';
import { useTranslation } from './i18n';
import "@flowkit/shared-ui/dist/index.css";
import ImageDiff from './components/ImageDiff';

function App() {
  const { t } = useTranslation();

  return (
    <AppLayout
      toolName={t('imageDiff.title')}
      toolDescription={t('imageDiff.description')}
      title={t('imageDiff.title')}
      subtitle={t('imageDiff.description')}
      keywords={t('imageDiff.keywords')}
      ogTitle={t('imageDiff.title')}
      ogDescription={t('imageDiff.description')}
      twitterTitle={t('imageDiff.title')}
      twitterDescription={t('imageDiff.description')}
      showTitle={true}
      titleCentered={true}
    >
      <ImageDiff />
    </AppLayout>
  );
}

export default App;