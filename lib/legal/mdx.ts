import { Locale } from '@/lib/types';
import React from 'react';

export interface LegalMetadata {
  title: string;
  description: string;
  keywords: string;
}

export interface LegalContent {
  metadata: LegalMetadata;
  content: React.ComponentType<any>;
}

export async function getLegalContent(type: 'privacy' | 'terms', locale: Locale): Promise<LegalContent | null> {
  try {
    const mdx = await import(`@/content/${type}/${locale}.mdx`);
    return {
      metadata: mdx.metadata as LegalMetadata,
      content: mdx.default,
    };
  } catch (error) {
    if (locale !== 'en') {
      try {
        const mdx = await import(`@/content/${type}/en.mdx`);
        return {
          metadata: mdx.metadata as LegalMetadata,
          content: mdx.default,
        };
      } catch (e) {
        // console.error(`Could not find fallback MDX for ${type} page`);
      }
    }
    return null;
  }
}
