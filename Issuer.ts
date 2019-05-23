import * as base64Url from "base64-url"
import * as Algorithm from "./Algorithm"
import { Actor } from "./Actor"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { Token } from "./Token"

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
	constructor(id: string, readonly algorithm: Algorithm.Base) {
		super(id)
	}
	sign(payload: Payload, issuedAt?: Date | number): Token {
		payload = { ...this.payload, ...payload }
		if (issuedAt)
			payload.iat = typeof(issuedAt) == "number" ? issuedAt : issuedAt.getTime()
		const data = `${ base64Url.encode(JSON.stringify(this.header)) }.${ base64Url.encode(JSON.stringify(payload)) }`
		return `${ data }.${ this.algorithm.sign(data) }`
	}
}
