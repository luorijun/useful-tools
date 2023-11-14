'use client'
import {ReactNode} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

export function NavLink(props: {
  href: string
  children: ReactNode
}) {

  const pathname = usePathname()
  const isActive = pathname === props.href

  return (
    <Link
      href={props.href}
      className={`
        px-4 py-2 hover:bg-indigo-100 rounded-lg
        transition-colors
        ${isActive ? 'bg-indigo-200 hover:bg-indigo-200' : ''}
      `}
    >
      {props.children}
    </Link>
  )
}
