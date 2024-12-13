import { cryptly } from "cryptly"
import { Actor } from "./Actor"
import { Algorithm } from "./Algorithm"
import { Header } from "./Header"
import { Processor } from "./Processor"
import { Token } from "./Token"

export class Issuer<T extends Processor.Type.Constraints<T>> extends Actor<T> {
	private readonly header: Header
	private constructor(processor: Processor<T>, private readonly issuer: string, readonly algorithm: Algorithm) {
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
		const data: Processor.Type.Claims<T> = {
			iss: this.issuer,
			iat: typeof issued == "object" ? issued.getTime() / 1000 : issued ?? this.time(),
			...claims,
		}
		const transformed = await this.process(data)
		const encoder = new TextEncoder()
		const payload = `${cryptly.Base64.encode(
			encoder.encode(JSON.stringify(this.header)),
			"url"
		)}.${cryptly.Base64.encode(encoder.encode(JSON.stringify(transformed)), "url")}`
		return `${payload}.${await this.algorithm.sign(payload)}`
	}
	static create<T extends Processor.Type.Constraints<T>>(
		configuration: Processor.Configuration<T>,
		issuer: string,
		algorithm: Algorithm
	): Issuer<T>
	static create<T extends Processor.Type.Constraints<T>>(
		processor: Processor<T>,
		issuer: string,
		algorithm: Algorithm
	): Issuer<T>
	static create<T extends Processor.Type.Constraints<T>>(
		source: Processor<T> | Processor.Configuration<T>,
		issuer: string,
		algorithm: Algorithm
	): Issuer<T> {
		return source instanceof Processor
			? new this(source, issuer, algorithm)
			: this.create(Processor.create(source), issuer, algorithm)
	}
}
export namespace Issuer {}
