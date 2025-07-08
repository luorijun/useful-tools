'use client'
import {ReactNode, useEffect, useRef, useState} from 'react'
import {Button} from '@/components/Button'
import {createPortal} from 'react-dom'

export type NoticeProps = {
  open?: boolean
  duration?: number
  type?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  size?: 'normal' | 'small' | 'mini'
  position?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'
  closeable?: boolean
  onClose?: () => void
  children: ReactNode
}

export function Message(rawProps: NoticeProps) {
  const props = {
    open: false,
    duration: 3000,
    type: 'primary',
    size: 'normal',
    position: 'top-right',
    closeable: true,
    ...rawProps,
  }

  let timeout = useRef<NodeJS.Timeout>(undefined)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // 添加 open 的监听
  useEffect(() => {
    if (props.open && props.duration && props.duration > 0) {
      timeout.current = setTimeout(() => {
        props.onClose?.()
      }, props.duration)
    }
  }, [props.open])

  const colorClass = {
    primary: 'bg-indigo-50 border-indigo-100',
    info: 'bg-gray-50 border-gray-100',
    success: 'bg-green-50 border-green-100',
    warning: 'bg-yellow-50 border-yellow-100',
    error: 'bg-red-50 border-red-100',
  }[props.type ?? 'primary']

  return !mounted ? null : createPortal(
    <div className={`fixed top-0 left-0 right-0 flex justify-center z-50`}>
      <section
        className={`
        ${props.open ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity
        ${colorClass}
        absolute top-4 justify-center items-center p-4 pr-14
        rounded-2xl shadow-2xl border
      `}
      >
        {props.children}

        <div className={`absolute top-2 right-2`}>
          <Button icon type={`danger`} onClick={() => props.onClose?.()}>❌</Button>
        </div>
      </section>
    </div>,
    document.body,
  )
}
