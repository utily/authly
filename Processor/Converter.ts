import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { typedly } from "typedly"
import { Claims } from "../Claims"

export interface Converter<C, P, O extends Record<string, unknown> = any, E extends Claims = Claims> {
	encode: (value: C, { original, encoded }: Converter.Context.Encode<O, E>) => MaybePromise<P>
	decode: (value: P, { original, encoded }: Converter.Context.Decode<O, E>) => MaybePromise<C>
}
type MaybePromise<T> = T | Promise<T>
export namespace Converter {
	export namespace Context {
		export interface Encode<O extends Record<string, unknown> = any, E extends Claims = Claims> {
			original: O
			encoded: typedly.Promise.Promisify<E>
		}
		export interface Decode<O extends Record<string, unknown> = any, E extends Claims = Claims> {
			original: typedly.Promise.Promisify<O>
			encoded: E
		}
	}
	export function identity<T>(): Converter<T, T> {
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
			encode: async <O extends Record<string, unknown>, E extends Claims = Claims>(
				value: C,
				context: Converter.Context.Encode<O, E>
			): Promise<Uint8Array> => new TextEncoder().encode(await converter.encode(value, context)),
			decode: async <O extends Record<string, unknown>, E extends Claims = Claims>(
				value: Uint8Array,
				context: Converter.Context.Decode<O, E>
			): Promise<C> => converter.decode(new TextDecoder().decode(value), context),
		}
	}
}
