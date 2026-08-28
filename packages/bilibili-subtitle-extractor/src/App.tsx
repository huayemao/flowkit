"use client";

import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  AppLayout,
  useTranslation,
} from "@flowkit/shared-ui";
import { BilibiliSubtitleExtractor } from './index';

export default function App() {
  const { t } = useTranslation();

  const faqData = [
    {
      question: t('bilibiliSubtitleExtractor.faq.q1'),
      answer: t('bilibiliSubtitleExtractor.faq.a1')
    },
    {
      question: t('bilibiliSubtitleExtractor.faq.q2'),
      answer: t('bilibiliSubtitleExtractor.faq.a2')
    },
    {
      question: t('bilibiliSubtitleExtractor.faq.q3'),
      answer: t('bilibiliSubtitleExtractor.faq.a3')
    },
    {
      question: t('bilibiliSubtitleExtractor.faq.q4'),
      answer: t('bilibiliSubtitleExtractor.faq.a4')
    },
    {
      question: t('bilibiliSubtitleExtractor.faq.q5'),
      answer: t('bilibiliSubtitleExtractor.faq.a5')
    }
  ];

  return (
    <AppLayout
      toolName={t('bilibiliSubtitleExtractor.title')}
      toolDescription={t('bilibiliSubtitleExtractor.description')}
      title={t('bilibiliSubtitleExtractor.title')}
      subtitle={t('bilibiliSubtitleExtractor.description')}
      keywords={t('bilibiliSubtitleExtractor.keywords')}
      ogTitle={t('bilibiliSubtitleExtractor.ogTitle')}
      ogDescription={t('bilibiliSubtitleExtractor.ogDescription')}
      twitterTitle={t('bilibiliSubtitleExtractor.twitterTitle')}
      twitterDescription={t('bilibiliSubtitleExtractor.twitterDescription')}
      showTitle={true}
      titleCentered={true}
      faqData={faqData}
    >
      <BilibiliSubtitleExtractor />
    </AppLayout>
  );
}