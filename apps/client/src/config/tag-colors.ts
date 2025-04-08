export interface TagColorScheme {
  bg: string
  text: string
  hover: string
}

export const tagColors: TagColorScheme[] = [
  // 主色调
  { bg: 'bg-primary', text: 'text-primary-foreground', hover: 'hover:bg-primary/90' },
  { bg: 'bg-secondary', text: 'text-secondary-foreground', hover: 'hover:bg-secondary/90' },
  { bg: 'bg-accent', text: 'text-accent-foreground', hover: 'hover:bg-accent/90' },
  
  // 图表色系
  { bg: 'bg-chart-1', text: 'text-primary-foreground', hover: 'hover:bg-chart-1/90' },
  { bg: 'bg-chart-2', text: 'text-primary-foreground', hover: 'hover:bg-chart-2/90' },
  { bg: 'bg-chart-3', text: 'text-primary-foreground', hover: 'hover:bg-chart-3/90' },
  { bg: 'bg-chart-4', text: 'text-primary-foreground', hover: 'hover:bg-chart-4/90' },
  { bg: 'bg-chart-5', text: 'text-primary-foreground', hover: 'hover:bg-chart-5/90' },
  
  // 强调色
  { bg: 'bg-destructive', text: 'text-destructive-foreground', hover: 'hover:bg-destructive/90' },
  { bg: 'bg-muted', text: 'text-muted-foreground', hover: 'hover:bg-muted/90' },
  
  // 侧边栏色系
  { bg: 'bg-sidebar-primary', text: 'text-sidebar-primary-foreground', hover: 'hover:bg-sidebar-primary/90' },
  { bg: 'bg-sidebar-accent', text: 'text-sidebar-accent-foreground', hover: 'hover:bg-sidebar-accent/90' }
]

// 使用字符串哈希函数来确定性地为标签分配颜色
export const getHashCode = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export const getColorIndexFromName = (name: string): number => {
  return getHashCode(name) % tagColors.length
} 