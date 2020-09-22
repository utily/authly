export type Crypto = string[]
export namespace Crypto {
	export function is(value: Crypto | any): value is Crypto {
		return Array.isArray(value) && value.every(v => typeof v == "string")
	}
}
