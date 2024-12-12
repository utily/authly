import { isly } from "isly"
import { Payload } from "../Payload"

export interface Transformer<S extends Record<string, unknown> = Record<string, unknown>, T extends Payload = Payload> {
	apply: (payload: S | undefined) => Promise<T | undefined> | T | undefined
	reverse: (payload: T | undefined) => Promise<S | undefined> | S | undefined
}
export namespace Transformer {
	export const type = isly.object<Transformer>(
		{ apply: isly.function(), reverse: isly.function() },
		"authly.Property.Transformer"
	)
	export const is = type.is
	export const flaw = type.flaw

	export function create<S extends Record<string, unknown>, T extends Payload>(
		transformer: Partial<Transformer<S, T>>
	): Transformer<S, T> {
		return {
			apply: transformer.apply ? transformer.apply : (v: S | undefined) => v as any,
			reverse: transformer.reverse ? transformer.reverse : (v: T | undefined) => v as any,
		}
	}
}
