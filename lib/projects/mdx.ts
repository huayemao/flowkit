import { Locale } from '@/lib/types';
import React, { cache } from 'react';
import type { ProjectMetadata } from '@/lib/types/projects';

export type { ProjectMetadata };

export interface ProjectContent {
  metadata: ProjectMetadata;
  content: React.ComponentType<any>;
}

/**
 * Fetches project information and content from MDX files.
 * @param slug The project identifier/slug
 * @param locale The current language locale
 */
export const getProjectContent = cache(async (slug: string, locale: Locale): Promise<ProjectContent | null> => {
  try {
    const mdx = await import(`@/content/projects/${slug}/${locale}.mdx`);
    return {
      metadata: mdx.metadata as ProjectMetadata,
      content: mdx.default,
    };
  } catch (error) {
    if (locale !== 'en') {
      try {
        const mdx = await import(`@/content/projects/${slug}/en.mdx`);
        return {
          metadata: mdx.metadata as ProjectMetadata,
          content: mdx.default,
        };
      } catch (e) {
      }
    }

    return null;
  }
});

/**
 * Gets all project slugs that have MDX content, sorted by updatedAt descending.
 */
export const getAllProjectSlugs = cache(async (): Promise<string[]> => {
  const fs = await import('fs').catch(() => null);
  const path = await import('path').catch(() => null);
  
  if (!fs || !path) {
    return [
      'haveabreak',
      'logo-maker',
      'video-splitter',
      'image-compare',
      'itrim',
      'altitude-query',
      'immersiview',
      'birthday-cake',
    ];
  }

  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  
  try {
    if (!fs.existsSync(projectsDir)) {
      return [];
    }

    const entries = fs.readdirSync(projectsDir, { withFileTypes: true });
    const projectDirs = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    const projectsWithDates = await Promise.all(
      projectDirs.map(async (slug) => {
        try {
          const { metadata } = await import(`@/content/projects/${slug}/en.mdx`);
          return {
            slug,
            updatedAt: metadata.updatedAt || '1970-01-01',
          };
        } catch {
          return {
            slug,
            updatedAt: '1970-01-01',
          };
        }
      })
    );

    return projectsWithDates
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map(p => p.slug);
  } catch (error) {
    console.error('Error reading projects directory:', error);
    return [];
  }
});

/**
 * Gets metadata for all projects, sorted by updatedAt descending.
 */
export const getAllProjectsMetadata = cache(async (locale: Locale): Promise<ProjectMetadata[]> => {
  const slugs = await getAllProjectSlugs();
  const projectsMetadata = await Promise.all(
    slugs.map(async (slug) => {
      const content = await getProjectContent(slug, locale);
      return content ? content.metadata : null;
    })
  );

  return projectsMetadata
    .filter((t): t is ProjectMetadata => t !== null)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
});