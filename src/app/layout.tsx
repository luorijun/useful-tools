import "./globals.css"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import Navbar from "./navbar"

export const metadata: Metadata = {
	title: "Useful Tools!",
	description: "啊，反正是个非常有用的工具集网站 🍻",
}

export default function RootLayout(props: { children: ReactNode }) {
	return (
		<html lang="zh-Hans">
			<body>
				<div className="w-screen h-screen flex">
					<Navbar classname="flex-none basis-64 border-r" />
					{props.children}
				</div>
			</body>
		</html>
	)
}
