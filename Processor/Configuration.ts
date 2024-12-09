import { Type } from "./Type"

type MaybePromise<T> = T | Promise<T>
export type Configuration<T extends Type.Constraints<T> = NonNullable<object>> = {
	[Claim in keyof T]: Configuration.Property<T, Claim>
}
export namespace Configuration {
	export type Property<T extends Type.Constraints<T>, P extends keyof T> = {
		name: T[P]["name"]
		// 	// remove?: boolean
		encode: (value: T[P]["claim"]) => MaybePromise<T[P]["payload"]>
		decode: (value: T[P]["payload"]) => MaybePromise<T[P]["claim"]>
		// 	// encrypt?: string
	}
}
