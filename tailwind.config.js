/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        morandi: {
          50: '#fcfbf9',
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
        sage: {
          50: '#f7f9f7',  // 极浅灰绿色
          100: '#e7ede7', // 浅灰绿色
          200: '#d2dcd2', // 浅灰绿色
          300: '#b4c5b4', // 中浅灰绿色
          400: '#97af97', // 中灰绿色
          500: '#7d967d', // 标准灰绿色
          600: '#637963', // 深灰绿色
          700: '#505f50', // 更深灰绿色
          800: '#3b463b', // 暗灰绿色
          900: '#2a312a', // 极暗灰绿色
          950: '#1a201a', // 近黑灰绿色
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