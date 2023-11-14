'use client'
import {ReactNode} from 'react'

export function Button(props: {
  text?: string
  onClick?: () => void
  flex?: boolean
  width?: number
  wait?: boolean
  icon?: boolean
  className?: string
  children?: ReactNode
}) {

  const cssStyle = {
    width: props.width ? `${props.width}px` : undefined
  }

  return (
    <button
      onClick={() => !props.wait && props.onClick?.()}
      style={cssStyle}
      className={`
        rounded-lg p-2 bg-indigo-100 hover:bg-indigo-200 transition
        ${props.wait ? 'cursor-wait opacity-50' : ''}
        ${props.flex ? 'flex-auto' : 'flex-none'}
        ${props.icon ? 'w-10' : ''}
        ${props.className || ''}
      `}
    >
      {props.text || props.children}
    </button>
  )
}
