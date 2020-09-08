import { crypto } from "../crypto"
import { Algorithm, register } from "./Algorithm"
import { Name } from "./Name"
import { Base64 } from "cryptly"

export class RS extends Algorithm {
	get name(): Name {
		return ("RS" + this.length) as Name
	}
	private publicKey: PromiseLike<CryptoKey>
	private privateKey: PromiseLike<CryptoKey>
	constructor(
		private readonly length: "256" | "384" | "512",
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string
	) {
		super()
		if (publicKey) {
			if (typeof publicKey == "string")
				publicKey = Base64.decode(publicKey)
			this.publicKey = crypto.subtle.importKey(
				"spki",
				publicKey,
				{ name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-" + this.length } },
				false,
				["verify"]
			)
		}
		if (privateKey) {
			if (typeof privateKey == "string")
				privateKey = Base64.decode(privateKey)
			this.privateKey = crypto.subtle.importKey(
				"pkcs8",
				privateKey,
				{ name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-" + this.length } },
				true,
				["sign", "verify"]
			)
		}
	}
	protected async signBinary(data: Uint8Array): Promise<Uint8Array> {
		return new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", await this.privateKey, data))
	}
	protected async verifyBinary(data: Uint8Array, signature: Uint8Array): Promise<boolean> {
		return crypto.subtle.verify("RSASSA-PKCS1-v1_5", await this.publicKey, signature, data)
	}
}
register(
	"RS256",
	(keys: [Uint8Array | string | undefined, Uint8Array | string | undefined]) => new RS("256", keys[0], keys[1])
)
register(
	"RS384",
	(keys: [Uint8Array | string | undefined, Uint8Array | string | undefined]) => new RS("384", keys[0], keys[1])
)
register(
	"RS512",
	(keys: [Uint8Array | string | undefined, Uint8Array | string | undefined]) => new RS("512", keys[0], keys[1])
)
