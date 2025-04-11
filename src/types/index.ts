export interface Poem {
  id: string;
  title: string;
  date: string;    // 历日 - 创作日期
  category: string; // 类别 - 诗歌类型（拟古/白话/不白不古）
  content: string[];
}

export type ThemeMode = 'light' | 'dark' | 'system';