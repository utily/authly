import { cryptly } from "cryptly"
import { Actor } from "./Actor"
import { Algorithm } from "./Algorithm"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { Token } from "./Token"

export class Issuer<T extends Payload> extends Actor<Issuer<T>> {
	audience?: string | string[]
	/** Duration in seconds */
	duration?: number
	get header(): Header {
		return {
			alg: this.algorithm.name,
			typ: "JWT",
			...(this.algorithm.kid && { kid: this.algorithm.kid }),
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
	async sign(payload: T, issuedAt?: Date | number): Promise<Token | undefined> {
		payload = { ...this.payload, ...payload }
		if (issuedAt)
			payload.iat = typeof issuedAt == "number" ? issuedAt : issuedAt.getTime() / 1000
		const transformed = await this.transformers.reduce(async (p, c) => c.apply(await p), Promise.resolve(payload))
		const data =
			transformed &&
			`${cryptly.Base64.encode(new TextEncoder().encode(JSON.stringify(this.header)), "url")}.${cryptly.Base64.encode(
				new TextEncoder().encode(JSON.stringify(transformed)),
				"url"
			)}`
		return data && `${data}.${await this.algorithm.sign(data)}`
	}
	private static get issuedAt(): number {
		return Issuer.defaultIssuedAt == undefined
			? Math.floor(Date.now() / 1000)
			: typeof Issuer.defaultIssuedAt == "number"
			? Issuer.defaultIssuedAt
			: Math.floor(Issuer.defaultIssuedAt.getTime() / 1000)
	}
	static defaultIssuedAt: undefined | Date | number
	static create<T extends Payload>(issuer: string, algorithm: Algorithm): Issuer<T>
	static create<T extends Payload>(issuer: string, algorithm: Algorithm | undefined): Issuer<T> | undefined
	static create<T extends Payload>(issuer: string, algorithm: Algorithm | undefined): Issuer<T> | undefined {
		return (algorithm && new Issuer(issuer, algorithm)) || undefined
	}
}
