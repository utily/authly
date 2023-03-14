import { Payload } from "../../Payload"

type MaybePromise<T> = T | Promise<T>

type ConverterFunction<V extends Payload.Value> = V extends any
	? (value: V) => MaybePromise<Payload.Value | undefined>
	: never

export interface Converter {
	[key: string]: {
		forward: ConverterFunction<Payload.Value>
		backward: ConverterFunction<Payload.Value>
	}
}

export namespace Converter {
	export function is(value: Converter | any): value is Converter {
		return typeof value == "object" && Object.entries(value).every(v => typeof v == "function")
	}
}
