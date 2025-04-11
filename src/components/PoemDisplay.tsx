import React from 'react';
import Link from 'next/link';
import { Poem } from '@/types'

interface PoemDisplayProps {
  poem: Poem
}

export default function PoemDisplay({ poem }: PoemDisplayProps) {
  // 获取诗歌内容，不排除空行
  const contentLines = [...poem.content];
  // 判断是否有日期行（最后一行）
  const hasDateLine = contentLines.length > 0;
  // 获取正文内容（不包括最后一行日期）
  const poemContent = hasDateLine ? contentLines.slice(0, -1) : [];
  // 获取日期行（最后一行）
  const dateLine = hasDateLine ? contentLines[contentLines.length - 1] : '';

  return (
    <div className="poem-container">
      <h1 className="poem-title">{poem.title}</h1>
      <p className="poem-author">{poem.date} · {poem.category}</p>
      
      <div className="poem-content">
        {poemContent.map((line, index) => (
          <div 
            key={index} 
            className={`poem-line text-left ${line.trim() === '' ? 'h-8' : ''}`}
          >
            {line.trim() === '' ? <br /> : <span>{line}</span>}
          </div>
        ))}
        
        {/* 日期行（最后一行）使用灰色文字 */}
        {dateLine && (
          <div className="poem-date text-right text-sage-500 dark:text-sage-400 mt-8 text-sm">
            <span>{dateLine}</span>
          </div>
        )}
      </div>
    </div>
  )
}