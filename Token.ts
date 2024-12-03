import { isly } from "isly"

export type Token = string

export namespace Token {
	export const type = isly.named<Token>(
		"authly.Token",
		isly.string(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
	)
	export const is = type.is
	export const flaw = type.flaw
}
