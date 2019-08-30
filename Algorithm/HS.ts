import { crypto } from "../crypto"
import * as Base64 from "../Base64"
import { register } from "./Algorithm"
import { Symmetric } from "./Symmetric"
import { Name } from "./Name"

export class HS extends Symmetric {
	get name(): Name { return "HS" + this.length as Name.Symmetric }
	private key: PromiseLike<CryptoKey>
	constructor(private readonly length: "256" | "384" | "512", key: Uint8Array | string) {
		super()
		if (typeof(key) == "string")
			key = Base64.decode(key, "url")
		this.key = crypto.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-" + this.length } }, false, [ "sign", "verify" ])
	}
	async signBinary(data: Uint8Array): Promise<Uint8Array> {
		return new Uint8Array(await crypto.subtle.sign("HMAC", await this.key, data))
	}
}
register("HS256", (keys: [Uint8Array | string | undefined, Uint8Array | string | undefined]) => keys[0] && new HS("256", keys[0]) || undefined)
register("HS384", (keys: [Uint8Array | string | undefined, Uint8Array | string | undefined]) => keys[0] && new HS("384", keys[0]) || undefined)
register("HS512", (keys: [Uint8Array | string | undefined, Uint8Array | string | undefined]) => keys[0] && new HS("512", keys[0]) || undefined)
