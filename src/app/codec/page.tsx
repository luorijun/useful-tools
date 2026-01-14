"use client"
import { useState } from "react"
import { Button } from "@/components/Button"
import { InputText } from "@/components/form/InputText"
import { Select } from "@/components/form/Select"
import { Page } from "@/components/page/Page"
import { Section } from "@/components/Section"

export type CodecPageProps = {}

// 编码类型定义
type CodecType = "base64" | "base32" | "base58" | "base62" | "url" | "html"

// 编码器接口
interface Encoder {
	encode(input: string): string
	decode(input: string): string
	validate(input: string): boolean
	name: string
	description: string
}

// Base64 编码器
class Base64Encoder implements Encoder {
	name = "Base64"
	description = "Base64 编码/解码"

	encode(input: string): string {
		try {
			return btoa(unescape(encodeURIComponent(input)))
		} catch (e) {
			throw new Error("Base64 编码失败")
		}
	}

	decode(input: string): string {
		try {
			return decodeURIComponent(escape(atob(input)))
		} catch (e) {
			throw new Error("Base64 解码失败，请检查输入是否为有效的 Base64 编码")
		}
	}

	validate(input: string): boolean {
		try {
			return btoa(atob(input)) === input
		} catch (e) {
			return false
		}
	}
}

// Base32 编码器（预留实现）
class Base32Encoder implements Encoder {
	name = "Base32"
	description = "Base32 编码/解码（暂未实现）"

	encode(input: string): string {
		throw new Error("Base32 编码功能暂未实现")
	}

	decode(input: string): string {
		throw new Error("Base32 解码功能暂未实现")
	}

	validate(input: string): boolean {
		return /^[A-Z2-7]+=*$/.test(input)
	}
}

// Base58 编码器（预留实现）
class Base58Encoder implements Encoder {
	name = "Base58"
	description = "Base58 编码/解码（暂未实现）"

	encode(input: string): string {
		throw new Error("Base58 编码功能暂未实现")
	}

	decode(input: string): string {
		throw new Error("Base58 解码功能暂未实现")
	}

	validate(input: string): boolean {
		return /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(
			input,
		)
	}
}

// Base62 编码器（预留实现）
class Base62Encoder implements Encoder {
	name = "Base62"
	description = "Base62 编码/解码（暂未实现）"

	encode(input: string): string {
		throw new Error("Base62 编码功能暂未实现")
	}

	decode(input: string): string {
		throw new Error("Base62 解码功能暂未实现")
	}

	validate(input: string): boolean {
		return /^[0-9A-Za-z]+$/.test(input)
	}
}

// URL 编码器
class UrlEncoder implements Encoder {
	name = "URL"
	description = "URL 编码/解码"

	encode(input: string): string {
		try {
			return encodeURIComponent(input)
		} catch (_) {
			throw new Error("URL 编码失败")
		}
	}

	decode(input: string): string {
		try {
			return decodeURIComponent(input)
		} catch (_) {
			throw new Error("URL 解码失败，请检查输入是否为有效的 URL 编码")
		}
	}

	validate(input: string): boolean {
		try {
			return encodeURIComponent(decodeURIComponent(input)) === input
		} catch (_) {
			return false
		}
	}
}

// HTML 编码器
class HtmlEncoder implements Encoder {
	name = "HTML"
	description = "HTML 实体编码/解码"

