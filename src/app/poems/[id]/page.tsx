import { notFound } from 'next/navigation'
import { Poem } from '@/types'
import PoemDisplay from '@/components/PoemDisplay'
import Link from 'next/link'
import { fetchPoemById, fetchPoemsFromNotion } from '@/lib/notion'

interface PoemPageProps {
  params: {
    id: string
  }
}

// 使用增量静态生成，10分钟重新验证一次
export const revalidate = 600; // 10分钟，单位为秒

// 在构建时预先获取诗歌数据并生成静态页面
export async function generateStaticParams() {
  try {
    // 获取所有诗歌
    const poems = await fetchPoemsFromNotion();
    
    return poems.map(poem => ({
      id: poem.id
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// 在构建时或重新验证时获取单个诗歌数据
async function getPoem(id: string): Promise<Poem | null> {
  return await fetchPoemById(id);
}

export default async function PoemPage({ params }: PoemPageProps) {
  const poem = await getPoem(params.id)
  
  if (!poem) {
    notFound()
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <Link href="/poems" className="text-morandi-600 dark:text-morandi-300 hover:text-morandi-800 dark:hover:text-morandi-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回诗集
        </Link>
      </div>
      
      <PoemDisplay poem={poem} />
    </div>
  )
}