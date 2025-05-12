export interface Bookmark {
  id: number
  title: string
  url: string
  description: string
  icon: string
  category: string
  subcategory: string
  tags: string[]
  starred: boolean
  pinned: boolean
  lastVisited: string
} 