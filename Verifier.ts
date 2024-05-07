import { Base64, TextDecoder } from "cryptly"
import { Actor } from "./Actor"
import { Algorithm } from "./Algorithm"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { Token } from "./Token"

export class Verifier<T extends Payload> extends Actor<Verifier<T>> {
	readonly algorithms: { [algorithm: string]: Algorithm[] } | undefined
	private constructor(...algorithms: Algorithm[]) {
		super()
		if (algorithms.length > 0) {
			this.algorithms = {}
			for (const algorithm of algorithms)
				if (this.algorithms[algorithm.name])
					this.algorithms[algorithm.name].push(algorithm)
				else
					this.algorithms[algorithm.name] = [algorithm]
		} else
			this.algorithms = undefined
	}
	async verify(token: string | Token | undefined, ...audience: string[]): Promise<T | undefined> {
		let result: Payload | undefined = undefined
		if (token) {
			const splitted = token.split(".", 3)
			if (splitted.length == 3) {
				try {
					const oldDecoder = token.includes("/") || token.includes("+") // For backwards compatibility.
					const header: Header = JSON.parse(
						new TextDecoder().decode(Base64.decode(splitted[0], oldDecoder ? "standard" : "url"))
					)
					if (await this.verifySignature(header, splitted)) {
						result = JSON.parse(
							new TextDecoder().decode(Base64.decode(splitted[1], oldDecoder ? "standard" : "url"))
						) as Payload
					}
				} catch {
					// Keep result undefined
				}
				result = result && this.verifyAudience(result.aud, audience) ? result : undefined
				if (result) {
					const now = Verifier.now
					if (result?.iat && result.iat > 1000000000000)
						result.iat = Math.floor(result.iat / 1000)
					if (result?.exp && result.exp > 1000000000000)
						result.exp = Math.floor(result.exp / 1000)
					result =
						!this.algorithms ||
						((result.exp == undefined || result.exp > now) && (result.iat == undefined || result.iat <= now + 60))
							? result
							: undefined
				}
				if (result) {
					result.token = token
					result = await this.transformers.reduceRight(async (p, c) => c.reverse(await p), Promise.resolve(result))
				}
			}
		}
		return result as T | undefined
	}
	private async verifySignature(header: Header, splitted: string[]) {
		let result = false
		if (this.algorithms) {
			const algorithms = this.algorithms[header.alg]
			for (const currentAlgorithm of algorithms) {
				if (await currentAlgorithm.verify(`${splitted[0]}.${splitted[1]}`, splitted[2])) {
					result = true
					break
				}
			}
		} else {
			result = true // This verifier is used without signature-checking
		}
		return result
	}
	private verifyAudience(audience: undefined | string | string[], allowed: string[]): boolean {
		return (
			audience == undefined ||
			allowed.length == 0 ||
			(typeof audience == "string" && allowed.some(a => a == audience)) ||
			(Array.isArray(audience) && audience.some(a => allowed.some(ta => ta == a)))
		)
	}
	async authenticate(authorization: string | Token | undefined, ...audience: string[]): Promise<T | undefined> {
		return authorization && authorization.startsWith("Bearer ")
			? this.verify(authorization.substr(7), ...audience)
			: undefined
	}
	private static get now(): number {
		return Verifier.staticNow == undefined
			? Math.floor(Date.now() / 1000)
			: typeof Verifier.staticNow == "number"
			? Verifier.staticNow
			: Math.floor(Verifier.staticNow.getTime() / 1000)
	}
	static staticNow: undefined | Date | number
	static create<T extends Payload>(): Verifier<T>
	static create<T extends Payload>(...algorithms: Algorithm[]): Verifier<T>
	static create<T extends Payload>(...algorithms: (Algorithm | undefined)[]): Verifier<T> | undefined
	static create<T extends Payload>(...algorithms: (Algorithm | undefined)[]): Verifier<T> | undefined {
		return (
			((algorithms.length == 0 || algorithms.some(a => !!a)) &&
				new Verifier(...(algorithms.filter(a => !!a) as Algorithm[]))) ||
			undefined
		)
	}
}
