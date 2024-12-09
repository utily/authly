import { Type } from "./Type"

export type Configuration<T extends Type<T> = NonNullable<object>> = {
	[Claim in keyof T]: Configuration.Property<T[Claim]["claim"], T[Claim]["name"], T[Claim]["payload"]>
}
export namespace Configuration {
	export interface Property<ClaimValue, PayloadName, PayloadValue> {
		rename: PayloadName
		// remove?: boolean
		encode: (value: ClaimValue) => PayloadValue
		decode: (encoded: PayloadValue) => ClaimValue
		// encrypt?: string
	}
}
