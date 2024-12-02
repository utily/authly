import { isly } from "isly"

export type Symmetric = typeof Symmetric.values[number]
export namespace Symmetric {
	export const values = ["HS256", "HS384", "HS512"] as const
	export const type = isly.named<Symmetric>("authly.Algorithm.Name.Symmetric", isly.string(values))
	export const is = type.is
	export const flaw = type.flaw
}
