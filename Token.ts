export type Token = string

export namespace Token {
	export function is(value: Token | any): value is Token {
		return typeof value == "string" && /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(value)
	}
}
