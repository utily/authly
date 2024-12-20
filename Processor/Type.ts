import { Claims as authlyClaims } from "../Claims"

export type Type<T extends Type.Constraints<T> & Type.Standard> = {
	[Claim in keyof T]: {
		name: T[Claim]["name"]
		original: T[Claim]["original"]
		encoded: T[Claim]["encoded"]
	}
}
export namespace Type {
	export interface Property<T extends Property.Data.Value = Property.Data.Value> {
		name: string
		original: unknown
		encoded: T
	}
	export namespace Property {
		export type Data = Data.Data
		export namespace Data {
			export interface Data {
				[claim: string]: Value | undefined
			}
			export type Value = boolean | string | number | Data | Value[]
		}
	}
	export type Standard = {
		[P in keyof authlyClaims]?: Property<Required<authlyClaims>[P]>
	}
	export type Constraints<T> = { [property in keyof T]: Property } & Standard

	export type Payload<T extends Type.Constraints<T> = Standard> = {
		[Claim in keyof T as T[Claim]["name"]]: T[Claim]["original"]
	}
	export namespace Payload {
		export type Creatable<T extends Type.Constraints<T>> = {
			[Claim in keyof Omit<T, "aud" | "iss" | "iat"> as T[Claim]["name"]]: T[Claim]["original"]
		}
	}
	export type Claims<T extends Type.Constraints<T> = NonNullable<object>> = {
		[Claim in keyof T]: T[Claim]["encoded"]
	}
}
