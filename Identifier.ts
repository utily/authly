import { crypto } from "./crypto"
import * as Base64 from "./Base64"

export type Identifier = string

export namespace Identifier {
	export function is(value: Identifier | any): value is Identifier {
		return typeof(value) == "string" && Array.from(value).every(c => c >= "0" && c <= "9" || c >= "A" && c <= "Z" || c >= "a" && c <= "z" || c == "-" || c == "_")
	}
	export function fromBinary(identifier: Uint8Array): Identifier {
		return Base64.encode(identifier, "url")		
	}
	export function toBinary(identifier: Identifier): Uint8Array {
		return Base64.decode(identifier, "url")		
	}
	export function generate(length: Lengths): Identifier {
		return fromBinary(crypto.getRandomValues(new Uint8Array(length / 4 * 3)))
	}
	export function fromHexadecimal(identifier: string): Identifier {
		if (identifier.length % 2 == 1)
			identifier += "0"
		const result = new Uint8Array(identifier.length / 2)
		for (let index = 0; index < result.length; index++)
			result[index] = Number.parseInt(identifier[index * 2], 16) * 16 + Number.parseInt(identifier[index * 2 + 1], 16)
		return fromBinary(result)
	}
	export function toHexadecimal(identifier: Identifier, length?: number): string {
		const data = Base64.decode(identifier, "url")
		let result: string[] = []
		for (let index = 0; index < data.length; index++)
			result.push(Math.floor(data[index] / 16).toString(16), (data[index] % 16).toString(16))
		if (length)
			result = result.slice(0, length)
		return result.join("")
	}
	export const lengths = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128] as Lengths[]
	export type Lengths = 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 68 | 72 | 76 | 80 | 84 | 88 | 92 | 96 | 100 | 104 | 108 | 112 | 116 | 120 | 124 | 128
	export namespace Lengths {
		export function is(value: Lengths | any): value is Lengths {
			return typeof(value) == "number" &&
				value >= 4 &&
				value <=128 &&
				(value & 252) == value
		}
	}
}
