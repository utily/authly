import { isly } from "isly"

export interface Configuration {
	[key: string]: string
}
export namespace Configuration {
	export const type = isly.named<Configuration>(
		"authly.Property.Renamer.Configuration",
		isly.record<Configuration>(isly.string(), isly.string())
	)
	export const is = type.is
	export const flaw = type.flaw
}
