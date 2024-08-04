import {ReactNode} from 'react'

export function TitleBar(props: {
  children?: ReactNode
}) {
  return (
    <header className={`flex-none h-6 text-sm flex items-center`}>
      {props.children}
    </header>
  )
}
