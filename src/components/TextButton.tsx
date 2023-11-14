import {ReactNode} from 'react'

export function TextButton(props: {
  onClick?: () => void
  children?: ReactNode
}) {
  return (
    <button
      onClick={props.onClick}
      className={`
        text-indigo-500 hover:underline
      `}
    >
      {props.children}
    </button>
  )
}
