export type Type =
	"number" |
	"string" |
	"boolean" |
	"StringOrURI" |
	"NumericDate"

export namespace Type {
	export function is(value: any | Type): value is Type {
		return typeof(value) == "string" && (
			value == "number" ||
			value == "string" ||
			value == "boolean" ||
			value == "StringOrURI" ||
			value == "NumericDate"
		)
	}
}
