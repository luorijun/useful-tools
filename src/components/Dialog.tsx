import { MouseEvent, ReactNode} from 'react'
import {Button} from '@/components/Button'

export function Dialog(props:{
  show: boolean
  title: string
  onClose?: () => void
  children: ReactNode
}){

  const onClose = (e?:  MouseEvent<HTMLElement>) => {
    if (e && (e.target !== e.currentTarget)) return
    props.onClose?.()
  }

  return (
    <div
      onClick={onClose}
      className={`
        absolute inset-0 bg-black z-50 bg-opacity-50
        ${props.show ? 'flex' : 'hidden'} justify-center items-center
      `}
    >
      <section className={`w-[600px] h-[400px] bg-white rounded-2xl flex-none flex flex-col`}>
        <header className={`flex-none px-4 py-3 border-b flex justify-between`}>
          <h3>{props.title}</h3>
          <Button onClick={onClose} className={`my-[-6px] mr-[-10px]`}>
            <span className={`block w-6 h-6 m-[-2px]`}>❌</span>
          </Button>
        </header>
        <div className={`flex-auto p-4 overflow-auto`}>
          {props.children}
        </div>
      </section>
    </div>
  )
}
