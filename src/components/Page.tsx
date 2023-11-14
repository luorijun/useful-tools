import {ReactNode} from 'react'

export function Page(props: {
  title: string | ReactNode
  children: ReactNode
}) {

  const title = typeof props.title === 'string' ? (
    <h2 className={`text-2xl font-bold`}>{props.title}</h2>
  ) : props.title

  return (
    <div className={`flex-auto flex flex-col border-l`}>
      <header className={`flex-none basis-20 border-b bg-white flex px-4 items-center`}>
        {title}
      </header>
      <main className={`flex-auto bg-white flex flex-col p-4 gap-4`}>
        {props.children}
      </main>
    </div>
  )
}
