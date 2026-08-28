export interface ProjectImageAsset {
  path: string;
  alt: string;
  caption?: string;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  title: string;
  description: string;
  longDescription: string;
  appUrl: string;
  icon: string;
  category: string;
  popular: boolean;
  features: string[];
  benefits: string[];
  useCases: string[];
  socialImage?: string;
  screenshots?: ProjectImageAsset[];
  coverImage?: string;
  updatedAt: string;
}