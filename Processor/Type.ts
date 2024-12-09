import { Payload } from "../Payload"

interface Property {
	name: string
	claim: any
	payload: Payload.Value
}

export type Type<T extends Type.Constraints<T> = NonNullable<object>> = {
	[Claim in keyof T]: {
		name: T[Claim]["name"]
		claim: T[Claim]["claim"]
		payload: T[Claim]["payload"]
	}
}
export namespace Type {
	export type Constraints<T> = { [property in keyof T]: Property }
	export type Claims<T extends Type.Constraints<T> = NonNullable<object>> = {
		[Claim in keyof T]: T[Claim]["claim"]
	}
	export type Payload<T extends Type.Constraints<T> = NonNullable<object>> = {
		[Claim in keyof T as T[Claim]["name"]]: T[Claim]["payload"]
	}
}
