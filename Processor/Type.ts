import { Payload } from "../Payload"

export type Type<T extends Type<T> = NonNullable<object>> = {
	[Claim in keyof T]: {
		name: string
		claim: any
		payload: Payload.Value
	}
}

export namespace Type {
	export type Claims<T extends Type<T> = NonNullable<object>> = {
		[Claim in keyof T]: T[Claim]["claim"]
	}
	export type Payload<T extends Type<T> = NonNullable<object>> = {
		[Claim in keyof T as T[Claim]["name"]]: T[Claim]["payload"]
	}
}
