export interface Payload extends Payload.Data {
	sub?: string // subject
	iss?: string // issuer
	aud?: string | string[] // audience
	exp?: number // expires at
	iat?: number // issued at
}
export namespace Payload {
	export interface Data {
		[claim: string]: Value | Value[] | undefined
	}
	export type Value = string | number | Data | Value[]
}
