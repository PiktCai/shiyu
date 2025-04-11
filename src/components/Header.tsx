'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ThemeToggle } from './ui/ThemeToggle'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-sage-100 dark:bg-sage-900 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-hwmingchao text-sage-800 dark:text-sage-100">时语集</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sage-700 dark:text-sage-200 hover:text-sage-900 dark:hover:text-sage-50 px-3 py-2 rounded-md text-base">
              首页
            </Link>
            <Link href="/poems" className="text-sage-700 dark:text-sage-200 hover:text-sage-900 dark:hover:text-sage-50 px-3 py-2 rounded-md text-base">
              诗集
            </Link>
            <ThemeToggle />
          </div>
          
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-sage-700 dark:text-sage-200"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none" 
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="block text-sage-700 dark:text-sage-200 hover:text-sage-900 dark:hover:text-sage-50 px-3 py-2 rounded-md text-base">
            首页
          </Link>
          <Link href="/poems" className="block text-sage-700 dark:text-sage-200 hover:text-sage-900 dark:hover:text-sage-50 px-3 py-2 rounded-md text-base">
            诗集
          </Link>
        </div>
      </div>
    </header>
  )
}