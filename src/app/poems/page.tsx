import React from 'react';
import { Poem } from '@/types';
import PoemCard from '@/components/PoemCard';
import { fetchPoemsFromNotion } from '@/lib/notion';

// 使用增量静态生成，10分钟重新验证一次
export const revalidate = 600; // 10分钟，单位为秒

async function getPoems(): Promise<Poem[]> {
  // 获取诗歌列表，在构建时执行
  return await fetchPoemsFromNotion();
}

export default async function PoemsPage() {
  const poems = await getPoems();
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-hwmingchao text-morandi-900 dark:text-morandi-100 mb-8 text-center">诗集</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {poems.map(poem => (
          <PoemCard key={poem.id} poem={poem} />
        ))}
      </div>
      
      {poems.length === 0 && (
        <div className="text-center py-12 text-morandi-600 dark:text-morandi-400">
          暂无诗词内容
        </div>
      )}
    </div>
  );
}