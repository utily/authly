import { Base } from "./Base"
import * as Base64 from "../Base64"

export abstract class Symmetric extends Base {
	async verify(data: Uint8Array, signature: Uint8Array): Promise<boolean> {
		return Base64.encode(await this.sign(data), "url") == Base64.encode(signature, "url")
	}
}
