import { Type } from "./Type"

export type Configuration<P extends Type> = {
	[Claim in keyof Type.Claims<P>]: Configuration.Property<P[Claim]["claim"], P[Claim]["name"], P[Claim]["payload"]>
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
