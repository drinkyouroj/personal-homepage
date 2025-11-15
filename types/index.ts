export interface Section {
  id: string
  pageId: string
  type: 'social-feed' | 'about' | 'stats' | 'custom'
  order: number
  config: Record<string, any>
  style?: Record<string, any>
  visible: boolean
  createdAt: string
  updatedAt: string
}

export interface SocialMediaConfig {
  id: string
  platform: string
  enabled: boolean
  username?: string
  userId?: string
  lastSync?: string
  syncInterval: number
  config?: Record<string, any>
}

export interface SocialMediaPost {
  id: string
  platform: string
  platformId: string
  content: string
  url: string
  imageUrl?: string
  authorName?: string
  authorAvatar?: string
  publishedAt: string
  metadata?: Record<string, any>
}

