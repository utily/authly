import { isly } from "isly"
import { Payload } from "../../Payload"

type MaybePromise<T> = T | Promise<T> | Partial<number>
export type Configuration<S extends Record<string, unknown> = Record<string, unknown>, T extends Payload = Payload> = {
	[P in keyof S]: {
		/** Returns the value to be included in the JWT. */
		encode: (value: S[P]) => MaybePromise<(P extends keyof T ? T[P] : Payload.Value) | undefined>
		/** Returns the value to be used in your application. */
		decode: (value: (P extends keyof T ? T[P] : Payload.Value) | undefined) => MaybePromise<S[P]>
	}
}
// {
// 	[P in keyof S]: P extends keyof T
// 		? {
// 				/** Returns the value to be included in the JWT. */
// 				encode: (value: S[P]) => MaybePromise<T[P] | undefined>
// 				/** Returns the value to be used in your application. */
// 				decode: (value: T[P] | undefined) => MaybePromise<S[P]>
// 		  }
// 		: never
// }
export namespace Configuration {
	export const type = isly.named<Configuration<Record<string, unknown>, Payload>>(
		"authly.Property.Converter.Configuration<T>",
		isly.record(
			isly.string(),
			isly.object<Configuration[keyof Configuration]>({
				encode: isly.function(),
				decode: isly.function(),
			})
		)
	)
	export const is = type.is
	export const flaw = type.flaw
}
