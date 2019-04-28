import { Claim } from "./Claim"

export interface Claims {
	issuer?: { type: "StringOrURI", abbreviation: "iss" }
	subject?: { type: "StringOrURI", abbreviation: "sub" }
	audience?: { type: "StringOrURI", abbreviation: "aud" }
	expires: { type: "NumericDate", abbreviation: "exp" }
	notBefore: { type: "NumericDate", abbreviation: "nbf" }
	issuedAt: { type: "NumericDate", abbreviation: "iat" }
	[claim: string]: Claim
}
