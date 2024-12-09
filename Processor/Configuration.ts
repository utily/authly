import { Type } from "./Type"

export type Configuration<T extends Type.Constraints<T> = NonNullable<object>> = {
	// [Claim in keyof T]: Configuration.Property<T[Claim]["claim"], T[Claim]["name"], T[Claim]["payload"]>
	[Claim in keyof T]: Configuration.Property<T, Claim>
}
export namespace Configuration {
	export type Property<T extends Type.Constraints<T>, P extends keyof T> = {
		name: T[P]["name"]
		encode: (value: T[P]["claim"]) => T[P]["payload"]
		decode: (encoded: T[P]["payload"]) => T[P]["claim"]
	}
	// export interface Prop<T extends Type<T>> {
	// 	name:
	// }
	// export interface Property<ClaimValue, PayloadName, PayloadValue> {
	// 	name: PayloadName
	// 	// remove?: boolean
	// 	encode: (value: ClaimValue) => PayloadValue
	// 	decode: (encoded: PayloadValue) => ClaimValue
	// 	// encrypt?: string
	// }
}
