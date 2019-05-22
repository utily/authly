export interface Payload {
	sub?: string // subject
	iss?: string // issuer
	aud?: string // audience
	exp?: number // expires at
	iat?: number // issued at
	[claim: string]: string | number | undefined
}
