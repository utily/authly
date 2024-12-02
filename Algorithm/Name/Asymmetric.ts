import { isly } from "isly"

export type Asymmetric = typeof Asymmetric.values[number]

export namespace Asymmetric {
	export const values = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "PS256", "PS384", "PS512"] as const
	export const type = isly.named<Asymmetric>("authly.Algorithm.Name.Asymmetric", isly.string(values))
	export const is = type.is
	export const flaw = type.flaw
}
