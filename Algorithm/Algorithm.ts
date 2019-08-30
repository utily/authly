import { TextEncoder } from "../TextEncoder"
import { Name as AlgorithmName } from "./Name"
import * as Base64 from "../Base64"

export abstract class Algorithm {
	abstract get name(): AlgorithmName
	async sign(data: Uint8Array): Promise<Uint8Array>
	async sign(data: string): Promise<string>
	async sign(data: string | Uint8Array): Promise<string | Uint8Array> {
		return typeof(data) == "string" ? Base64.encode(await this.signBinary(new TextEncoder().encode(data)), "url") : this.signBinary(data)
	}
	protected abstract signBinary(data: Uint8Array): Promise<Uint8Array>
	verify(data: string | Uint8Array, signature: string | Uint8Array): Promise<boolean> {
		if (typeof(signature) == "string")
			signature = Base64.decode(signature, "url")
		return typeof(data) == "string" ? this.verifyBinary(new TextEncoder().encode(data), signature) : this.verifyBinary(data, signature)
	}
	protected abstract verifyBinary(data: Uint8Array, signature: Uint8Array): Promise<boolean>

	static create(name: "none"): Algorithm | undefined
	static create(name: AlgorithmName.Symmetric, key: Uint8Array | string): Algorithm
	static create(name: AlgorithmName.Symmetric, key: Uint8Array | string | undefined): Algorithm | undefined
	static create(name: AlgorithmName.Asymmetric, publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string): Algorithm | undefined
	static create(name: AlgorithmName, publicKey?: Uint8Array | string, privateKey?: Uint8Array | string): Algorithm | undefined
	static create(name: AlgorithmName, publicKey?: Uint8Array | string, privateKey?: Uint8Array | string): Algorithm | undefined {
		const create = algorithms[name]
		return create && create([publicKey, privateKey])
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

	static RS256(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("RS256", publicKey, privateKey)
	}
	static RS384(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("RS384", publicKey, privateKey)
	}
	static RS512(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("RS512", publicKey, privateKey)
	}
	static ES256(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("ES256", publicKey, privateKey)
	}
	static ES384(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("ES384", publicKey, privateKey)
	}
	static ES512(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("ES512", publicKey, privateKey)
	}
	static PS256(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("PS256", publicKey, privateKey)
	}
	static PS384(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("PS384", publicKey, privateKey)
	}
	static PS512(publicKey: Uint8Array | string | undefined, privateKey?: Uint8Array | string | undefined): Algorithm | undefined {
		return Algorithm.create("PS512", publicKey, privateKey)
	}
}
const algorithms: { [name: string]: ((keys: [Uint8Array | string | undefined, Uint8Array | string | undefined]) => Algorithm | undefined) | undefined } = {}
export function register(name: AlgorithmName, create: ((keys: [Uint8Array | string | undefined, Uint8Array | string | undefined]) => Algorithm | undefined)) {
	algorithms[name] = create
}

// tslint:disable: no-shadowed-variable
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
