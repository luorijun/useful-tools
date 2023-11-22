import {useId, useState, useRef, FocusEvent} from 'react'
import {Field, FieldCoreProps} from '@/components/Field'

type SelectOption<T> = {
  label: string
  value: T
}

type SelectProps<T> = FieldCoreProps<T> & {
  options?: SelectOption<T>[]
}

export function Select<T extends string>(props: SelectProps<T>) {
  const comboId = useId()
  const comboMenuId = useId()
  const comboEl = useRef<HTMLInputElement>(null)
  const comboMenuEl = useRef<HTMLUListElement>(null)

  const [isExpanded, setIsExpanded] = useState(false)
  const [selected, setSelected] = useState<string | undefined>(
    props.options?.find(option => option.value === props.value)?.label,
  )

  const openSelect = () => {
    setIsExpanded(true)
  }

  const closeSelect = (e: FocusEvent<HTMLInputElement>) => {
    if (comboMenuEl.current?.contains(e.relatedTarget as Node)) return
    setIsExpanded(false)
  }

  const changeValue = (option: SelectOption<T>) => {
    comboEl.current?.blur()
    setIsExpanded(false)
    setSelected(option.label)
    props.onChange?.(option.value)
  }

  const clearValue = () => {
    if (props.required) return
    setSelected(undefined)
    props.onChange?.(undefined)
  }

  return (
    <Field for={comboId} label={props.label} hint={props.hint}>
      <div className={`relative w-fit`}>

        <input
          readOnly
          id={comboId}
          ref={comboEl}
          role={`combobox`}
          aria-haspopup={`listbox`}
          aria-controls={comboMenuId}
          aria-expanded={isExpanded}
          aria-owns={comboMenuId}
          placeholder={props.placeholder || '请选择'}
          value={selected ?? ''}
          onFocus={openSelect}
          onBlur={closeSelect}
          className={`
            w-48 h-10 px-4 py-2 bg-gray-100 rounded-lg
            outline-0 ring-2 ring-transparent hover:ring-indigo-200 focus:ring-indigo-500
            transition-all cursor-pointer
          `}
        />

        {!props.required && (
          <button
            onClick={clearValue}
            className={`
            absolute top-1 right-1
            w-8 h-8 rounded-lg
            hover:bg-indigo-100
            transition-colors
          `}
          >
            ❌
          </button>
        )}

        <ul
          id={comboMenuId}
          ref={comboMenuEl}
          role={`listbox`}
          tabIndex={-1}
          className={`
            absolute top-full left-0 right-0 mt-2 z-50
            bg-white rounded-lg shadow-lg overflow-auto
            transition-all
            ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          {props.options?.map((option, index) => (
            <li
              key={option.value}
              id={`${comboMenuId}-${index}`}
              role={`option`}
              onClick={() => changeValue(option)}
              className={`
                px-4 py-2
                ${props.value === option.value ? 'bg-indigo-200 hover:bg-indigo-200' : 'hover:bg-indigo-50'}
              `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </Field>
  )
}
