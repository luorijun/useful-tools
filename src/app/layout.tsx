import {ReactNode} from 'react'
import type {Metadata} from 'next'
import './globals.css'
import {NavBar, NavGroup} from '@/app/_client/NavBar'
import {NavItem} from '@/app/_client/NavItem'
import {NavTitle} from '@/app/_client/NavTitle'

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

            <NavTitle>格式转换</NavTitle>
            <NavItem link={`/character2image`}>📷 字符转图像</NavItem>
            <NavItem link={`/time`}>⏰ 时间格式转换</NavItem>
            <NavItem link={`/codec`}>🔐 编码转换（施工中）</NavItem>

            <NavTitle>文本计算</NavTitle>
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
