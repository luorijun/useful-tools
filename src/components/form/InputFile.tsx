"use client"
import { useState } from "react"

export function InputFile(props: {
	placeholder?: string
	onChange?: (files: FileList | null) => Promise<void>
}) {
	const [status, setStatus] = useState<
		"idle" | "uploading" | "success" | "error"
	>("idle")
	const [files, setFiles] = useState<FileList | null>(null)

	const onClick = () => {
		const input = document.createElement("input")
		input.type = "file"
		input.accept = "text/plain"
		input.onchange = async event => {
			const target = event.target as HTMLInputElement
			const files = target.files
			setFiles(files)
			setStatus("uploading")
			try {
				await props.onChange?.(files)
				setStatus("success")
			} catch (error) {
				setStatus("error")
			}
		}
		input.click()
	}

	const onDrag = () => {
		console.log("onDrag")
	}

	return (
		<div className="flex-none self-start flex flex-col gap-1">
			<button
				onClick={onClick}
				onDrag={onDrag}
				className={`
          text-sm text-gray-500
          h-10 p-2 bg-gray-100 rounded-lg
          hover:bg-gray-200 transition-colors
        `}
			>
				{status === "idle" && (props.placeholder || "点击或拖拽到此处上传文件")}
				{status === "uploading" && "上传中..."}
				{status === "success" && `上传成功 ${files?.length || 0} 个文件`}
				{status === "error" && "上传失败"}
			</button>
		</div>
	)
}
