import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
            {children}
        </div>
    );
};

export default Card;

// filepath: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        morandi: {
          100: '#f5f0ec', // 浅米色
          200: '#e0dbd5', // 浅灰褐色
          300: '#c8c2b9', // 中灰褐色
          400: '#a8a196', // 深灰褐色
          500: '#7b7269', // 灰棕色
          600: '#5c534c', // 棕灰色
          700: '#4a433e', // 深棕灰色
          800: '#352f2a', // 暗褐色
          900: '#2a251f', // 近乎黑色的褐色
        },
      },
      fontFamily: {
        hwmingchao: ['HW Ming Chao', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

// filepath: tsconfig.json
{
  "compilerOptions"; {
    // other options
    "jsx"; "react"
  }
}