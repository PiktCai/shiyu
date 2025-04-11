import React from 'react';
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-sage-100 dark:bg-sage-900 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sage-600 dark:text-sage-300">
          <p>© {currentYear} Pikt Cai. All rights reserved.</p>
          <p className="mt-1 text-sm">
            
          </p>
        </div>
      </div>
    </footer>
  )
}