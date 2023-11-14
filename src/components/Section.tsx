import {ReactNode} from 'react'

export function Section(props: {
  title: string
  description?: string
  flex?: boolean
  gap?: boolean
  children?: ReactNode
  items?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
}) {

  const itemsClass = (() => {
    if (props.items === 'start') return 'items-start'
    if (props.items === 'center') return 'items-center'
    if (props.items === 'end') return 'items-end'
    if (props.items === 'stretch') return 'items-stretch'
    if (props.items === 'baseline') return 'items-baseline'
    return ''
  })()

  return (
    <section
      className={`
        ${props.flex ? 'flex-auto' : 'flex-none'}
        ${itemsClass} 
        border rounded-2xl bg-white flex flex-col
      `}
    >
      <header className={`flex-none flex flex-col p-4`}>
        <h3 className={`font-bold`}>{props.title}</h3>
        <p className={`text-sm text-gray-500`}>{props.description}</p>
      </header>
      <div
        className={`
          flex-auto px-4 pb-4 flex flex-col
          ${props.gap ? 'gap-4' : ''}
        `}
      >
        {props.children}
      </div>
    </section>
  )
}
