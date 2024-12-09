import { cryptly } from "cryptly"
import { isoly } from "isoly"

export interface Converter<C, P> {
	encode: (value: C) => MaybePromise<P>
	decode: (value: P) => MaybePromise<C>
}
type MaybePromise<T> = T | Promise<T>
export namespace Converter {
	export const dateTime: Converter<isoly.DateTime, number> = {
		encode: (value: isoly.DateTime) => isoly.DateTime.epoch(value, "seconds"),
		decode: (value: number) => isoly.DateTime.create(value),
	}
	export const json: Converter<any, string> = {
		encode: (value: any): string => JSON.stringify(value),
		decode: (value: string): any => JSON.parse(value),
	}
	export const binary: Converter<ArrayBufferLike, cryptly.Base64> = {
		encode: (value: ArrayBuffer): cryptly.Base64 => cryptly.Base64.encode(value, "url"),
		decode: (value: cryptly.Base64): ArrayBuffer => cryptly.Base64.decode(value, "url"),
	}
	export function toBinary<C>(converter: Converter<C, string>): Converter<C, Uint8Array> {
		return {
			encode: async (value: C): Promise<Uint8Array> => new TextEncoder().encode(await converter.encode(value)),
			decode: async (value: Uint8Array): Promise<C> => converter.decode(new TextDecoder().decode(value)),
		}
	}
}
