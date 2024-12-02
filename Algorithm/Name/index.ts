import { isly } from "isly"
import { Asymmetric as NameAsymmetric } from "./Asymmetric"
import { Symmetric as NameSymmetric } from "./Symmetric"

export type Name = "none" | Name.Symmetric | Name.Asymmetric

export namespace Name {
	export import Symmetric = NameSymmetric
	export import Asymmetric = NameAsymmetric
	export const type = isly.named<Name>(
		"authly.Algorithm.Name",
		isly.union<Name, "none", Symmetric, Asymmetric>(isly.string("none"), Symmetric.type, Asymmetric.type)
	)
	export const is = type.is
	export const flaw = type.flaw
}
