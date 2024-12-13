import { cryptly } from "cryptly"
import { Header } from "../Header"
import { Name as AlgorithmName } from "./Name"

// TODO: maybe rewrite this to include proper typing for algorithm names and indexing in switch?
export class Algorithm {
	/**
	 * Key Id
	 *
	 * If set, the property will be included in JWT-header by the Issuer.
	 */
	public kid?: Header["kid"]
	private constructor(readonly name: AlgorithmName, private readonly signer: cryptly.Signer) {}

	async sign(data: Uint8Array): Promise<Uint8Array>
	async sign(data: string): Promise<string>
	async sign(data: string | Uint8Array): Promise<string | Uint8Array> {
		return typeof data == "string" ? this.signer.sign(data) : this.signer.sign(data)
	}
	verify(data: string | Uint8Array, signature: string | Uint8Array): Promise<boolean> {
		return this.signer.verify(data, signature)
	}

	static create(name: "none"): Algorithm | undefined
	static create(name: AlgorithmName.Symmetric, key: Uint8Array | string): Algorithm
	static create(name: AlgorithmName.Symmetric, key: Uint8Array | string | undefined): Algorithm
	static create(
		name: AlgorithmName.Asymmetric,
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string
	): Algorithm
	static create(name: AlgorithmName, ...keys: (string | Uint8Array)[]): Algorithm {
		let result: cryptly.Signer
		switch (name) {
			case "ES256":
				result = cryptly.Signer.create("ECDSA", "SHA-256", keys[0], keys[1])
				break
			case "ES384":
				result = cryptly.Signer.create("ECDSA", "SHA-384", keys[0], keys[1])
				break
			case "ES512":
				result = cryptly.Signer.create("ECDSA", "SHA-512", keys[0], keys[1])
				break
			case "PS256":
				result = cryptly.Signer.create("RSA-PSS", "SHA-256", keys[0], keys[1])
				break
			case "PS384":
				result = cryptly.Signer.create("RSA-PSS", "SHA-384", keys[0], keys[1])
				break
			case "PS512":
				result = cryptly.Signer.create("RSA-PSS", "SHA-512", keys[0], keys[1])
				break
			case "HS256":
				result = cryptly.Signer.create("HMAC", "SHA-256", keys[0])
				break
			case "HS384":
				result = cryptly.Signer.create("HMAC", "SHA-384", keys[0])
				break
			case "HS512":
				result = cryptly.Signer.create("HMAC", "SHA-512", keys[0])
				break
			case "RS256":
				result = cryptly.Signer.create("RSA", "SHA-256", keys[0], keys[1])
				break
			case "RS384":
				result = cryptly.Signer.create("RSA", "SHA-384", keys[0], keys[1])
				break
			case "RS512":
				result = cryptly.Signer.create("RSA", "SHA-512", keys[0], keys[1])
				break
			case "none":
				result = cryptly.Signer.create("None")
				break
		}
		return new Algorithm(name, result)
	}
	static none(): Algorithm | undefined {
		return Algorithm.create("none")
	}
	static HS256(key: Uint8Array | string): Algorithm
	static HS256(key: Uint8Array | string | undefined): Algorithm | undefined
	static HS256(key: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("HS256", key)
	}
	static HS384(key: Uint8Array | string): Algorithm
	static HS384(key: Uint8Array | string | undefined): Algorithm | undefined
	static HS384(key: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("HS384", key)
	}
	static HS512(key: Uint8Array | string): Algorithm
	static HS512(key: Uint8Array | string | undefined): Algorithm | undefined
	static HS512(key: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("HS512", key)
	}

	static RS256(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm {
		return Algorithm.create("RS256", publicKey, privateKey)
	}
	static RS384(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm {
		return Algorithm.create("RS384", publicKey, privateKey)
	}
	static RS512(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm {
		return Algorithm.create("RS512", publicKey, privateKey)
	}
	static ES256(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm {
		return Algorithm.create("ES256", publicKey, privateKey)
	}
	static ES384(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm {
		return Algorithm.create("ES384", publicKey, privateKey)
	}
	static ES512(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm {
		return Algorithm.create("ES512", publicKey, privateKey)
	}
	static PS256(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm {
		return Algorithm.create("PS256", publicKey, privateKey)
	}
	static PS384(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm {
		return Algorithm.create("PS384", publicKey, privateKey)
	}
	static PS512(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm {
		return Algorithm.create("PS512", publicKey, privateKey)
	}
}
export namespace Algorithm {
	export import Name = AlgorithmName
}
