"use client"
import { useMemo, useState } from "react"
import { Button } from "@/components/Button"
import { InputText } from "@/components/form/InputText"
import { Page } from "@/components/page/Page"

export type TextCollectProps = {}

export default function TextCollect(props: TextCollectProps) {
	const [textA, setTextA] = useState("")
	const listA = useMemo(() => {
		return textA
			.split("\n")
			.map(v => v.trim())
			.filter(v => v)
	}, [textA])

	const [textB, setTextB] = useState("")
	const listB = useMemo(() => {
		return textB
			.split("\n")
			.map(v => v.trim())
			.filter(v => v)
	}, [textB])

	const [union, setUnion] = useState("")
	const [unionCount, setUnionCount] = useState(0)

	const [intersection, setIntersection] = useState("")
	const [intersectionCount, setIntersectionCount] = useState(0)

	const [difference, setDifference] = useState("")
	const [differenceCount, setDifferenceCount] = useState(0)

	const calculate = () => {
		const setA = new Set<string>(listA)
		const setB = new Set<string>(listB)
		const union = new Set<string>([...listA, ...listB])

		const intersection = new Set<string>()
		const difference = new Set<string>()

		for (const item of union) {
			if (setA.has(item) && setB.has(item)) {
				intersection.add(item)
			} else {
				difference.add(item)
			}
		}

		setUnion([...union].join("\n"))
		setUnionCount(union.size)

		setIntersection([...intersection].join("\n"))
		setIntersectionCount(intersection.size)

		setDifference([...difference].join("\n"))
		setDifferenceCount(difference.size)
	}

	return (
		<Page title="集合运算">
			<div className="flex flex-col py-8 gap-8">
				{/* 输入 */}
				<div className="flex gap-4">
					<InputText
						name="textA"
						label={`文本一（${listA.length} 行）`}
						multiline={10}
						value={textA}
						onChange={v => setTextA(v || "")}
					/>
					<InputText
						name="textB"
						label={`文本二（${listB.length} 行）`}
						multiline={10}
						value={textB}
						onChange={v => setTextB(v || "")}
					/>
				</div>

				{/* 操作 */}
				<div className="flex flex-col">
					<Button type="primary" onClick={calculate}>
						计算
					</Button>
				</div>

				{/* 结果 */}
				<div className="flex gap-4">
					<InputText
						name="union"
						label={`并集（${unionCount} 行）`}
						multiline={10}
						value={union}
						readonly
					/>
					<InputText
						name="intersection"
						label={`交集（${intersectionCount} 行）`}
						multiline={10}
						value={intersection}
						readonly
					/>
					<InputText
						name="difference"
						label={`差集（${differenceCount} 行）`}
						multiline={10}
						value={difference}
						readonly
					/>
				</div>
			</div>
		</Page>
	)
}
