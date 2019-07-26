import { crypto } from "./crypto"
import * as Base64 from "./Base64"

export namespace RandomEncoder {
	export function encodeRandom(length: number): string {
		return Base64.encode(crypto.getRandomValues(new Uint8Array(length)))
	}
}
