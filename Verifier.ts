import * as base64Url from "base64-url"
import * as Algorithm from "./Algorithm"
import { Actor } from "./Actor"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { Token } from "./Token"

export class Verifier extends Actor {
	readonly algorithms: { [algorithm: string]: Algorithm.Base } = {}
	constructor(id: string, ...algorithms: Algorithm.Base[]) {
		super(id)
		for (const algorithm of algorithms)
			this.algorithms[algorithm.name] = algorithm
	}
	verify(token: string | Token | undefined): Payload | undefined {
		let result: Payload | undefined
		if (token) {
			const splitted = token.split(".", 3)
			const header: Header = JSON.parse(base64Url.decode(splitted[0]))
			const algorithm = this.algorithms[header.alg]
			result = algorithm && algorithm.verify(token, splitted[2]) ? JSON.parse(base64Url.decode(splitted[1])) as Payload : undefined
			const now = Date.now()
			result = result &&
				(result.exp == undefined || result.exp > now) &&
				(result.iat == undefined || result.iat <= now) &&
				this.verifyAudience(result.aud) ?
				result : undefined
		}
		return result
	}
	private verifyAudience(audience: undefined | string | string[]): boolean {
		return audience == undefined || typeof(audience) == "string" && audience == this.id || Array.isArray(audience) && audience.some(a => a == this.id)
	}
	authenticate(authorization: string): Payload | undefined {
		return authorization && authorization.startsWith("Bearer ") ? this.verify(authorization.substr(7)) : undefined
	}
}
