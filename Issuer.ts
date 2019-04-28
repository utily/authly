import { Type } from "./Type"

// tslint:disable:no-bitwise
export class Issuer<T> {
	constructor(private type: Type) {
	}
	hash() {}
	async encode(token: T): Promise<string> {
		const time = Date.now()
		const payload = {}
		for (const name in this.type.claims)
			if (this.type.claims.hasOwnProperty(name)) {
				const claim = this.type.claims[name]
				const value = token[name]
				payload[claim.abbreviation] = value
			}
		return ""
	}
}