	private htmlEntities: { [key: string]: string } = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
		"/": "&#x2F;",
	}

	encode(input: string): string {
		return input.replace(/[&<>"'/]/g, char => this.htmlEntities[char])
	}

	decode(input: string): string {
		const reverseEntities: { [key: string]: string } = {}
		Object.entries(this.htmlEntities).forEach(([key, value]) => {
			reverseEntities[value] = key
		})

		return input.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g, entity => {
			return reverseEntities[entity] || entity
		})
	}

	validate(input: string): boolean {
		return /^[^<>&"']*$/.test(this.decode(input))
	}
}

// 编码器工厂
class EncoderFactory {
	private static encoders: { [key in CodecType]: Encoder } = {
		base64: new Base64Encoder(),
		base32: new Base32Encoder(),
		base58: new Base58Encoder(),
		base62: new Base62Encoder(),
		url: new UrlEncoder(),
		html: new HtmlEncoder(),
	}

	static getEncoder(type: CodecType): Encoder {
		return EncoderFactory.encoders[type]
	}

	static getAllEncoders(): { type: CodecType; encoder: Encoder }[] {
		return Object.entries(EncoderFactory.encoders).map(([type, encoder]) => ({
			type: type as CodecType,
			encoder,
		}))
	}
}

export default function CodecPage(props: CodecPageProps) {
	const [inputText, setInputText] = useState("")
	const [outputText, setOutputText] = useState("")
	const [codecType, setCodecType] = useState<CodecType>("base64")
	const [operation, setOperation] = useState<"encode" | "decode">("encode")
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	// 获取可用的编码器选项
	const codecOptions = EncoderFactory.getAllEncoders()
		.filter(
			({ type }) => type === "base64" || type === "url" || type === "html",
		) // 只显示已实现的
		.map(({ type, encoder }) => ({
			label: encoder.name,
			value: type,
		}))

	// 预留的编码器选项（显示但标记为未实现）
	const comingSoonOptions = EncoderFactory.getAllEncoders()
		.filter(
			({ type }) => type === "base32" || type === "base58" || type === "base62",
		)
		.map(({ type, encoder }) => ({
			label: `${encoder.name} (即将支持)`,
			value: type,
		}))

	const allOptions = [...codecOptions, ...comingSoonOptions]

	const operationOptions = [
		{ label: "编码", value: "encode" as const },
		{ label: "解码", value: "decode" as const },
	]

	// 执行编码/解码
	const performOperation = () => {
		setError("")
		setSuccess("")

		if (!inputText.trim()) {
			setError("请输入要处理的文本")
			return
		}

		try {
			const encoder = EncoderFactory.getEncoder(codecType)
			let result: string

			if (operation === "encode") {
				result = encoder.encode(inputText)
				setSuccess("编码成功")
			} else {
				result = encoder.decode(inputText)
				setSuccess("解码成功")
			}

			setOutputText(result)
		} catch (e) {
			setError(e instanceof Error ? e.message : "操作失败")
			setOutputText("")
		}
	}

	// 交换输入输出
	const swapInputOutput = () => {
		if (outputText) {
			setInputText(outputText)
			setOutputText(inputText)
			setOperation(operation === "encode" ? "decode" : "encode")
			setError("")
			setSuccess("")
		}
	}

	// 清空所有内容
	const clearAll = () => {
		setInputText("")
		setOutputText("")
		setError("")
		setSuccess("")
	}

	// 复制到剪贴板
	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setSuccess("已复制到剪贴板")
		} catch (_) {
			setError("复制失败")
		}
	}

	// 获取当前编码器信息
	const currentEncoder = EncoderFactory.getEncoder(codecType)
	const isImplemented = ["base64", "url", "html"].includes(codecType)

	return (
		<Page title="编码转换">
			<div className="flex flex-col gap-8 py-8">
				{/* 编码器选择 */}
				<Section title="编码类型" description="选择要使用的编码格式">
					<div className="p-4 flex flex-col gap-4">
						<div className="flex gap-4">
							<div className="flex-1">
								<Select
									name="codecType"
									label="编码类型"
									options={allOptions}
									value={codecType}
									onChange={v => setCodecType(v || "base64")}
								/>
							</div>
							<div className="flex-1">
								<Select
									name="operation"
									label="操作类型"
									options={operationOptions}
									value={operation}
									onChange={v => setOperation(v || "encode")}
								/>
							</div>
						</div>

						{/* 编码器描述 */}
						<div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
							<strong>{currentEncoder.name}:</strong>{" "}
							{currentEncoder.description}
							{!isImplemented && (
								<div className="text-orange-600 mt-1">
									⚠️ 此编码类型暂未实现，敬请期待后续版本支持
								</div>
							)}
						</div>
					</div>
				</Section>

				{/* 编码转换 */}
				<Section title="编码转换" description="输入文本进行编码或解码">
					<div className="p-4 flex flex-col gap-4">
						{/* 输入文本 */}
						<InputText
							name="inputText"
							label={`输入文本${operation === "encode" ? "（原文）" : "（编码后）"}`}
							multiline={6}
							value={inputText}
							onChange={v => setInputText(v || "")}
							hint={
								operation === "encode"
									? "输入要编码的原始文本"
									: "输入要解码的编码文本"
							}
						/>

						{/* 操作按钮 */}
						<div className="flex gap-4">
							<Button
								type="primary"
								onClick={performOperation}
								wait={!isImplemented}
							>
								{operation === "encode" ? "编码" : "解码"}
							</Button>
							<Button onClick={swapInputOutput} wait={!outputText}>
								交换输入输出
							</Button>
							<Button onClick={clearAll}>清空</Button>
						</div>

						{/* 状态信息 */}
						{error && (
							<div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
								❌ {error}
							</div>
						)}

						{success && (
							<div className="text-green-500 text-sm bg-green-50 p-3 rounded-lg">
								✅ {success}
							</div>
						)}

						{/* 输出文本 */}
						<div className="relative">
							<InputText
								name="outputText"
								label={`输出文本${operation === "encode" ? "（编码后）" : "（原文）"}`}
								multiline={6}
								value={outputText}
								readonly
								hint="转换结果将显示在这里"
							/>
							{outputText && (
								<Button
									size="small"
									className="absolute top-8 right-2"
									onClick={() => copyToClipboard(outputText)}
								>
									复制
								</Button>
							)}
						</div>
					</div>
				</Section>

				{/* 使用说明 */}
				<Section title="使用说明" description="各种编码格式的说明和使用场景">
					<div className="p-4">
						<div className="text-sm space-y-4">
							<div>
								<strong>Base64:</strong>{" "}
								常用于数据传输、存储二进制数据为文本格式
								<div className="text-gray-600 ml-4">
									示例：Hello World → SGVsbG8gV29ybGQ=
								</div>
							</div>

							<div className="text-gray-500">
								<strong>Base32:</strong>{" "}
								相比Base64更易读，常用于二维码等场景（即将支持）
							</div>

							<div className="text-gray-500">
								<strong>Base58:</strong>{" "}
								比特币地址编码，避免易混淆字符（即将支持）
							</div>

							<div className="text-gray-500">
								<strong>Base62:</strong> 短链接生成，使用数字和字母（即将支持）
							</div>

							<div>
								<strong>URL:</strong> URL 编码，用于在 URL 中传输特殊字符
								<div className="text-gray-600 ml-4">
									示例：Hello World → Hello%20World
								</div>
							</div>

							<div>
								<strong>HTML:</strong> HTML 实体编码，防止 XSS 攻击
								<div className="text-gray-600 ml-4">
									示例：&lt;script&gt; → &amp;lt;script&amp;gt;
								</div>
							</div>
						</div>
					</div>
				</Section>
			</div>
		</Page>
	)
}
