import { cryptly } from "cryptly"
import { Actor } from "./Actor"
import { Algorithm } from "./Algorithm"
import { Header } from "./Header"
import { Processor } from "./Processor"
import { Token } from "./Token"

export class Issuer<T extends Processor.Type.Constraints<T>> extends Actor<T> {
	private readonly header: Header
	private constructor(
		processor: Processor<T>,
		private readonly issuer: string,
		private readonly audience: string,
		readonly algorithm: Algorithm
	) {
		super(processor)
		this.header = { alg: algorithm.name, typ: "JWT", ...(algorithm.kid && { kid: algorithm.kid }) }
	}
	private async process(claims: Processor.Type.Claims<T>): Promise<Processor.Type.Payload<T>> {
		return await this.processor.encode(claims)
	}
	// TODO: replace Date with isoly.DateTime
	async sign(
		claims: Processor.Type.Claims<Omit<T, keyof Processor.Type.Required>>,
		issued?: Date | number
	): Promise<Token> {
		claims = {
			...(await (async name => ({
				[name]: (
					(await this.processor.decode({
						iat: typeof issued == "object" ? issued.getTime() / 1000 : issued ?? this.time(),
					} as Processor.Type.Payload<T>)) as Processor.Type.Claims<T>
				)[name],
			}))(this.processor.name("iat"))),
			...(await (async name => ({
				[name]: (
					(await this.processor.decode({ iss: this.issuer } as Processor.Type.Payload<T>)) as Processor.Type.Claims<T>
				)[name],
			}))(this.processor.name("iss"))),
			...(await (async name => ({
				[name]: (
					(await this.processor.decode({ aud: this.audience } as Processor.Type.Payload<T>)) as Processor.Type.Claims<T>
				)[name],
			}))(this.processor.name("aud"))),
			...claims,
		}
		const encoder = new TextEncoder()
		const payload = `${cryptly.Base64.encode(
			encoder.encode(JSON.stringify(this.header)),
			"url"
		)}.${cryptly.Base64.encode(
			encoder.encode(JSON.stringify(await this.process(claims as any as Processor.Type.Claims<T>))),
			"url"
		)}`
		return `${payload}.${await this.algorithm.sign(payload)}`
	}
	static create<T extends Processor.Type.Constraints<T>>(
		configuration: Processor.Configuration<T>,
		issuer: string,
		audience: string,
		algorithm: Algorithm
	): Issuer<T>
	static create<T extends Processor.Type.Constraints<T>>(
		processor: Processor<T>,
		issuer: string,
		audience: string,
		algorithm: Algorithm
	): Issuer<T>
	static create<T extends Processor.Type.Constraints<T>>(
		source: Processor<T> | Processor.Configuration<T>,
		issuer: string,
		audience: string,
		algorithm: Algorithm
	): Issuer<T> {
		return source instanceof Processor
			? new this(source, issuer, audience, algorithm)
			: this.create(Processor.create(source), issuer, audience, algorithm)
	}
}
export namespace Issuer {}
