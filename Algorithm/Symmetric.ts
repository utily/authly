import { Algorithm } from "./Algorithm"
import { Base64 } from "cryptly"

export abstract class Symmetric extends Algorithm {
	async verifyBinary(data: Uint8Array, signature: Uint8Array): Promise<boolean> {
		return Base64.encode(await this.signBinary(data), "url") == Base64.encode(signature, "url")
	}
}
