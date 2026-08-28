import { Locale } from '@/lib/types';
import React from 'react';

export interface AboutMetadata {
  title: string;
  description: string;
  keywords: string;
}

export interface AboutContent {
  metadata: AboutMetadata;
  content: React.ComponentType<any>;
}

export async function getAboutContent(locale: Locale): Promise<AboutContent | null> {
  try {
    const mdx = await import(`@/content/about/${locale}.mdx`);
    return {
      metadata: mdx.metadata as AboutMetadata,
      content: mdx.default,
    };
  } catch (error) {
    if (locale !== 'en') {
      try {
        const mdx = await import(`@/content/about/en.mdx`);
        return {
          metadata: mdx.metadata as AboutMetadata,
          content: mdx.default,
        };
      } catch (e) {
        // console.error(`Could not find fallback MDX for about page`);
      }
    }
    return null;
  }
}
