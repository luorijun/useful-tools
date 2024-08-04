import {ReactNode} from 'react'
import Link from 'next/link'

export function NavBar(props: {
  children?: ReactNode
}) {
  return (
    <nav className={`flex-none basis-64 flex flex-col p-4 justify-between`}>
      {props.children}
    </nav>
  )
}

export function NavGroup(props: {
  children?: ReactNode
}){
  return (
    <div className={`flex flex-col gap-2`}>
      {props.children}
    </div>
  )
}





