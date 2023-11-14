'use client'

export function InputText(props: {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  flex?: boolean
  multiline?: boolean | number
  readonly?: boolean
}) {

  let inputEl = props.multiline ? (
    <textarea
      rows={typeof props.multiline === 'number' ? props.multiline : 3}
      placeholder={props.placeholder}
      value={props.value}
      onChange={e => props.onChange?.(e.target.value)}
      className={`
        ${props.className || ''}
        ${props.flex ? 'flex-auto' : 'flex-none'}
        ${props.readonly ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100'}
        px-4 py-2 rounded-lg
        outline-0 ring-2 ring-transparent hover:ring-indigo-200 focus:ring-indigo-500
        transition-all
      `}
    />
  ) : (
    <input
      type="text"
      readOnly={props.readonly}
      placeholder={props.placeholder}
      value={props.value}
      onChange={e => props.onChange?.(e.target.value)}
      className={`
        ${props.className || ''}
        ${props.flex ? 'flex-auto' : 'flex-none'}
        ${props.readonly ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100'}
        px-4 py-2 rounded-lg
        outline-0 ring-2 ring-transparent hover:ring-indigo-200 focus:ring-indigo-500
        transition-all
      `}
    />
  )

  if (props.label) {
    inputEl = (
      <label className={`flex flex-col gap-1`}>
        <span>{props.label}</span>
        {inputEl}
      </label>
    )
  }

  return inputEl
}
