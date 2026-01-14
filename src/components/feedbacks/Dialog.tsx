"use client"
import { type MouseEvent, type ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/Button"
import { useStatus, wrapStatus } from "@/lib/hooks"

export type DialogProps = {
	show: boolean
	title: string | ReactNode
	width?: number
	height?: number
	onClose?: () => void
	children?: ReactNode
	close?: boolean
}

export function Dialog(props: DialogProps) {
	const width = props.width
	const height = props.height

	const showClass = props.show
		? "opacity-100 pointer-events-auto"
		: "opacity-0 pointer-events-none"

	const style = {
		width: width ? `${width}px` : undefined,
		height: height ? `${height}px` : undefined,
	}

	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
	}, [])

	const onClose = (e?: MouseEvent<HTMLElement>) => {
		if (e && e.target !== e.currentTarget) return
		props.onClose?.()
	}

	return !mounted
		? null
		: createPortal(
				<div
					onClick={onClose}
					className={`
            ${showClass}
            absolute inset-0 bg-black z-40 bg-opacity-50
            flex justify-center items-center
            transition-opacity
          `}
				>
					<section
						className="bg-white rounded-2xl shadow-2xl flex-none flex flex-col"
						style={style}
					>
						<header className="relative flex-none flex px-4 pt-4 items-center h-14">
							<h3 className="text-xl">{props.title}</h3>
							{props.close && (
								<div className="absolute top-4 right-4">
									<Button icon type="danger" onClick={onClose}>
										❌
									</Button>
								</div>
							)}
						</header>
						<div className="p-4">{props.children}</div>
					</section>
				</div>,
				document.body,
			)
}

Dialog.Footer = DialogFooter
Dialog.ConfirmFooter = DialogConfirmFooter

function DialogFooter(props: { children: ReactNode }) {
	return (
		<footer className="flex-none flex pt-4 gap-4 justify-end">
			{props.children}
		</footer>
	)
}

function DialogConfirmFooter(props: {
	onClose?: () => void
	onConfirm?: () => Promise<void> | void
}) {
	const [status, setStatus] = useStatus()
	const onConfirm = async () => {
		if (!props.onConfirm) return
		await wrapStatus(props.onConfirm, setStatus)
	}

	return (
		<DialogFooter>
			<Button onClick={() => props.onClose?.()}>取消</Button>
			<Button type="danger" onClick={onConfirm} wait={status === "load"}>
				确定
			</Button>
		</DialogFooter>
	)
}
