import { cryptly } from "cryptly"
import { isoly } from "isoly"
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
	private async process(claims: Processor.Type.Payload<T>): Promise<Processor.Type.Claims<T>> {
		return await this.processor.encode(claims)
	}
	private issued(issued: isoly.DateTime | number): number {
		return typeof issued == "number" ? issued : isoly.DateTime.epoch(issued, "seconds")
	}
	async sign(
		payload: Processor.Type.Payload<Omit<T, keyof Processor.Type.Required>>,
		{ ...options }: Issuer.Options = {}
	): Promise<Token> {
		payload = {
			...payload,
			...(await (async name => ({
				[name]: (
					(await this.processor.decode({
						iat: options.issued == undefined ? this.time() : this.issued(options.issued),
					} as Processor.Type.Claims<T>)) as Processor.Type.Payload<T>
				)[name],
			}))(this.processor.name("iat"))),
			...(await (async name => ({
				[name]: (
					(await this.processor.decode({
						iss: this.issuer,
					} as Processor.Type.Claims<T>)) as Processor.Type.Payload<T>
				)[name],
			}))(this.processor.name("iss"))),
			...(await (async name => ({
				[name]: (
					(await this.processor.decode({
						aud: this.audience,
					} as Processor.Type.Claims<T>)) as Processor.Type.Payload<T>
				)[name],
			}))(this.processor.name("aud"))),
		}
		const encoder = new TextEncoder()
		const result = `${cryptly.Base64.encode(
			encoder.encode(JSON.stringify(this.header)),
			"url"
		)}.${cryptly.Base64.encode(
			encoder.encode(JSON.stringify(await this.process(payload as any as Processor.Type.Payload<T>))),
			"url"
		)}`
		return `${result}.${await this.algorithm.sign(result)}`
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
export namespace Issuer {
	export interface Options {
		issued?: isoly.DateTime | number
	}
}
