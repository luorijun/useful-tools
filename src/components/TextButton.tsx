import type { ReactNode } from "react"

export function TextButton(props: {
	onClick?: () => void
	children?: ReactNode
}) {
	return (
		<button
			type="button"
			onClick={props.onClick}
			className={`
        text-indigo-500 hover:underline
      `}
		>
			{props.children}
		</button>
	)
}
