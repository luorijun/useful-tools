"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/Button"
import { InputNumber } from "@/components/form/InputNumber"
import { InputText } from "@/components/form/InputText"
import { Select } from "@/components/form/Select"
import { Page } from "@/components/page/Page"

type FontWeight = "normal" | "bold"
type FontStyle = "normal" | "italic"

export default function Character2Image() {
	const canvas = useRef<HTMLCanvasElement>(null)

	const [character, setCharacter] = useState("🤭👉😭💔")
	const [fontFamily, setFontFamily] = useState("Segoe UI Emoji")
	const [fontSize, setFontSize] = useState(96)
	const [fontWeight, setFontWeight] = useState<FontWeight>("normal")
	const [fontStyle, setFontStyle] = useState<FontStyle>("normal")

	const [imgSize, setImgSize] = useState({ width: 512, height: 512 })
	const [imgPivot, setImgPivot] = useState({ x: 0.5, y: 0.5 })

	// draw character to canvas
	useEffect(() => {
		if (!canvas.current) return

		const ctx = canvas.current.getContext("2d")
		if (!ctx) return
		canvas.current.width = imgSize.width
		canvas.current.height = imgSize.height

		// 绘制背景
		ctx.fillStyle = "#eee"
		ctx.fillRect(0, 0, imgSize.width, imgSize.height)

		// 绘制字符
		ctx.fillStyle = "white"
		ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.fillText(
			character,
			imgSize.width * imgPivot.x,
			imgSize.height * imgPivot.y,
		)
	}, [
		character,
		fontFamily,
		fontSize,
		fontWeight,
		fontStyle,
		imgSize,
		imgPivot,
	])

	// const trimImage = (input: HTMLCanvasElement, border: number = 10) => {
	//   const iContext = input.getContext('2d')
	//   if (!iContext) throw new Error('Cannot get context of input canvas')
	//   const imageData = iContext.getImageData(0, 0, input.width, input.height)
	//   const width = imageData.width
	//   const height = imageData.height
	//
	//   let minX = width, minY = height, maxX = 0, maxY = 0
	//   for (let x = 0; x < width; x++) {
	//     for (let y = 0; y < height; y++) {
	//       const i = (y * width + x) * 4
	//       const a = imageData.data[i + 3]
	//       if (a !== 0) {
	//         minX = Math.min(minX, x)
	//         minY = Math.min(minY, y)
	//         maxX = Math.max(maxX, x)
	//         maxY = Math.max(maxY, y)
	//       }
	//     }
	//   }
	//
	//   minX = Math.max(0, minX - border)
	//   minY = Math.max(0, minY - border)
	//   maxX = Math.min(width - 1, maxX + border)
	//   maxY = Math.min(height - 1, maxY + border)
	//
	//   const output = document.createElement('canvas')
	//   output.width = maxX - minX + 1
	//   output.height = maxY - minY + 1
	//   const oContext = output.getContext('2d')
	//   if (!oContext) throw new Error('Cannot get context of output canvas')
	//   oContext.putImageData(imageData, -minX, -minY)
	//
	//   return output
	// }

	const exportImage = () => {
		if (!canvas.current) return

		const dataURL = canvas.current.toDataURL("image/png")
		const link = document.createElement("a")
		link.download = `${character}.png`
		link.href = dataURL
		link.click()
		link.remove()
	}

	// render
	return (
		<Page title="字符转图像">
			<div className="flex-auto flex">
				<div className="flex-none basis-72 flex flex-col p-4 gap-4 border-r">
					<h3 className="text-xl">配置</h3>

					<div className="flex flex-col gap-2">
						<h4 className="text-sm text-gray-500">字体设置</h4>
						<InputText
							readonly
							name="fontFamily"
							label="字体"
							hint="输入字体"
							value={fontFamily}
							onChange={str => setFontFamily(str ?? "")}
						/>
						<InputNumber
							name="fontSize"
							label="字体大小"
							hint="输入字体大小"
							value={fontSize}
							onChange={num => setFontSize(num ?? 16)}
						/>
						<Select
							required
							name="fontWeight"
							label="字体粗细"
							options={[
								{ label: "正常", value: "normal" },
								{ label: "粗体", value: "bold" },
							]}
							value={fontWeight}
							onChange={value => setFontWeight(value ?? "normal")}
						/>
						<Select
							required
							name="fontStyle"
							label="字体样式"
							options={[
								{ label: "正常", value: "normal" },
								{ label: "斜体", value: "italic" },
							]}
							value={fontStyle}
							onChange={value => setFontStyle(value ?? "normal")}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<h4 className="text-sm text-gray-500">图片设置</h4>
						<InputNumber
							label="宽度"
							name="imgWidth"
							hint="输入宽度"
							value={imgSize.width}
							onChange={v => setImgSize({ ...imgSize, width: v ?? 256 })}
						/>
						<InputNumber
							label="高度"
							name="imgHeight"
							hint="输入高度"
							value={imgSize.height}
							onChange={v => setImgSize({ ...imgSize, height: v ?? 256 })}
						/>
						<InputNumber
							label="水平偏移"
							name="imgPivotX"
							hint="输入水平偏移"
							value={imgPivot.x}
							onChange={v => setImgPivot({ ...imgPivot, x: v ?? 0.5 })}
						/>
						<InputNumber
							label="垂直偏移"
							name="imgPivotY"
							hint="输入垂直偏移"
							value={imgPivot.y}
							onChange={v => setImgPivot({ ...imgPivot, y: v ?? 0.5 })}
						/>
					</div>
				</div>

				<div className="flex-auto flex flex-col p-4 gap-4">
					<h3 className="text-xl">绘制</h3>

					<InputText
						label="字符"
						name="character"
						hint="输入字符"
						value={character}
						onChange={str => setCharacter(str ?? "")}
					/>

					<div className="flex justify-center">
						<canvas
							ref={canvas}
							style={{
								width: `${imgSize.width}px`,
								height: `${imgSize.height}px`,
								border: "1px solid #ccc",
							}}
						/>
					</div>

					<Button onClick={exportImage}>下载</Button>
				</div>
			</div>
		</Page>
	)
}
