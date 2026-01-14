import {
	createContext,
	type FormEvent,
	type ForwardedRef,
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from "react"
import { type ZodObject, z } from "zod"
import type { FieldNormalProps } from "@/components/form/Field"
import {
	InputNumber,
	type InputNumberProps,
} from "@/components/form/InputNumber"
import { InputText, type InputTextProps } from "@/components/form/InputText"

export type FieldProxyProps =
	| {
			component:
				| "inputEnum"
				| "inputBool"
				| "inputList"
				| "inputForm"
				| "inputFile"
			props: Omit<FieldNormalProps<any>, "value" | "onChange">
	  }
	| {
			component: "inputText"
			props: Omit<InputTextProps, "value" | "onChange">
	  }
	| {
			component: "inputNumber"
			props: Omit<InputNumberProps, "value" | "onChange">
	  }

export const FormContext = createContext<{
	errors: {
		[K: string]: string[] | undefined
		[K: number]: string[] | undefined
	}
} | null>(null)

export type FormProps<T> = {
	id?: string
	value?: T
	fields?: FieldProxyProps[]
	onChange?: (model: T) => void
	onSubmit?: (model: T) => void
}

export type FormRef = {
	submit: () => void
}

export const Form = forwardRef(function Form<T extends Record<string, any>>(
	rawProps: FormProps<T>,
	ref: ForwardedRef<FormRef>,
) {
	useImperativeHandle(ref, () => ({
		submit: () => onSubmit(),
	}))

	const props = {
		fields: [],
		...rawProps,
	}

	// ======================
	// 匹配 value 和 fields
	// ======================

	const vEntries = props.fields.map(field => [
		field.props.name,
		props.value?.[field.props.name] ?? "",
	])
	const fieldsValue = Object.fromEntries(vEntries)

	// ======================
	// 完善 validator 规则
	// ======================

	let validator: ZodObject<any, any>
	if (props.fields) {
		const vEntries = props.fields.map(field => [
			field.props.name,
			(field.props.rule ?? field.props.required)
				? z.any().refine(value => value !== undefined && value !== "", {
						message: "此项为必填项",
					})
				: z.any(),
		])
		const vObj = Object.fromEntries(vEntries)
		validator = z.object(vObj)
	} else {
		validator = z.object({})
	}

	// ======================
	// 状态
	// ======================

	const formRef = useRef<HTMLFormElement>(null)
	const [model, setModel] = useState<T>(fieldsValue)
	const [errors, setErrors] = useState<{
		[K: string]: string[] | undefined
		[K: number]: string[] | undefined
	}>({})

	// ======================
	// 方法
	// ======================

	const getValues = () => {
		if (!formRef.current) return {} as T
		const data = new FormData(formRef.current)
		return Object.fromEntries(data.entries()) as T
	}

	const onChange = (name: string, value: any) => {
		const model = getValues() as any
		model[name] = value
		setModel(model)
		props.onChange?.(model as T)
	}

	const onSubmit = (event?: FormEvent<HTMLFormElement>) => {
		event?.preventDefault()
		const model = getValues()

		// 验证数据
		const result = validator.safeParse(model)
		if (!result.success) {
			setErrors(result.error.flatten().fieldErrors)
			return
		}

		// 提交数据
		props.onSubmit?.(result.data as T)
	}

	// ======================
	// 渲染
	// ======================

	return (
		<form id={props.id} ref={formRef} onSubmit={onSubmit}>
			<FormContext.Provider value={{ errors }}>
				{props.fields?.map((field, index) => {
					switch (field.component) {
						case "inputText":
							return (
								<InputText
									key={index}
									{...field.props}
									value={model[field.props.name]}
									onChange={value => {
										onChange(field.props.name, value)
									}}
								/>
							)
						case "inputNumber":
							return (
								<InputNumber
									key={index}
									{...field.props}
									value={model[field.props.name]}
									onChange={value => {
										onChange(field.props.name, value)
									}}
								/>
							)
						case "inputEnum":
						case "inputBool":
						case "inputList":
						case "inputForm":
						case "inputFile":
							return "未实现"
					}
				})}
			</FormContext.Provider>
		</form>
	)
})
