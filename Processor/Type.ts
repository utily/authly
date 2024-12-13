import { Payload as AuthlyPayload } from "../Payload"

export type Type<T extends Type.Constraints<T> & Type.Required & Type.Optional> = {
	[Claim in keyof T]: {
		name: T[Claim]["name"]
		original: T[Claim]["original"]
		encoded: T[Claim]["encoded"]
	}
}
export namespace Type {
	export interface Property<T extends AuthlyPayload.Value = AuthlyPayload.Value> {
		name: string
		original: unknown
		encoded: T
	}
	export interface Required {
		iss: Property<string>
		iat: Property<number>
	}
	export interface Optional {
		aud?: Property<string>
		sub?: Property<string>
		exp?: Property<number>
		nbf?: Property<number>
		jti?: Property<string>
	}
	export type Constraints<T> = { [property in keyof T]: Property }
	// names on json
	export type Claims<T extends Type.Constraints<Omit<T, keyof Required>> = NonNullable<object>> = {
		[Claim in keyof T as T[Claim]["name"]]: T[Claim]["original"]
	}
	// names on jwt
	export type Payload<T extends Type.Constraints<T> = NonNullable<object>> = {
		[Claim in keyof T]: T[Claim]["encoded"]
	}
}
