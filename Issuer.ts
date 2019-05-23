import * as base64Url from "base64-url"
import * as Algorithm from "./Algorithm"
import { Header } from "./Header"
import { Payload } from "./Payload"

export class Issuer {
	issuer?: string
	subject?: string
	audience?: string
	duration?: number
	identifier?: string
	get header(): Header {
		return {
			alg: this.algorithm.name,
			typ: "JWT",
		}
	}
	get payload(): Payload {
		const result: Payload = {}
		if (this.issuer)
			result.iss = this.issuer
		if (this.subject)
			result.sub = this.subject
		if (this.audience)
			result.aud = this.audience
		result.iat = Date.now()
		if (this.duration)
			result.exp = result.iat + this.duration
		return result
	}
	constructor(readonly algorithm: Algorithm.Base) {
	}
	sign(payload: Payload, issuedAt?: Date | number): string {
		payload = { ...this.payload, ...payload }
		if (issuedAt)
			payload.iat = typeof(issuedAt) == "number" ? issuedAt : issuedAt.getTime()
		const data = `${base64Url.encode(JSON.stringify(this.header))}.${base64Url.encode(JSON.stringify(payload))}`
		return `${ data }.${ this.algorithm.sign(data) }`
	}
}
