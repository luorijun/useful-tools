"use client"
import type { ReactNode } from "react"

export type ButtonProps = {
	text?: string
	onClick?: () => void
	flex?: boolean
	width?: number
	wait?: boolean
	icon?: boolean
	className?: string
	children?: ReactNode
	highlight?: boolean
	plain?: boolean
	type?: "default" | "primary" | "danger" | "warning"
	mode?: "submit" | "reset" | "button"
	size?: "normal" | "small" | "mini"
	form?: string
}

export function Button(props: ButtonProps) {
	const cssStyle = {
		width: props.width ? `${props.width}px` : undefined,
	}

	const colorClass = {
		default: props.highlight
			? "bg-gray-300 hover:bg-gray-300"
			: "bg-gray-100 hover:bg-gray-200",
		primary: props.highlight
			? "bg-indigo-300 hover:bg-indigo-300"
			: "bg-indigo-100 hover:bg-indigo-200",
		danger: props.highlight
			? "bg-red-300 hover:bg-red-300"
			: "bg-red-100 hover:bg-red-200",
		warning: props.highlight
			? "bg-yellow-300 hover:bg-yellow-300"
			: "bg-yellow-100 hover:bg-yellow-200",
	}[props.type ?? "default"]

	const sizeClass = {
		normal: {
			icon: "w-10 h-10",
			text: "px-4 h-10",
		},
		small: {
			icon: "w-8 h-8 text-sm",
			text: "px-3 h-8 text-sm",
		},
		mini: {
			icon: "w-6 h-6 text-xs",
			text: "px-2 h-6 text-xs",
		},
	}[props.size ?? "normal"][props.icon ? "icon" : "text"]

	const layoutClass =
		"flex justify-center items-center " +
		(props.flex ? "flex-auto" : "flex-none")

	return (
		<button
			onClick={() => !props.wait && props.onClick?.()}
			form={props.form}
			type={props.mode}
			style={cssStyle}
			className={`
        rounded-lg transition
        ${props.wait ? "cursor-wait opacity-50" : ""}
        ${colorClass}
        ${sizeClass}
        ${layoutClass}
        ${props.className || ""}
      `}
		>
			{props.text || props.children}
		</button>
	)
}
