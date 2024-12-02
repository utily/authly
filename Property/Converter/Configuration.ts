import { isly } from "isly"
import { Payload } from "../../Payload"

type MaybePromise<T> = T | Promise<T> | Partial<number>
export type Configuration<T extends object = any> = {
	[P in keyof T]: {
		/** Returns the value to be included in the JWT. */
		encode: (value: T[P]) => MaybePromise<Payload.Value | undefined>
		/** Returns the value to be used in your application. */
		decode: (value: Payload.Value | undefined) => MaybePromise<T[P]>
	}
}
export namespace Configuration {
	export const type = isly.named<Configuration>(
		"authly.Property.Converter.Configuration<T>",
		isly.record(isly.string(), isly.object<Configuration[string]>({ encode: isly.function(), decode: isly.function() }))
	)
	export const is = type.is
	export const flaw = type.flaw
}
