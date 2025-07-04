'use client'
import {ReactNode} from 'react'
import Link from 'next/link'

export function NavItem(props: {
  link: string
  children?: ReactNode
}) {

  return (
    <Link
      href={props.link}
      className={`
        flex-none h-10 rounded-xl 
        flex items-center justify-start px-4
        hover:bg-violet-100
        transition-colors
      `}>
      {props.children}
    </Link>
  )
}
