import { isly } from "isly"
import { Payload } from "../Payload"

export interface Transformer {
	apply: (payload: Payload | undefined) => Promise<Payload | undefined> | Payload | undefined
	reverse: (payload: Payload | undefined) => Promise<Payload | undefined> | Payload | undefined
}
export namespace Transformer {
	export const type = isly.object<Transformer>(
		{ apply: isly.function(), reverse: isly.function() },
		"authly.Property.Transformer"
	)
	export const is = type.is
	export const flaw = type.flaw

	export function create(transformer: Partial<Transformer>): Transformer {
		return {
			apply: transformer.apply ? transformer.apply : (v: Payload | undefined) => v,
			reverse: transformer.reverse ? transformer.reverse : (v: Payload | undefined) => v,
		}
	}
}
