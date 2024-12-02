import "./shim"
import { Actor as authlyActor } from "./Actor"
import { Algorithm as authlyAlgorithm } from "./Algorithm"
import { Issuer as authlyIssuer } from "./Issuer"
import { Payload as authlyPayload } from "./Payload"
import * as authlyProperty from "./Property"
import { Token as authlyToken } from "./Token"
import { Verifier as authlyVerifier } from "./Verifier"

export namespace authly {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export import Actor = authlyActor
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export import Algorithm = authlyAlgorithm
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export import Issuer = authlyIssuer
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export import Payload = authlyPayload
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export import Property = authlyProperty
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export import Token = authlyToken
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export import Verifier = authlyVerifier
}
