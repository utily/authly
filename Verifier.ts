import * as base64Url from "base64-url"
import { TextEncoder } from "text-encoder"
import * as Algorithm from "./Algorithm"
import { Actor } from "./Actor"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { Token } from "./Token"
import * as Base64 from "./Base64"

export class Verifier extends Actor {
	readonly algorithms: { [algorithm: string]: Algorithm.Base } | undefined
	constructor(id: string, ...algorithms: Algorithm.Base[]) {
		super(id)
		if (algorithms.length > 0) {
			this.algorithms = {}
			for (const algorithm of algorithms)
				this.algorithms[algorithm.name] = algorithm
		} else
			this.algorithms = undefined
	}
	async verify(token: string | Token | undefined): Promise<Payload | undefined> {
		let result: Payload | undefined
		if (token) {
			const splitted = token.split(".", 3)
			const header: Header = JSON.parse(base64Url.decode(splitted[0]))
			result = JSON.parse(base64Url.decode(splitted[1])) as Payload
			if (this.algorithms) {
				const algorithm = this.algorithms[header.alg]
				result = algorithm && await algorithm.verify(new TextEncoder("utf-8").encode(`${ splitted[0] }.${ splitted[1] }`), Base64.decode(splitted[2], "url")) ? result : undefined
			}
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
	async authenticate(authorization: string): Promise<Payload | undefined> {
		return authorization && authorization.startsWith("Bearer ") ? this.verify(authorization.substr(7)) : undefined
	}
}
