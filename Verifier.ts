import * as Algorithm from "./Algorithm"
import { Actor } from "./Actor"
import * as Base64 from "./Base64"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { PropertyCrypto } from "./PropertyCrypto"
import { Token } from "./Token"
import { TextEncoder } from "./TextEncoder"
import { TextDecoder } from "./TextDecoder"

export class Verifier extends Actor {
	readonly algorithms: { [algorithm: string]: Algorithm.Base } | undefined
	private cryptos: PropertyCrypto[] = []
	constructor(id: string, ...algorithms: Algorithm.Base[]) {
		super(id)
		if (algorithms.length > 0) {
			this.algorithms = {}
			for (const algorithm of algorithms)
				this.algorithms[algorithm.name] = algorithm
		} else
			this.algorithms = undefined
	}
	add(...cryptos: PropertyCrypto[]): Verifier {
		this.cryptos = [ ...this.cryptos, ...cryptos ]
		return this
	}
	async verify(token: string | Token | undefined): Promise<Payload | undefined> {
		let result: Payload | undefined
		if (token) {
			const splitted = token.split(".", 3)
			const header: Header = JSON.parse(new TextDecoder().decode(Base64.decode(splitted[0])))
			result = JSON.parse(new TextDecoder().decode(Base64.decode(splitted[1]))) as Payload
			if (this.algorithms) {
				const algorithm = this.algorithms[header.alg]
				result = algorithm && await algorithm.verify(new TextEncoder().encode(`${ splitted[0] }.${ splitted[1] }`), Base64.decode(splitted[2], "url")) ? result : undefined
			}
			const now = Date.now()
			result = result &&
				(result.exp == undefined || result.exp > now) &&
				(result.iat == undefined || result.iat <= now) &&
				this.verifyAudience(result.aud) ?
				result : undefined
		}
		if (result)
			result = await this.cryptos.reduce(async (p, c) => c.decrypt(await p), Promise.resolve(result))
		return result
	}
	private verifyAudience(audience: undefined | string | string[]): boolean {
		return audience == undefined || typeof(audience) == "string" && audience == this.id || Array.isArray(audience) && audience.some(a => a == this.id)
	}
	async authenticate(authorization: string): Promise<Payload | undefined> {
		return authorization && authorization.startsWith("Bearer ") ? this.verify(authorization.substr(7)) : undefined
	}
}
