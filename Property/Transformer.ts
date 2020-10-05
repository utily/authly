import { Payload } from "../Payload"

export interface Transformer {
	apply: (payload: Payload | undefined) => Promise<Payload | undefined> | Payload | undefined
	reverse: (payload: Payload | undefined) => Promise<Payload | undefined> | Payload | undefined
}
export namespace Transformer {
	export function is(value: Transformer | any): value is Transformer {
		return typeof value == "object" && typeof value.apply == "function" && typeof value.reverse == "function"
	}

	export function create(transformer: Partial<Transformer>): Transformer {
		return {
			apply: transformer.apply ? transformer.apply : (v: Payload | undefined) => v,
			reverse: transformer.reverse ? transformer.reverse : (v: Payload | undefined) => v,
		}
	}
}
