import * as WebCrypto from "node-webcrypto-ossl"
import { Payload } from "./Payload"

const crypto = new WebCrypto()

// tslint:disable:no-bitwise
export class PropertyCrypto {
	protected readonly encoder = new TextEncoder()
	protected readonly decoder = new TextDecoder()
	constructor(private secret: string, private properties: string[]) {
	}
	encrypt(payload: Payload): Promise<Payload> {
		return this.process(payload, value => this.encoder.encode(JSON.stringify(value)), value => {
			const result: string[] = []
			for (let c = 0; c < value.length; c += 3) {
				const c0 = value[c]
				const c1 = c + 1 < value.length ? value[c + 1] : 0
				const c2 = c + 2 < value.length ? value[c + 2] : 0
				result.push(PropertyCrypto.rixits[c0 >>> 2])
				result.push(PropertyCrypto.rixits[(c0 & 3) << 4 | (c1 >>> 4)])
				result.push(PropertyCrypto.rixits[((c1 & 15) << 2) | (c2 >>> 6)])
				result.push(PropertyCrypto.rixits[c2 & 63])
			}
			return result.join("").substr(0, Math.ceil(value.length / 3 * 4))
		})
	}
	decrypt(payload: Payload): Promise<Payload> {
		return this.process(payload, value => {
			let result: Uint8Array
			if (typeof(value) == "string") {
				const data = value.split("").map(c => PropertyCrypto.rixits.indexOf(c))
				result = new Uint8Array(Math.floor(data.length / 4 * 3))
				for (let c = 0; c < result.length; c += 3) {
					const d0 = data.shift() || 0
					const d1 = data.shift() || 0
					const d2 = data.shift() || 0
					const d3 = data.shift() || 0
					result[c] = (d0 << 2) | (d1 >>> 4)
					result[c + 1] = ((d1 & 15) << 4) | (d2 >>> 2)
					result[c + 2] = ((d2 & 3) << 6) | d3
				}
			} else
				result = new Uint8Array()
			return result
		}, value => JSON.parse(this.decoder.decode(value)))
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
					processed[index] = data[index] ^ key[index]
				result[property] = postprocess(processed)
			}
		return result
	}
	private static rixits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
}
