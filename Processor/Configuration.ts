import { Type } from "./Type"

type MaybePromise<T> = T | Promise<T>
export type Configuration<T extends Type.Constraints<T> = Type.Required> = {
	[Claim in keyof T]: Configuration.Property<T, Claim>
}
export namespace Configuration {
	export type Property<T extends Type.Constraints<T>, P extends keyof T> = {
		name: T[P]["name"]
		// 	// remove?: boolean
		encode: (value: T[P]["original"]) => MaybePromise<T[P]["encoded"]>
		decode: (value: T[P]["encoded"]) => MaybePromise<T[P]["original"]>
		// 	// encrypt?: string
	}
}
