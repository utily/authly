export type Password = string | Password.Hash
import { crypto } from "./crypto"
import { Base64 } from "cryptly"
import { Algorithm } from "./Algorithm"

export namespace Password {
	export function is(value: any | Password): value is Password {
		return (
			typeof value == "string" ||
			(typeof value == "object" && typeof value.hash == "string" && typeof value.salt == "string")
		)
	}
	export async function hash(algorithm: Algorithm, password: string, salt?: string): Promise<Hash> {
		if (!salt)
			salt = Base64.encode(crypto.getRandomValues(new Uint8Array(64)))
		return {
			hash: await algorithm.sign(salt + password),
			salt,
		}
	}
	export async function verify(algorithm: Algorithm, hash: Hash, password: string): Promise<boolean> {
		return (await Password.hash(algorithm, password, hash.salt)).hash == hash.hash
	}
	export interface Hash {
		hash: string
		salt: string
	}
	export namespace Hashed {
		export function is(value: any | Hash): value is Hash {
			return typeof value == "object" && typeof value.hash == "string" && typeof value.salt == "string"
		}
	}
}
