import { Payload } from "../Payload"
import { Transformer } from "./Transformer"

export class TypeGuard<T> implements Transformer {
	private readonly is: ((payload: T | any) => boolean)[]
	constructor(...is: ((payload: T | any) => boolean)[]) {
		this.is = is
	}
	apply(payload: Payload | undefined): Payload | undefined {
		return this.is.some(f => f(payload)) ? payload : undefined
	}
	reverse(payload: Payload | undefined): Payload | undefined {
		return this.is.some(f => f(payload)) ? payload : undefined
	}
}
