import { crypto } from "../crypto"
import { Base } from "./Base"
import { Name } from "./Name"
import * as Base64 from "../Base64"

export class RS256 extends Base {
	get name(): Name { return "RS256" }
	private publicKey: PromiseLike<CryptoKey>
	private privateKey: PromiseLike<CryptoKey>
	constructor(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string) {
		super()
		if (publicKey) {
			if (typeof(publicKey) == "string")
				publicKey =  Base64.decode(publicKey)
			this.publicKey = crypto.subtle.importKey("spki", publicKey, { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256"}}, false, ["verify"])
		}
		if (privateKey) {
			if (typeof(privateKey) == "string")
				privateKey =  Base64.decode(privateKey)
			this.privateKey = crypto.subtle.importKey("pkcs8", privateKey, { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256"}}, true, ["sign", "verify"])
		}
	}
	protected async signBinary(data: Uint8Array): Promise<Uint8Array> {
		return new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", await this.privateKey, data))
	}
	protected async verifyBinary(data: Uint8Array, signature: Uint8Array): Promise<boolean> {
		return crypto.subtle.verify(
			"RSASSA-PKCS1-v1_5",
			await this.publicKey,
			signature,
			data,
		)
	}
}
