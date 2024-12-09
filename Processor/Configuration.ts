import { Type } from "./Type"

export type Configuration<T extends Type.Constraints<T> = NonNullable<object>> = {
	[Claim in keyof T]: Configuration.Property<T, Claim>
}
export namespace Configuration {
	export type Property<T extends Type.Constraints<T>, P extends keyof T> = {
		name: T[P]["name"]
		// 	// remove?: boolean
		encode: (value: T[P]["claim"]) => T[P]["payload"]
		decode: (encoded: T[P]["payload"]) => T[P]["claim"]
		// 	// encrypt?: string
	}
}
