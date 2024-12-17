import { typedly } from "typedly"

export type Type<T extends Type.Constraints<T> & Type.Required & Type.Optional> = {
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
	export interface Required {
		aud: Property<string>
		iss: Property<string>
		iat: Property<number>
	}
	export interface Optional {
		sub?: Property<string>
		exp?: Property<number>
		nbf?: Property<number>
		jti?: Property<string>
	}
	export type Constraints<T> = { [property in keyof T]: Property } &
		typedly.Object.Optional<Type.Required, keyof Type.Required> &
		typedly.Object.Optional<Type.Optional, keyof Type.Optional>
	// names on json
	export type Payload<T extends Type.Constraints<Omit<T, keyof Required>> = NonNullable<object>> = {
		[Claim in keyof T as T[Claim]["name"]]: T[Claim]["original"]
	} & {}
	// names on jwt
	export type Claims<T extends Type.Constraints<T> = NonNullable<object>> = {
		[Claim in keyof T]: T[Claim]["encoded"]
	}
}
