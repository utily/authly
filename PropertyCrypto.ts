import * as WebCrypto from "node-webcrypto-ossl"
import * as Base64 from "./Base64"
import { Payload } from "./Payload"

const crypto = new WebCrypto()

export class PropertyCrypto {
	protected readonly encoder = new TextEncoder()
	protected readonly decoder = new TextDecoder()
	constructor(private secret: string, private properties: string[]) {
	}
	encrypt(payload: Payload): Promise<Payload> {
		return this.process(payload, value => this.encoder.encode(JSON.stringify(value)), value => Base64.encode(value, "url"))
	}
	decrypt(payload: Payload): Promise<Payload> {
		return this.process(payload, value => typeof(value) == "string" ? Base64.decode(value, "url") : new Uint8Array(), value => JSON.parse(this.decoder.decode(value)))
	}
	private async process(payload: Payload, preprocess: (value: any) => Uint8Array, postprocess: (value: Uint8Array) => any): Promise<Payload> {
		const secret = this.secret + payload.sub + payload.iat
		const result = { ...payload }
		for (const property of this.properties)
			if (result[property]) {
				const data = preprocess(payload[property])
				const key = new Uint8Array(await crypto.subtle.digest("SHA-512", this.encoder.encode(secret + property)))
				const processed = new Uint8Array(data.length)
				for (let index = 0; index < data.length; index++)
					// tslint:disable-next-line:no-bitwise
					processed[index] = data[index] ^ key[index]
				result[property] = postprocess(processed)
			}
		return result
	}
}
