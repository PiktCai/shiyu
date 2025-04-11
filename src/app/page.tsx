import Link from 'next/link'
import { Poem } from '@/types'
import PoemCard from '@/components/PoemCard'
import { fetchPoemsFromNotion } from '@/lib/notion'

// 使用增量静态生成，10分钟重新验证一次
export const revalidate = 600; // 10分钟，单位为秒

async function getPoems(): Promise<Poem[]> {
  // 获取诗歌列表，在构建时执行
  return await fetchPoemsFromNotion();
}

export default async function Home() {
  const poems = await getPoems()
  const featuredPoems = poems.slice(0, 3)
  
  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-sage-100 dark:bg-sage-800 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-hwmingchao text-sage-900 dark:text-sage-100 mb-6">
              我的诗
            </h1>
            <p className="text-lg md:text-xl text-sage-700 dark:text-sage-300 max-w-3xl mb-10">
              《时语集》是我第一本用来专门记录诗歌的簿子，从小学的时候就开始写了。此处续用这个名字，整理自己写过的一些小诗。
            </p>
            <Link href="/poems" 
              className="inline-block bg-sage-700 text-sage-100 dark:bg-sage-600 px-6 py-3 rounded-md hover:bg-sage-800 dark:hover:bg-sage-700 transition-colors">
              浏览诗集
            </Link>
          </div>
        </div>
        
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-sage-200 dark:from-sage-700 to-transparent"></div>
        </div>
      </section>
      
      {/* Featured poems */}
      <section className="py-16 bg-sage-50 dark:bg-sage-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-hwmingchao text-sage-900 dark:text-sage-100 mb-10 text-center">近日新作</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPoems.map(poem => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/poems" 
              className="inline-block border border-sage-400 dark:border-sage-500 text-sage-700 dark:text-sage-300 px-6 py-2 rounded-md hover:bg-sage-200 dark:hover:bg-sage-700 transition-colors">
              查看更多
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}