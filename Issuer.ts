import { Actor } from "./Actor"
import { Algorithm } from "./Algorithm"
import { Payload } from "./Payload"
import { Processor } from "./Processor"

export class Issuer<T extends Processor.Type.Constraints<T>> extends Actor<T> {
	private constructor(processor: Processor<T>, private readonly issuer: string, readonly algorithm: Algorithm) {
		super(processor)
	}
	private async transform(claims: Processor.Type.Claims<T>): Promise<Processor.Type.Payload<T>> {
		return await this.processor.encode(claims)
	}
	// TODO: replace Date with isoly.DateTime
	async sign(payload: Processor.Type.Claims<T>, issued?: Date | number): Promise<Processor.Type.Payload<T>> {
		const data: Processor.Type.Claims<T> & Payload = {
			iss: this.issuer,
			iat: typeof issued == "object" ? issued.getTime() / 1000 : issued ?? this.time(),
			...payload,
		}
		const transformed = await this.transform(data)
		return
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
