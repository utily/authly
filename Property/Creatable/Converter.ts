import { Payload } from "../../Payload"

type MaybePromise<T> = T | Promise<T>

type ConverterFunction<V extends Payload.Value> = V extends any
	? (value: V) => MaybePromise<Payload.Value | undefined>
	: never
export interface Converter {
	[key: string]: {
		/** Returns the value to be included in the jwt. */
		forward: ConverterFunction<Payload.Value>
		/** Returns the value to be used in your application. */
		backward: ConverterFunction<Payload.Value>
	}
}

export namespace Converter {
	export function is(value: Converter | any): value is Converter {
		return (
			typeof value == "object" &&
			Object.values(value).every(
				v =>
					v &&
					typeof v == "object" &&
					"forward" in v &&
					typeof v.forward == "function" &&
					"backward" in v &&
					typeof v.backward == "function"
			)
		)
	}
}
