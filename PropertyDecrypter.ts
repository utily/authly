import * as base64Url from "base64-url"
import { PropertyCrypter } from "./PropertyCrypter"

export class PropertyDecrypter extends PropertyCrypter {
	constructor(secret: string, properties: string[]) {
		super(secret, properties)
	}
	// tslint:disable: no-bitwise
	protected preprocess(value: any): Uint8Array {
		let result: Uint8Array
		if (typeof(value) == "string") {
			const data = value.split("").map(c => PropertyCrypter.rixits.indexOf(c))
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
	}
	protected postprocess(value: Uint8Array): any {
		return JSON.parse(this.decoder.decode(value))
	}
}
