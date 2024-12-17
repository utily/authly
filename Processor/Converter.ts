import { cryptly } from "cryptly"
import { isoly } from "isoly"

export interface Converter<C, P> {
	encode: (value: C) => MaybePromise<P>
	decode: (value: P) => MaybePromise<C>
}
type MaybePromise<T> = T | Promise<T>
export function Converter<T>(): Converter<T, T> {
	return {
		encode: value => value,
		decode: value => value,
	}
}
export namespace Converter {
	export function dateTime(): Converter<isoly.DateTime, number> {
		return {
			encode: value => isoly.DateTime.epoch(value, "seconds"),
			decode: value => isoly.DateTime.create(value),
		}
	}
	export function json<T>(): Converter<T, string> {
		return {
			encode: value => JSON.stringify(value),
			decode: value => JSON.parse(value),
		}
	}
	export function binary(): Converter<ArrayBufferLike, cryptly.Base64> {
		return {
			encode: (value: ArrayBuffer): cryptly.Base64 => cryptly.Base64.encode(value, "url"),
			decode: (value: cryptly.Base64): ArrayBuffer => cryptly.Base64.decode(value, "url"),
		}
	}
	export function toBinary<C>(converter: Converter<C, string>): Converter<C, Uint8Array> {
		return {
			encode: async (value: C): Promise<Uint8Array> => new TextEncoder().encode(await converter.encode(value)),
			decode: async (value: Uint8Array): Promise<C> => converter.decode(new TextDecoder().decode(value)),
		}
	}
}
