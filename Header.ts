import { Algorithm } from "./Algorithm"

export interface Header {
	/**
	 * Algorithm
	 * - [RFC 7515:4.1.1](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.1)
	 * - [RFC 7518:3.1](https://www.rfc-editor.org/rfc/rfc7518#section-3.1)
	 */
	alg: Algorithm.Name
	typ: "JWT"
	cty?: "JWT" | string
	/**
	 * Key ID
	 * - [RFC 7515:4.1.4](https://www.rfc-editor.org/rfc/rfc7515#section-4.1.4)
	 */
	kid?: string
}
