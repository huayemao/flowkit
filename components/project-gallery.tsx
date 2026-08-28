"use client";

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Locale } from '@/lib/types';
import { ProjectImageAsset } from '@/lib/types/projects';
import { getResolvedProjectImages } from '@/lib/projects/images';

interface ProjectGalleryProps {
  screenshots: ProjectImageAsset[];
  locale: Locale;
}

export function ProjectGallery({ screenshots, locale }: ProjectGalleryProps) {
  const { t } = useTranslation('common');
  const images = getResolvedProjectImages(screenshots, locale);

  if (!images || images.screenshots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('project.landing.no_screenshots')}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-center">{t('project.landing.screenshots')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.screenshots?.map?.((screenshot, index) => {
          if (!screenshot.resolvedPath) return null;
          return (
            <figure key={index} className="relative group">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-muted">
                <Image
                  src={screenshot.resolvedPath}
                  alt={screenshot.alt}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {screenshot.caption && (
                <figcaption className="mt-2 text-sm text-muted-foreground text-center">
                  {screenshot.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </div>
  );
}