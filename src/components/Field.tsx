import {ReactNode} from 'react'

type FieldProps = {
  for: string
  label?: string
  hint?: string
  children?: ReactNode
}

export type FieldCoreProps<T> = {
  label?: string
  placeholder?: string
  hint?: string
  value?: T
} & ({
  required: true
  onChange?: (value: T) => void
} | {
  required?: false
  onChange?: (value: T | undefined) => void
})

export function Field(props: FieldProps) {
  return (
    <div className={`flex flex-col gap-1 w-fit`}>
      <label htmlFor={props.for}>
        {props.label}
      </label>
      {props.children}
      {props.hint && (
        <span className={`text-gray-500 text-sm`}>
          {props.hint}
        </span>
      )}
    </div>
  )
}
