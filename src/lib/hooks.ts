// noinspection ExceptionCaughtLocallyJS

import { type Dispatch, type SetStateAction, useState } from "react"

export type Status = "idle" | "load" | "done" | "fail"

export function useStatus(init?: Status) {
	return useState<Status>(init ?? "idle")
}

export async function wrapStatus<T>(
	fn: () => Promise<T> | T,
	setStatus: Dispatch<SetStateAction<Status>>,
) {
	setStatus("load")
	try {
		const result = await fn()
		setStatus("done")
		return {
			success: true,
			data: result,
		} as const
	} catch (error) {
		setStatus("fail")
		return {
			success: false,
			error,
		} as const
	}
}

export async function wrapHttpStatus(
	fn: () => Promise<Response>,
	setStatus?: Dispatch<SetStateAction<Status>>,
) {
	setStatus?.("load")
	try {
		const response = await fn()
		if (!response) throw new Error("No response")
		if (!response.ok) throw new Error(response.statusText)

		setStatus?.("done")
		return {
			success: true,
			data: await response.json(),
		} as const
	} catch (error) {
		setStatus?.("fail")
		return {
			success: false,
			error,
		} as const
	}
}
