export interface Claims {
	aud?: string // audience
	iss?: string
	iat?: number
	sub?: string
	exp?: number
	nbf?: number
	jti?: string
}
export namespace Claims {
	// TODO: type + is
}
