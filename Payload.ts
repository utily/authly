export interface Payload extends Payload.Data {
	/** subject */ sub?: string
	/** issuer */ iss?: string
	/** audience */ aud?: string | string[]
	/** expires at */ exp?: number
	/** issued at */ iat?: number
}

export namespace Payload {
	export interface Data {
		[claim: string]: Value | undefined
	}
	export type Value = boolean | string | number | Data | Value[]
}
