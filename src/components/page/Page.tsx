"use client"
import { type ReactNode, useEffect } from "react"
import { cn } from "@/lib/styles"

export type PageProps = {
	title: ReactNode
	children?: ReactNode
	classNames?: {
		header?: string
		main?: string
	}
}

export function Page(props: PageProps) {
	useEffect(() => {
		document.title = `${props.title} - Useful Tools!`
	}, [props.title])

	return (
		<div className="flex-auto flex flex-col">
			<header
				className={cn(
					`flex-none basis-16 bg-background border-b flex px-6 items-center`,
					props.classNames?.header,
				)}
			>
				<h2 className="text-xl">{props.title}</h2>
			</header>
			<main className={cn(`flex-auto px-6`, props.classNames?.main)}>
				{props.children}
			</main>
		</div>
	)
}
