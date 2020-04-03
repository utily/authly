import { Algorithm } from "./Algorithm"
import { Actor } from "./Actor"
import * as Base64 from "./Base64"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { Token } from "./Token"
import { TextDecoder } from "./TextDecoder"

export class Verifier extends Actor<Verifier> {
	readonly algorithms: { [algorithm: string]: Algorithm } | undefined
	private constructor(audience: string, ...algorithms: Algorithm[]) {
		super(audience)
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
			// token = token.replace("+", "-").replace("/", "_") // For backwards compatibility.
			const splitted = token.split(".", 3)
			if (splitted.length < 2)
				result = undefined
			else {
				try {
					const header: Header = JSON.parse(new TextDecoder().decode(Base64.decode(splitted[0], "url")))
					result = JSON.parse(new TextDecoder().decode(Base64.decode(splitted[1], "url"))) as Payload
					if (this.algorithms) {
						const algorithm = this.algorithms[header.alg]
						result = splitted.length == 3 && algorithm && await algorithm.verify(`${ splitted[0] }.${ splitted[1] }`, splitted[2]) ? result : undefined
					}
				} catch {
					result = undefined
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
		}
		return result
	}
	private verifyAudience(audience: undefined | string | string[]): boolean {
		return audience == undefined || typeof(audience) == "string" && audience == this.id || Array.isArray(audience) && audience.some(a => a == this.id)
	}
	async authenticate(authorization: string): Promise<Payload | undefined> {
		return authorization && authorization.startsWith("Bearer ") ? this.verify(authorization.substr(7)) : undefined
	}
	static create(audience: string, ...algorithms: Algorithm[]): Verifier
	static create(audience: string, ...algorithms: (Algorithm | undefined)[]): Verifier | undefined
	static create(audience: string, ...algorithms: (Algorithm | undefined)[]): Verifier | undefined {
		return (algorithms.length == 0 || algorithms.some(a => !!a)) && new Verifier(audience, ...algorithms.filter(a => !!a) as Algorithm[]) || undefined
	}
}
