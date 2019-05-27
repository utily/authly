import { PropertyCrypter } from "./PropertyCrypter"

// tslint:disable:no-bitwise
export class PropertyEncrypter extends PropertyCrypter {
	constructor(secret: string, properties: string[]) {
		super(secret, properties)
	}
	protected preprocess(value: any): Uint8Array {
		return this.encoder.encode(JSON.stringify(value))
	}
	protected postprocess(value: Uint8Array): any {
		const result: string[] = []
		for (let c = 0; c < value.length; c += 3) {
			const c0 = value[c]
			const c1 = c + 1 < value.length ? value[c + 1] : 0
			const c2 = c + 2 < value.length ? value[c + 2] : 0
			result.push(PropertyCrypter.rixits[c0 >>> 2])
			result.push(PropertyCrypter.rixits[(c0 & 3) << 4 | (c1 >>> 4)])
			result.push(PropertyCrypter.rixits[((c1 & 15) << 2) | (c2 >>> 6)])
			result.push(PropertyCrypter.rixits[c2 & 63])
		}
		return result.join("").substr(0, Math.ceil(value.length / 3 * 4))
	}
}
