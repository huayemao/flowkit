export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: number
  coverImage?: string
  tags: string[]
  locale?: string
  projectSlug?: string
}

export interface BlogPostData extends BlogPost {
  content: React.ReactNode
}

export interface BlogTag {
  name: string
  count: number
}