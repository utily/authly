import * as Algorithm from "./Algorithm"
import { Actor } from "./Actor"
import * as Base64 from "./Base64"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { PropertyCrypto } from "./PropertyCrypto"
import { Token } from "./Token"
import { TextEncoder } from "./TextEncoder"

export class Issuer extends Actor {
	audience?: string | string[]
	duration?: number
	get header(): Header {
		return {
			alg: this.algorithm.name,
			typ: "JWT",
		}
	}
	get payload(): Payload {
		const result: Payload = { iss: this.id, iat: Date.now() }
		if (this.audience)
			result.aud = this.audience
		if (this.duration && result.iat)
			result.exp = result.iat + this.duration
		return result
	}
	private cryptos: PropertyCrypto[] = []
	constructor(id: string, readonly algorithm: Algorithm.Base) {
		super(id)
	}
	add(...cryptos: PropertyCrypto[]): Issuer {
		this.cryptos = [ ...this.cryptos, ...cryptos ]
		return this
	}
	async sign(payload: Payload, issuedAt?: Date | number): Promise<Token> {
		payload = { ...this.payload, ...payload }
		if (issuedAt)
			payload.iat = typeof(issuedAt) == "number" ? issuedAt : issuedAt.getTime()
		payload = await this.cryptos.reduce(async (p, c) => c.encrypt(await p), Promise.resolve(payload))
		const data = `${ Base64.encode(new TextEncoder().encode(JSON.stringify(this.header))) }.${ Base64.encode(new TextEncoder().encode(JSON.stringify(payload))) }`
		return `${ data }.${ await this.algorithm.sign(data) }`
	}
}
