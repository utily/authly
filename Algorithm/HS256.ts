import * as WebCrypto from "node-webcrypto-ossl"
import { Symmetric } from "./Symmetric"
import { Name } from "./Name"

const crypto = new WebCrypto()

export class HS256 extends Symmetric {
	get name(): Name { return "HS256" }
	private key: PromiseLike<NodeWebcryptoOpenSSL.CryptoKey>
	constructor(key: Uint8Array) {
		super()
		this.key = crypto.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, [ "sign", "verify" ])
	}
	async sign(data: Uint8Array): Promise<Uint8Array> {
		return new Uint8Array(await crypto.subtle.sign("HMAC", await this.key, data))
	}
}
