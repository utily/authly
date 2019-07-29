import { crypto } from "./crypto"
import * as Base64 from "./Base64"

export type Identifier = string

export namespace Identifier {
	export function is(value: Identfier | any): value is Identifier {
		return typeof(value) == "string" && Array.from(value).every(c => c >= "0" && c <= "9" || c >= "A" && c <= "Z" || c >= "a" && c <= "z" || c == "-" || c == "_")
	}
	export function generate(length: number): Identifier {
		return Base64.encode(crypto.getRandomValues(new Uint8Array(length / 3 * 4)))
	}
}
