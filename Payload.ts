export interface Payload {
	iss?: string
	sub?: string
	aud?: string
	exp?: string
	[claim: string]: string | undefined
}
