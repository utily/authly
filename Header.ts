import { Algorithm } from "./Algorithm"

export interface Header {
	alg: Algorithm.Name
	typ: "JWT"
	cty?: "JWT" | string
}
