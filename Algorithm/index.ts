import { Signer } from "cryptly"
import { Name as AlgorithmName } from "./Name"

export class Algorithm {
	private constructor(readonly name: AlgorithmName, private readonly signer: Signer) {}

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
	static create(name: AlgorithmName.Symmetric, key: Uint8Array | string | undefined): Algorithm | undefined
	static create(
		name: AlgorithmName.Asymmetric,
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string
	): Algorithm | undefined
	static create(name: AlgorithmName, ...keys: (string | Uint8Array)[]): Algorithm | undefined {
		let result: Signer | undefined
		switch (name) {
			/*
			case "ES256":
				result = Signer.create("ECDSA", "SHA-256", keys[0], keys[1])
				break
			case "ES384":
				result = Signer.create("ECDSA", "SHA-384", keys[0], keys[1])
				break
			case "ES512":
				result = Signer.create("ECDSA", "SHA-512", keys[0], keys[1])
				break
			case "PS256":
				result = Signer.create("RSA-PSS", "SHA-256", keys[0], keys[1])
				break
			case "PS384":
				result = Signer.create("RSA-PSS", "SHA-384", keys[0], keys[1])
				break
			case "PS512":
				result = Signer.create("RSA-PSS", "SHA-512", keys[0], keys[1])
				break
				*/
			case "HS256":
				result = Signer.create("HMAC", "SHA-256", keys[0])
				break
			case "HS384":
				result = Signer.create("HMAC", "SHA-384", keys[0])
				break
			case "HS512":
				result = Signer.create("HMAC", "SHA-512", keys[0])
				break
			case "RS256":
				result = Signer.create("RSA", "SHA-256", keys[0], keys[1])
				break
			case "RS384":
				result = Signer.create("RSA", "SHA-384", keys[0], keys[1])
				break
			case "RS512":
				result = Signer.create("RSA", "SHA-512", keys[0], keys[1])
				break
			case "none":
				result = Signer.create("None")
				break
		}
		return result && new Algorithm(name, result)
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

	static RS256(
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string | undefined
	): Algorithm | undefined {
		return Algorithm.create("RS256", publicKey, privateKey)
	}
	static RS384(
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string | undefined
	): Algorithm | undefined {
		return Algorithm.create("RS384", publicKey, privateKey)
	}
	static RS512(
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string | undefined
	): Algorithm | undefined {
		return Algorithm.create("RS512", publicKey, privateKey)
	}
	static ES256(
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string | undefined
	): Algorithm | undefined {
		return Algorithm.create("ES256", publicKey, privateKey)
	}
	static ES384(
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string | undefined
	): Algorithm | undefined {
		return Algorithm.create("ES384", publicKey, privateKey)
	}
	static ES512(
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string | undefined
	): Algorithm | undefined {
		return Algorithm.create("ES512", publicKey, privateKey)
	}
	static PS256(
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string | undefined
	): Algorithm | undefined {
		return Algorithm.create("PS256", publicKey, privateKey)
	}
	static PS384(
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string | undefined
	): Algorithm | undefined {
		return Algorithm.create("PS384", publicKey, privateKey)
	}
	static PS512(
		publicKey: Uint8Array | string | undefined,
		privateKey?: Uint8Array | string | undefined
	): Algorithm | undefined {
		return Algorithm.create("PS512", publicKey, privateKey)
	}
}
export namespace Algorithm {
	export type Name = AlgorithmName
	export namespace Name {
		export const is = AlgorithmName.is
		export type Symmetric = AlgorithmName.Symmetric
		export namespace Symmetric {
			export const is = AlgorithmName.Symmetric.is
		}
		export type Asymmetric = AlgorithmName.Asymmetric
		export namespace Asymmetric {
			export const is = AlgorithmName.Asymmetric.is
		}
	}
}
