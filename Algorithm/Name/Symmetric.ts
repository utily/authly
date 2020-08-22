export type Symmetric = "HS256" | "HS384" | "HS512"

export namespace Symmetric {
	export function is(value: any | Symmetric): value is Symmetric {
		return value == "HS256" || value == "HS384" || value == "HS512"
	}
}
