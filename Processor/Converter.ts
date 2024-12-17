import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { Claims } from "../Claims"
import { Promisify } from "../Promisify"

export interface Converter<C, P, O extends Record<string, unknown> = any, E extends Claims = Claims> {
	encode: (value: C, { original, encoded }: Converter.Context.Encode<O, E>) => MaybePromise<P>
	decode: (value: P, { original, encoded }: Converter.Context.Decode<O, E>) => MaybePromise<C>
}
type MaybePromise<T> = T | Promise<T>
export namespace Converter {
	export namespace Context {
		export interface Encode<O extends Record<string, unknown> = any, E extends Claims = Claims> {
			original: O
			encoded: Promisify<E>
		}
		export interface Decode<O extends Record<string, unknown> = any, E extends Claims = Claims> {
			original: Promisify<O>
			encoded: E
		}
	}
	export function none<T>(): Converter<T, T> {
		return {
			encode: value => value,
			decode: value => value,
		}
	}
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
			encode: async (value: C, context: Converter.Context.Encode /* TODO: type args */): Promise<Uint8Array> =>
				new TextEncoder().encode(await converter.encode(value, context)),
			decode: async (value: Uint8Array, context: Converter.Context.Decode /* TODO: type args */): Promise<C> =>
				converter.decode(new TextDecoder().decode(value), context),
		}
	}
}
