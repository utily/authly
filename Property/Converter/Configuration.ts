import { isly } from "isly"
import { Payload } from "../../Payload"

type Mapping<TObject> = TObject extends Array<unknown>
	? never
	: {
			[TKey in keyof TObject as string]: TKey extends string | number
				? TObject[TKey] extends Array<unknown>
					? `${TKey}`
					: TObject[TKey] extends Record<any, any>
					? DotNotation<TObject[TKey]> extends string | number
						? `${TKey}` | `${TKey}.${DotNotation<TObject[TKey]>}`
						: never
					: `${TKey}`
				: never
	  }
type DotNotation<TObject> = TObject extends string | number ? `${TObject}` : Mapping<TObject>[keyof Mapping<TObject>]

type GetValue<P extends string, Source extends Record<string, any>> = P extends keyof Source
	? Source[P]
	: P extends `${infer Head}.${infer Tail}`
	? GetValue<Tail, Source[Head]>
	: Source[P]

type MaybePromise<T> = T | Promise<T> | Partial<number>
export type Configuration<S extends Record<string, unknown> = Record<string, unknown>, T extends Payload = Payload> = {
	[P in DotNotation<S>]?: {
		encode: (
			value: GetValue<P, S>
		) => MaybePromise<(P extends DotNotation<T> ? GetValue<P, T> : Payload.Value) | undefined>
		decode: (
			value: (P extends DotNotation<T> ? GetValue<P, T> : Payload.Value) | undefined
		) => MaybePromise<GetValue<P, S>> | undefined
	}
}

export namespace Configuration {
	export const type = isly.named<Configuration<Record<string, unknown>, Payload>>(
		"authly.Property.Converter.Configuration<T>",
		isly.record<Configuration>(
			isly.string(),
			isly
				.object<{ encode: (...params: any[]) => any; decode: (...params: any[]) => any }>({
					encode: isly.function(),
					decode: isly.function(),
				})
				.optional()
		)
	)
	export const is = type.is
	export const flaw = type.flaw
}
