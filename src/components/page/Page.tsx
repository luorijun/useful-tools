'use client'
import {ReactNode, useEffect} from 'react'
import {cn} from '@/utils/styles'

export type PageProps = {
  title: string | ReactNode
  children?: ReactNode
  classNames?: {
    header?: string
    main?: string
  }
}

export function Page(props: PageProps) {
  useEffect(() => {
    document.title = `${props.title} - Useful Tools!`
  }, [])

  const title = typeof props.title === 'string' ? (
    <h2 className={`text-2xl font-bold`}>{props.title}</h2>
  ) : props.title

  return (
    <div className={`flex-auto flex flex-col border-l border-gray-200`}>
      <header className={cn(
        `flex-none basis-16 bg-white border-b border-gray-200 flex px-4 items-center`,
        props.classNames?.header
      )}>
        {title}
      </header>
      <main className={`flex-auto bg-white flex justify-center`}>
        <div className={cn(
          `basis-[1000px]`,
          props.classNames?.main
        )}>
          {props.children}
        </div>
      </main>
    </div>
  )
}
