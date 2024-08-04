import {ReactNode, useContext} from 'react'
import {ZodType} from 'zod'
import {FormContext} from '@/components/form/Form'

export type FieldProps<T, P extends FieldNormalProps<T>> = {
  for: string
  children?: ReactNode
  props: P
}

export function Field<T, P extends FieldNormalProps<T>>(props: FieldProps<T, P>) {
  const inputProps = props.props
  const context = useContext(FormContext)

  return (
    <div className={`w-full flex flex-col gap-1`}>
      <label htmlFor={props.for}>
        <span>{inputProps.label}</span>
        {inputProps?.required && <span className={`text-red-500 ml-1`}>*</span>}
      </label>
      {props.children}
      <div>
        {context && context.errors[inputProps.name]?.map((error, index) => (
          <p key={index} className={`text-red-500 text-sm`}>
            {error}
          </p>
        ))}
      </div>
    </div>
  )
}

export type FieldNormalProps<T> = {
  layout?: 'left' | 'top'
  label?: string
  name: string
  value?: T
  hint?: string
  required?: boolean
  rule?: ZodType
  onChange?: (value: T | undefined) => void
}
