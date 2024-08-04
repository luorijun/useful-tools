import {ReactNode} from 'react'
import type {Metadata} from 'next'
import './globals.css'
import {NavBar, NavGroup} from '@/components/page/NavBar'
import {NavItem} from '@/components/page/NavItem'
import {NavTitle} from '@/components/page/NavTitle'

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

        <NavBar>
          <NavGroup>
            <NavItem link={`/`}>🏠 主页</NavItem>
            <NavItem link={`/character2image`}>📷 字符转图像</NavItem>

            <NavTitle>文本处理</NavTitle>
            <NavItem link={'/text-collect'}>📚 集合运算</NavItem>
            <NavItem link={'/text-duplicate'}>🔁 文本去重</NavItem>
            <NavItem link={'/text-diff'}>🔃 文本比较</NavItem>
            <NavItem link={'/text-join'}>🔗 文本合并</NavItem>
          </NavGroup>
        </NavBar>

        {props.children}
      </body>
    </html>
  )
}
