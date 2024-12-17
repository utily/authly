import { typedly } from "typedly"
import { Converter } from "./Converter"
import { Type } from "./Type"

export type Configuration<T extends Type.Constraints<T> = Type.Required> = {
	[Claim in keyof T]: Configuration.Property<T, Claim>
}
export namespace Configuration {
	export type Property<T extends Type.Constraints<T>, P extends keyof T> = {
		name: T[P]["name"]
		encode: (
			value: T[P]["original"],
			context: Converter.Context.Encode<Type.Payload<T>, Type.Claims<T>>
		) => typedly.Promise.Maybe<T[P]["encoded"]>
		decode: (
			value: T[P]["encoded"],
			context: Converter.Context.Decode<Type.Payload<T>, Type.Claims<T>>
		) => typedly.Promise.Maybe<T[P]["original"]>
	}
}
