import {ReactNode} from 'react'
import type {Metadata} from 'next'
import './globals.css'
import {NavLink} from '@/app/_components/NavLink'

export const metadata: Metadata = {
  title: 'Useful Tools!',
  description: '啊，反正是个非常有用的工具集网站（至少我希望是这样）🍻',
}

export default function RootLayout(props: {
  children: ReactNode
}) {
  return (
    <html lang="zh-Hans">
      <body className={`w-screen h-screen flex`}>
        <nav className={`flex-none basis-64 flex flex-col bg-gray-50 p-4 gap-2`}>
          <NavLink href={`/`}>🏠 主页</NavLink>
          <NavLink href={`/character2image`}>📷 字符转图像</NavLink>
        </nav>

        {props.children}
      </body>
    </html>
  )
}
