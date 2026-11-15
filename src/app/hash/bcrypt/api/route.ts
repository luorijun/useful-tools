import { Buffer } from "node:buffer"
import { hash } from "bcrypt"

const headers = { "Cache-Control": "no-store" }
const badRequest = { status: 400, headers }

export async function GET(request: Request) {
	const params = new URL(request.url).searchParams
	const text = params.get("t")
	if (text === null) {
		return new Response("Missing parameter t", badRequest)
	}
	if (Buffer.byteLength(text, "utf8") > 72) {
		return new Response(
			"Parameter t must be at most 72 UTF-8 bytes",
			badRequest,
		)
	}

	const cost = params.get("r") ?? "10"
	const rounds = Number(cost)
	if (!/^\d+$/.test(cost) || rounds < 4 || rounds > 12) {
		return new Response(
			"Parameter r must be an integer from 4 to 12",
			badRequest,
		)
	}

	return new Response(await hash(text, rounds), { headers })
}
