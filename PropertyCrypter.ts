import * as WebCrypto from "node-webcrypto-ossl"
import { Payload } from "./Payload"

const crypto = new WebCrypto()

export abstract class PropertyCrypter {
	protected readonly encoder = new TextEncoder()
	protected readonly decoder = new TextDecoder()
	constructor(private secret: string, private properties: string[]) {
	}
	protected abstract preprocess(value: any): Uint8Array
	protected abstract postprocess(value: Uint8Array): any
	async process(payload: Payload): Promise<Payload> {
		const secret = this.secret + payload.sub + payload.iat
		const result = { ...payload }
		for (const property of this.properties)
			if (result[property]) {
				const data = this.preprocess(payload[property])
				const key = new Uint8Array(await crypto.subtle.digest("SHA-512", this.encoder.encode(secret + property)))
				const processed = new Uint8Array(data.length)
				for (let index = 0; index < data.length; index++)
					// tslint:disable-next-line:no-bitwise
					processed[index] = data[index] ^ key[index] // ^ key[index]
				result[property] = this.postprocess(processed)
			}
		return result
	}
	protected static rixits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
}
