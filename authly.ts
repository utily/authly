import { cryptly } from "cryptly"
import "./shim"
import { Actor } from "./Actor"
import { Algorithm } from "./Algorithm"
import { Issuer } from "./Issuer"
import { Payload } from "./Payload"
import * as Property from "./Property"
import { Token } from "./Token"
import { Verifier } from "./Verifier"

const Base16 = cryptly.Base16
const Base64 = cryptly.Base64
const Identifier = cryptly.Identifier
type Identifier = cryptly.Identifier
const Password = cryptly.Password
type Password = cryptly.Password
const TextDecoder = cryptly.TextDecoder
type TextDecoder = cryptly.TextDecoder
const TextEncoder = cryptly.TextEncoder
type TextEncoder = cryptly.TextEncoder

export {
	Actor,
	Algorithm,
	Base16,
	Base64,
	Identifier,
	Issuer,
	Password,
	Payload,
	Property,
	TextDecoder,
	TextEncoder,
	Token,
	Verifier,
}
