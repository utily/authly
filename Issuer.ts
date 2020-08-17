import { Algorithm } from "./Algorithm"
import { Actor } from "./Actor"
import * as Base64 from "./Base64"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { Token } from "./Token"
import { TextEncoder } from "./TextEncoder"

export class Issuer extends Actor<Issuer> {
	audience?: string | string[]
	duration?: number
	get header(): Header {
		return {
			alg: this.algorithm.name,
			typ: "JWT",
		}
	}
	get payload(): Payload {
		const result: Payload = { iss: this.id, iat: Issuer.issuedAt }
		if (this.audience)
			result.aud = this.audience
		if (this.duration && result.iat)
			result.exp = result.iat + this.duration
		return result
	}
	private constructor(issuer: string, readonly algorithm: Algorithm) {
		super(issuer)
	}
	async sign(payload: Payload, issuedAt?: Date | number): Promise<Token> {
		payload = { ...this.payload, ...payload }
		if (issuedAt)
			payload.iat = typeof issuedAt == "number" ? issuedAt : issuedAt.getTime()
		payload = await this.cryptos.reduce(async (p, c) => c.encrypt(await p), Promise.resolve(payload))
		const data = `${Base64.encode(new TextEncoder().encode(JSON.stringify(this.header)), "url")}.${Base64.encode(
			new TextEncoder().encode(JSON.stringify(payload)),
			"url"
		)}`
		return `${data}.${await this.algorithm.sign(data)}`
	}
	private static get issuedAt(): number {
		return Issuer.defaultIssuedAt == undefined
			? Date.now()
			: typeof Issuer.defaultIssuedAt == "number"
			? Issuer.defaultIssuedAt
			: Issuer.defaultIssuedAt.getTime()
	}
	static defaultIssuedAt: undefined | Date | number
	static create(issuer: string, algorithm: Algorithm): Issuer
	static create(issuer: string, algorithm: Algorithm | undefined): Issuer | undefined
	static create(issuer: string, algorithm: Algorithm | undefined): Issuer | undefined {
		return (algorithm && new Issuer(issuer, algorithm)) || undefined
	}
}
