import React from 'react';
import Link from 'next/link'
import { Poem } from '@/types'

interface PoemCardProps {
  poem: Poem
}

export default function PoemCard({ poem }: PoemCardProps) {
  return (
    <Link href={`/poems/${poem.id}`}>
      <div className="bg-white dark:bg-sage-800 bg-opacity-80 rounded-lg shadow-sm p-6 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
        <h3 className="text-xl font-hwmingchao text-sage-900 dark:text-sage-100 mb-2">{poem.title}</h3>
        <p className="text-sage-600 dark:text-sage-300 mb-4">{poem.date} · {poem.category}</p>
        <div className="text-sage-800 dark:text-sage-200 line-clamp-4 leading-relaxed">
          {poem.content.slice(0, 1).map((line, index) => (
            <p key={index} className="text-center">{line}</p>
          ))}
          {poem.content.length > 1 && (
            <p className="text-center text-sage-400 dark:text-sage-500">...</p>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <span className="text-sage-500 dark:text-sage-400 text-sm">查看全文</span>
        </div>
      </div>
    </Link>
  )
}