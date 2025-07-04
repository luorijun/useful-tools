import {ReactNode} from 'react'

export function NavTitle(props: {
  children: ReactNode
}) {
  return (
    <h4 className={`text-gray-500 text-sm`}>
      {props.children}
    </h4>
  )
}
