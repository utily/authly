import { Payload } from "../Payload"

interface Property<T extends Payload.Value = Payload.Value> {
	name: string
	claim: unknown
	payload: T
}

export type Type<T extends Type.Constraints<T>> = {
	[Claim in keyof T]: {
		name: T[Claim]["name"]
		claim: T[Claim]["claim"]
		payload: T[Claim]["payload"]
	}
}
export namespace Type {
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
	export type Constraints<T> = { [property in keyof T]: Property } & Required & Optional
	// names on json
	export type Claims<T extends Type.Constraints<T> = Required> = {
		[Claim in keyof T as T[Claim]["name"]]: T[Claim]["claim"]
	}
	// names on jwt
	export type Payload<T extends Type.Constraints<T> = Required> = {
		[Claim in keyof T]: T[Claim]["payload"]
	}
}
