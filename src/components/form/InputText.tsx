"use client"

import { useId } from "react"
import { Field, type FieldNormalProps } from "@/components/form/Field"

export type InputTextProps = {
	multiline?: boolean | number
	readonly?: boolean
} & FieldNormalProps<string>

export function InputText(props: InputTextProps) {
	const id = useId()

	let inputEl = props.multiline ? (
		<textarea
			id={id}
			rows={typeof props.multiline === "number" ? props.multiline : 3}
			placeholder={props.hint}
			name={props.name}
			value={props.value}
			onChange={e => props.onChange?.(e.target.value)}
			className={`
        ${props.readonly ? "bg-gray-100 cursor-not-allowed" : "bg-gray-100"}
        px-4 py-2 rounded-lg
        outline-0 ring-2 ring-transparent hover:ring-indigo-200 focus:ring-indigo-500
        transition-all
      `}
		/>
	) : (
		<input
			id={id}
			type="text"
			readOnly={props.readonly}
			placeholder={props.hint}
			name={props.name}
			value={props.value}
			onChange={e => props.onChange?.(e.target.value)}
			className={`
        ${props.readonly ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100"}
        px-4 py-2 rounded-lg
        outline-0 ring-2 ring-transparent hover:ring-indigo-200 focus:ring-indigo-500
        transition-all
      `}
		/>
	)

	if (props.label) {
		inputEl = (
			<Field<string, InputTextProps> for={id} props={props}>
				{inputEl}
			</Field>
		)
	}

	return inputEl
}
