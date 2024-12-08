import { Payload } from "../Payload"

export type Type = {
	[Claim in string]: {
		name: string
		claim: any
		payload: Payload[string]
	}
}

export namespace Type {
	export type Claims<T extends Type> = {
		[Claim in keyof T]: T[Claim]["claim"]
	}
	export type Payload<T extends Type> = {
		[Claim in keyof T as T[Claim]["name"]]: T[Claim]["payload"]
	}
}
