"use client"
import { format, formatRelative, parse } from "date-fns"
import { useState } from "react"
import { Button } from "@/components/Button"
import { InputText } from "@/components/form/InputText"
import { Select } from "@/components/form/Select"
import { Page } from "@/components/page/Page"

// 预置的时间格式配置
const presetFormats = {
	input: [
		{ label: "自动识别", value: "auto" },
		{ label: "ISO 8601", value: "yyyy-MM-ddTHH:mm:ss" },
		{ label: "2006-01-02 15:04:05", value: "yyyy-MM-dd HH:mm:ss" },
		{ label: "2006/01/02 15:04:05", value: "yyyy/MM/dd HH:mm:ss" },
		{ label: "2006年1月2日 15时04分05秒", value: "yyyy年M月d日 HH时mm分ss秒" },
		{ label: "Jan 2, 2006 3:04:05 PM", value: "MMMM d, yyyy HH:mm:ss" },
		{ label: "时间戳（毫秒）", value: "timestamp" },
		{ label: "时间戳（秒）", value: "timestamp_seconds" },
	],
	output: [
		{ label: "ISO 8601", value: "yyyy-MM-dd'T'HH:mm:ss'Z'" },
		{ label: "2006-01-02 15:04:05", value: "yyyy-MM-dd HH:mm:ss" },
		{ label: "2006/01/02 15:04:05", value: "yyyy/MM/dd HH:mm:ss" },
		{ label: "2006年1月2日 15时04分05秒", value: "yyyy年M月d日 HH时mm分ss秒" },
		{ label: "Jan 2, 2006 3:04:05 PM", value: "MMMM d, yyyy HH:mm:ss" },
		{ label: "时间戳（毫秒）", value: "timestamp" },
		{ label: "时间戳（秒）", value: "timestamp_seconds" },
		{ label: "相对时间", value: "relative" },
	],
}

export default function TimePage() {
	const [inputText, setInputText] = useState("")
	const [inputSelect, setInputSelect] = useState<string>("")
	const [inputFormat, setInputFormat] = useState<string>("")

	const [outputText, setOutputText] = useState("")
	const [outputSelect, setOutputSelect] = useState<string>("")
	const [outputFormat, setOutputFormat] = useState<string>("")

	const [error, setError] = useState("")

	// 执行转换
	const convert = () => {
		if (!inputFormat) {
			setError("请输入格式")
			return
		}

		const inputs = inputText.split("\n").filter(line => line.trim())
		if (inputs.length === 0) {
			return
		}

		const outputs = []

		for (const input of inputs) {
			let date = null
			switch (inputFormat) {
				case "auto":
					date = new Date(input)
					break
				case "timestamp":
					date = new Date(Number(input))
					break
				case "timestamp_seconds":
					date = new Date(Number(input) * 1000)
					break
				default:
					date = parse(input, inputFormat, new Date())
					break
			}

			if (Number.isNaN(date.getTime())) {
				setError("无效的日期格式")
				return
			}

			let output = ""
			switch (outputFormat) {
				case "timestamp":
					output = date.getTime().toString()
					break
				case "timestamp_seconds":
					output = Math.floor(date.getTime() / 1000).toString()
					break
				case "relative":
					output = formatRelative(date, new Date())
					break
				default:
					output = format(date, outputFormat)
					break
			}

			outputs.push(output)
		}

		setOutputText(outputs.join("\n"))
	}

	// 复制结果到剪贴板
	const copy = async () => {
		await navigator.clipboard.writeText(outputText)
		alert("已复制到剪贴板")
	}

	// 清空所有内容
	const clear = () => {
		setInputText("")
		setOutputText("")
		setError("")
	}

	const timeCount = inputText.split("\n").filter(line => line.trim()).length

	return (
		<Page
			title="时间格式转换"
			classNames={{
				main: "flex flex-col gap-6 p-6",
			}}
		>
			{/* 格式选择 */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* 输入格式 */}
				<div className="space-y-2">
					<Select
						name="inputFormat"
						label="输入预设"
						options={presetFormats.input}
						value={inputSelect}
						onChange={v => {
							setInputSelect(v || "auto")
							setInputFormat(v || "")
						}}
					/>
					<InputText
						name="customInputFormat"
						label="输入格式"
						hint="例如：YYYY-MM-DD HH:mm:ss"
						value={inputFormat}
						onChange={v => setInputFormat(v || "")}
					/>
				</div>

				{/* 输出格式 */}
				<div className="space-y-2">
					<Select
						name="outputFormat"
						label="输出预设"
						options={presetFormats.output}
						value={outputSelect}
						onChange={v => {
							setOutputSelect(v || "timestamp")
							setOutputFormat(v || "")
						}}
					/>
					<InputText
						name="customOutputFormat"
						label="输出格式"
						hint="YYYY-MM-DD HH:mm:ss"
						value={outputFormat}
						onChange={v => setOutputFormat(v || "")}
					/>
				</div>
			</div>

			{/* 输入 & 输出 */}
			<div className="flex gap-6">
				{/* 输入时间 */}
				<div className="flex-1">
					<InputText
						name="inputTime"
						label={`输入时间（${timeCount} 行）`}
						hint="可以批量转换时间，每行一个"
						multiline={8}
						value={inputText}
						onChange={v => setInputText(v || "")}
					/>
				</div>

				{/* 转换按钮 */}
				<div className="flex-none basis-20 flex flex-col gap-3 justify-center">
					<Button type="primary" onClick={convert}>
						转换
					</Button>
					<Button onClick={copy}>复制</Button>
					<Button onClick={clear}>清空</Button>
				</div>

				{/* 转换结果 */}
				<div className="flex-1">
					<InputText
						name="convertedTime"
						label="转换结果"
						multiline={8}
						value={outputText}
						readonly
						hint="转换结果将显示在这里"
					/>
				</div>
			</div>

			{/* 错误信息 */}
			{error && (
				<div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg whitespace-pre-line">
					❌ {error}
				</div>
			)}
		</Page>
	)
}
