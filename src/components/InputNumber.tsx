type InputNumberProps = {
  label?: string
  placeholder?: string
  value?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  items?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
}

export function InputNumber(props: InputNumberProps) {
  const value = props.value ?? 0

  const justifyClass = (() => {
    if (props.justify === 'start') return 'justify-start'
    if (props.justify === 'center') return 'justify-center'
    if (props.justify === 'end') return 'justify-end'
    if (props.justify === 'between') return 'justify-between'
    if (props.justify === 'around') return 'justify-around'
    if (props.justify === 'evenly') return 'justify-evenly'
    return ''
  })()

  const itemsClass = (() => {
    if (props.items === 'start') return 'items-start'
    if (props.items === 'center') return 'items-center'
    if (props.items === 'end') return 'items-end'
    if (props.items === 'stretch') return 'items-stretch'
    if (props.items === 'baseline') return 'items-baseline'
    return ''
  })()

  let element = (
    <div
      className={`
        relative
      `}
    >
      <input
        type="number"
        placeholder={props.placeholder}
        min={props.min}
        max={props.max}
        step={props.step}
        value={value}
        onChange={e => props.onChange?.(Number(e.target.value))}
        className={`
        w-full px-4 py-2 bg-gray-100 rounded-lg
        outline-0 ring-2 ring-transparent hover:ring-indigo-200 focus:ring-indigo-500
        transition-all
      `}
      />

      <div className={`absolute top-0 bottom-0 right-1 flex items-center`}>
        <button
          className={`w-8 h-8 rounded-lg hover:bg-indigo-100 transition-colors text-sm`}
          onClick={() => props.onChange?.(value + 1)}
        >
          ➕
        </button>
        <button
          className={`w-8 h-8 rounded-lg hover:bg-indigo-100 transition-colors text-sm`}
          onClick={() => props.onChange?.(value - 1)}
        >
          ➖
        </button>
      </div>
    </div>
  )
  if (props.label) {
    element = (
      <label
        className={`
          flex flex-col gap-1
          ${justifyClass} ${itemsClass}
        `}
      >
        <span>{props.label}</span>
        {element}
      </label>
    )
  }

  return element
}
