import { isly } from "isly"

export type Configuration = string[]
export namespace Configuration {
	export const type = isly.named<Configuration>("authly.Property.Crypto.Configuration", isly.string().array())
	export const is = type.is
	export const flaw = type.flaw
}
