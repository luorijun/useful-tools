import { Buffer, isUtf8 } from "node:buffer"
import { hash } from "bcrypt"

const headers = { "Cache-Control": "no-store" }
const badRequest = { status: 400, headers }
const maxBytes = 72

export async function POST(request: Request) {
	const type = request.headers.get("content-type")?.split(";", 1)[0]
	if (type?.trim().toLowerCase() !== "text/plain") {
		return new Response("Content-Type must be text/plain", badRequest)
	}

	const params = new URL(request.url).searchParams
	const cost = params.get("r") ?? "10"
	const rounds = Number(cost)
	if (!/^\d+$/.test(cost) || rounds < 4 || rounds > 12) {
		return new Response(
			"Parameter r must be an integer from 4 to 12",
			badRequest,
		)
	}

	const bytes = Buffer.alloc(maxBytes)
	let size = 0
	if (request.body) {
		const reader = request.body.getReader()
		try {
			for (;;) {
				const { done, value } = await reader.read()
				if (done) break
				if (size + value.byteLength > maxBytes) {
					return new Response(
						`Request body must be at most ${maxBytes} UTF-8 bytes`,
						badRequest,
					)
				}
				bytes.set(value, size)
				size += value.byteLength
			}
		} finally {
			reader.releaseLock()
		}
	}
	const text = bytes.subarray(0, size)
	if (!isUtf8(text)) {
		return new Response("Request body must be valid UTF-8", badRequest)
	}

	return new Response(await hash(text, rounds), { headers })
}
