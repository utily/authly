import { Base64, Digest, TextEncoder, TextDecoder } from "cryptly"
import { Payload } from "../Payload"
import { Remover } from "./Remover"

export class Crypto {
	protected readonly encoder = new TextEncoder()
	protected readonly decoder = new TextDecoder()
	private properties: string[][]
	private constructor(private secret: string, ...properties: string[]) {
		this.properties = properties.map(p => p.split("."))
	}
	async apply(payload: Payload | undefined): Promise<Payload | undefined> {
		return (
			payload &&
			this.process(
				payload,
				value => this.encoder.encode(JSON.stringify(value)),
				value => Base64.encode(value, "url")
			)
		)
	}
	async reverse(payload: Payload | undefined): Promise<Payload | undefined> {
		return (
			payload &&
			this.process(
				payload,
				value => (typeof value == "string" ? Base64.decode(value, "url") : new Uint8Array()),
				value => JSON.parse(this.decoder.decode(value))
			)
		)
	}
	private async process(
		payload: Payload,
		preprocess: (value: any) => Uint8Array,
		postprocess: (value: Uint8Array) => any
	): Promise<Payload> {
		const secret = this.secret + payload.sub + payload.iat
		for (const property of this.properties)
			payload = await this.processProperty(payload, property, secret + property.join("."), preprocess, postprocess)
		return payload
	}
	private async processProperty(
		payload: Payload,
		property: string[],
		secret: string,
		preprocess: (value: any) => Uint8Array,
		postprocess: (value: Uint8Array) => any
	): Promise<Payload> {
		const result = { ...payload }
		if (result[property[0]])
			if (property.length == 1) {
				const data = preprocess(payload[property[0]])
				const key = await new Digest("SHA-512").digest(this.encoder.encode(secret))
				const processed = new Uint8Array(data.length)
				for (let index = 0; index < data.length; index++)
					processed[index] = data[index] ^ key[index]
				result[property[0]] = postprocess(processed)
			} else
				result[property[0]] = await this.processProperty(
					result[property[0]] as Payload,
					property.slice(1),
					secret,
					preprocess,
					postprocess
				)
		return result
	}
	static create(secret: string, ...properties: string[]): Crypto
	static create(secret: string | undefined, ...properties: string[]): Crypto | Remover | undefined
	static create(secret: string | undefined, ...properties: string[]): Crypto | Remover | undefined {
		return secret ? new Crypto(secret, ...properties) : Remover.create(properties)
	}
}
