import { cryptly } from "cryptly"
import { typedly } from "typedly"
import { Actor } from "./Actor"
import { Algorithm } from "./Algorithm"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { Processor } from "./Processor"
import { Token } from "./Token"

interface Components {
	header: string
	body: string
	signature: string | undefined
}

export class Verifier<T extends Processor.Type.Constraints<T>> extends Actor<T> {
	readonly algorithms?: { [name in Algorithm.Name]?: Algorithm[] }
	private constructor(processor: Processor<T>, algorithms: Algorithm[]) {
		super(processor)
		if (algorithms.length > 0)
			for (const algorithm of algorithms)
				this.algorithms = {
					...this.algorithms,
					[algorithm.name]: [...(this.algorithms?.[algorithm.name] ?? []), algorithm],
				}
	}
	private async decode(
		token: string | undefined
	): Promise<{ header: Header; payload: Payload; components: Components } | undefined> {
		let result: typedly.Function.Return<Verifier<T>["decode"]>
		const components = (([header, body, signature]: (string | undefined)[]) =>
			!header || !body ? undefined : { header, body, signature })(token?.split(".", 3) ?? [])
		if (components)
			try {
				const standard: cryptly.Base64.Standard = token?.match(/[/+]/) ? "standard" : "url"
				const decoder = new TextDecoder()
				const header: Header = JSON.parse(decoder.decode(cryptly.Base64.decode(components.header, standard)))
				const payload: Payload = JSON.parse(decoder.decode(cryptly.Base64.decode(components.body, standard)))
				payload.token = token
				result = !payload ? undefined : { header, payload, components }
			} catch {
				result = undefined
			}
		return result
	}
	private async verifySignature(header: Header, components: Components): Promise<boolean> {
		let result = false
		if (this.algorithms && components.signature) {
			const algorithms = this.algorithms[header.alg] ?? []
			for (const algorithm of algorithms)
				if (await algorithm.verify(`${components.header}.${components.body}`, components.signature)) {
					result = true
					break
				}
		}
		return result
	}
	private async transform(payload: Payload | undefined): Promise<Processor.Type.Claims<T> | undefined> {
		let result: Processor.Type.Claims<T> | undefined
		try {
			// TODO: scary cast. can we make it safer?
			//       clean undefined values from entering decode?
			result = payload && (await this.processor.decode(payload as Processor.Type.Payload<T>))
		} catch {
			result = undefined
		}
		return result
	}
	private verifyAudience(audience: string | string[] | undefined, allowed: string[]): boolean {
		return Array.isArray(audience)
			? audience.some(audience => this.verifyAudience(audience, allowed))
			: audience == undefined || allowed.length == 0 || allowed.some(allowed => allowed == audience)
	}
	async unpack(token: Token | undefined): Promise<Processor.Type.Claims<T> | undefined> {
		return await this.transform((await this.decode(token))?.payload)
	}
	async verify(token: Token | undefined, audiences: string[]): Promise<Processor.Type.Claims<T> | undefined> {
		const decoded = await this.decode(token)
		const now = this.time()
		return decoded &&
			(await this.verifySignature(decoded.header, decoded.components)) &&
			this.verifyAudience(decoded.payload.aud, audiences) &&
			(decoded.payload.exp == undefined || decoded.payload.exp > now) &&
			(decoded.payload.iat == undefined || decoded.payload.iat <= now + 60 || decoded.payload.iat <= now - 60)
			? await this.transform(decoded.payload)
			: undefined
	}
	static create<T extends Processor.Type.Constraints<T>>(
		configuration: Processor.Configuration<T>,
		algorithms: Algorithm[]
	): Verifier<T>
	static create<T extends Processor.Type.Constraints<T>>(processor: Processor<T>, algorithms: Algorithm[]): Verifier<T>
	static create<T extends Processor.Type.Constraints<T>>(
		source: Processor<T> | Processor.Configuration<T>,
		algorithms: Algorithm[]
	): Verifier<T> {
		return source instanceof Processor
			? new this(source, algorithms)
			: this.create(Processor.create(source), algorithms)
	}
}
export namespace Verifier {}
