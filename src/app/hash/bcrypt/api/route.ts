import { Buffer } from "node:buffer"
import { hash } from "bcrypt"

const headers = { "Cache-Control": "no-store" }

export async function GET(request: Request) {
	const params = new URL(request.url).searchParams
	const text = params.get("t")
	if (text === null) {
		return Response.json(
			{ error: "Missing parameter t" },
			{ status: 400, headers },
		)
	}
	if (Buffer.byteLength(text, "utf8") > 72) {
		return Response.json(
			{ error: "Parameter t must be at most 72 UTF-8 bytes" },
			{ status: 400, headers },
		)
	}

	const cost = params.get("r") ?? "10"
	const rounds = Number(cost)
	if (!/^\d+$/.test(cost) || rounds < 4 || rounds > 12) {
		return Response.json(
			{ error: "Parameter r must be an integer from 4 to 12" },
			{ status: 400, headers },
		)
	}

	return Response.json({ hash: await hash(text, rounds) }, { headers })
}	
