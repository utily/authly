import { isly } from "isly"
import { Converter } from "./Converter"
import { Crypto } from "./Crypto"
import { Renamer } from "./Renamer"

export type Configuration = Converter.Configuration | Crypto.Configuration | Renamer.Configuration

export namespace Configuration {
	export const type = isly.named<Configuration>(
		"authly.Property.Configuration",
		isly.union<Configuration, Converter.Configuration, Crypto.Configuration, Renamer.Configuration>(
			Converter.Configuration.type,
			Crypto.Configuration.type,
			Renamer.Configuration.type
		)
	)
	export const is = type.is
	export const flaw = type.flaw
}
