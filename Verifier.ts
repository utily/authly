import { cryptly } from "cryptly"
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
	private async decode(
		token: string | Token | undefined
	): Promise<{ header: Header; payload: Payload; signature: string; splitted: [string, string, string] } | undefined> {
		let result: Awaited<ReturnType<Verifier<T>["decode"]>>
		const splitted = token?.split(".", 3)
		if (splitted?.length != 3)
			result = undefined
		else {
			try {
				const standard: cryptly.Base64.Standard = token?.match(/[/+]/) ? "standard" : "url"
				const decoder = new cryptly.TextDecoder()
				const header: Header = JSON.parse(decoder.decode(cryptly.Base64.decode(splitted[0], standard)))
				const payload: Payload | undefined = JSON.parse(
					decoder.decode(cryptly.Base64.decode(splitted[1], standard))
				) as Payload
				if (payload.iat && payload.iat > 1000000000000)
					payload.iat = Math.floor(payload.iat / 1000)
				if (payload.exp && payload.exp > 1000000000000)
					payload.exp = Math.floor(payload.exp / 1000)
				payload.token = token
				result = !payload
					? undefined
					: { header, payload, signature: splitted[2], splitted: [splitted[0], splitted[1], splitted[2]] }
			} catch {
				result = undefined
			}
		}
		return result
	}
	private async transform(payload: Payload | undefined): Promise<T | undefined> {
		const result = await this.transformers.reduceRight(async (p, c) => c.reverse(await p), Promise.resolve(payload))
		return result as T | undefined
	}
	private async verifySignature(header: Header, splitted: string[]): Promise<boolean> {
		let result = false
		if (this.algorithms) {
			const algorithms = this.algorithms[header.alg] ?? []
			for (const currentAlgorithm of algorithms) {
				if (await currentAlgorithm.verify(`${splitted[0]}.${splitted[1]}`, splitted[2])) {
					result = true
					break
				}
			}
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
	async unpack(token: string | Token | undefined): Promise<T | undefined> {
		return await this.transform((await this.decode(token))?.payload)
	}
	async verify(token: string | Token | undefined, ...audience: string[]): Promise<T | undefined> {
		let result: T | undefined
		const decoded = await this.decode(token)
		const now = Verifier.now
		if (!decoded)
			result = undefined
		else if (!(await this.verifySignature(decoded.header, decoded.splitted)))
			result = undefined
		else if (!this.verifyAudience(decoded.payload.aud, audience))
			result = undefined
		else if (
			!(decoded.payload.exp == undefined || decoded.payload.exp > now) ||
			!(decoded.payload.iat == undefined || decoded.payload.iat <= now + 60 || decoded.payload.iat <= now - 60)
		)
			result = undefined
		else
			result = await this.transform(decoded.payload)
		return result
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
