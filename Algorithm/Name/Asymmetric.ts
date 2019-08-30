export type Asymmetric =
	"RS256" |
	"RS384" |
	"RS512" |
	"ES256" |
	"ES384" |
	"ES512" |
	"PS256" |
	"PS384" |
	"PS512"

export namespace Asymmetric{
	export function is(value: any | Asymmetric): value is Asymmetric {
		return value == "RS256" ||
			value == "RS384" ||
			value == "RS512" ||
			value == "ES256" ||
			value == "ES384" ||
			value == "ES512" ||
			value == "PS256" ||
			value == "PS384" ||
			value == "PS512"
	}
}
