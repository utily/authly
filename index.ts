import "./shim"
import { Actor as authlyActor } from "./Actor"
import { Algorithm as authlyAlgorithm } from "./Algorithm"
import { Issuer as authlyIssuer } from "./Issuer"
import { Processor as authlyProcessor } from "./Processor"
import { Token as authlyToken } from "./Token"
import { Verifier as authlyVerifier } from "./Verifier"

export namespace authly {
	export import Actor = authlyActor
	export import Algorithm = authlyAlgorithm
	export import Issuer = authlyIssuer
	export import Processor = authlyProcessor
	export import Token = authlyToken
	export import Verifier = authlyVerifier
}
