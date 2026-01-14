import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/styles"

export default function Navbar(props: { classname: string }) {
	return (
		<nav className={cn("flex flex-col justify-between", props.classname)}>
			<header className="flex-none basis-16 border-b flex items-center justify-center">
				<h1 className="text-2xl font-bold">USEFUL TOOLS</h1>
			</header>
			<div className="flex-auto overflow-auto flex flex-col p-3 gap-1">
				<NavItem link="/" icon="🏠">
					主页
				</NavItem>

				<NavTitle>时间</NavTitle>
				<NavItem link="/format-convert" icon="⏰">
					时间格式转换
				</NavItem>

				<NavTitle>格式转换</NavTitle>
				<NavItem link="/character2image" icon="📷">
					字符转图像
				</NavItem>
				<NavItem link="/codec" icon="🔐">
					编码转换（施工中）
				</NavItem>

				<NavTitle>文本计算</NavTitle>
				<NavItem link="/text-collect" icon="📚">
					集合运算
				</NavItem>
				<NavItem link="/text-join" icon="🔗">
					文本合并
				</NavItem>
				<NavItem link="/text-convert" icon="🔠">
					文本转换
				</NavItem>
			</div>
		</nav>
	)
}

export function NavTitle(props: { children: ReactNode }) {
	return <h4 className="text-foreground/60 text-sm">{props.children}</h4>
}

export function NavItem(props: {
	link: string
	icon: string
	children?: ReactNode
}) {
	return (
		<Link
			href={props.link}
			className={cn(
				"flex-none h-10 rounded-xl",
				"flex items-center justify-start px-2 gap-2",
				"hover:bg-primary/10",
				"transition-colors",
			)}
		>
			<span className="size-6 flex items-center justify-center">
				{props.icon}
			</span>
			<span>{props.children}</span>
		</Link>
	)
}
