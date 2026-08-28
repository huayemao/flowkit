"use client";

import React, { useState, useRef } from 'react';
import { ThemeToggle, LanguageSwitcher, ImageDiffViewer, ImageBatchUploader, Input, AppLayout } from '@flowkit/shared-ui';
import { useTranslation } from './i18n';
import "@flowkit/shared-ui/dist/index.css";
import ImageDiff from './components/ImageDiff';

function App() {
  const { t } = useTranslation();

  const faqData = [
    {
      question: t('imageDiff.faq.q1'),
      answer: t('imageDiff.faq.a1')
    },
    {
      question: t('imageDiff.faq.q2'),
      answer: t('imageDiff.faq.a2')
    },
    {
      question: t('imageDiff.faq.q3'),
      answer: t('imageDiff.faq.a3')
    },
    {
      question: t('imageDiff.faq.q4'),
      answer: t('imageDiff.faq.a4')
    },
    {
      question: t('imageDiff.faq.q5'),
      answer: t('imageDiff.faq.a5')
    }
  ];

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
      faqData={faqData}
    >
      <ImageDiff />
    </AppLayout>
  );
}

export default App;