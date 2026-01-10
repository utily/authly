import { isly } from "isly"

/**
 * JWT public claim names
 * https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
 */
export interface Claims {
	aud?: string // audience
	iss?: string // issuer
	iat?: number // issued at
	sub?: string // subject
	exp?: number // expires
	nbf?: number // not before
	jti?: string // JWT id
}
export namespace Claims {
	export const type = isly.object<Claims>({
		aud: isly.string().optional(),
		iss: isly.string().optional(),
		iat: isly.number().optional(),
		sub: isly.string().optional(),
		exp: isly.number().optional(),
		nbf: isly.number().optional(),
		jti: isly.string().optional(),
	})
}
