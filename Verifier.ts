import * as base64Url from "base64-url"
import * as Algorithm from "./Algorithm"
import { Header } from "./Header"
import { Payload } from "./Payload"
import { Token } from "./Token"

export class Verifier {
	readonly algorithms: { [algorithm: string]: Algorithm.Base } = {}
	constructor(...algorithms: Algorithm.Base[]) {
		for (const algorithm of algorithms)
			this.algorithms[algorithm.name] = algorithm
	}
	verify(token: string | Token): Payload | undefined {
		const splitted = token.split(".", 3)
		const header: Header = JSON.parse(base64Url.decode(splitted[0]))
		const algorithm = this.algorithms[header.alg]
		const result: Payload | undefined = algorithm && algorithm.verify(token, splitted[2]) ? JSON.parse(base64Url.decode(splitted[1])) as Payload : undefined
		const now = Date.now()
		return result && (result.exp == undefined || result.exp > now) && (result.iat == undefined || result.iat <= now) ? result : undefined
	}
	authenticate(value: string): Payload | undefined {
		return req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? verifier.verify(req.headers.authorization.substr(7)) : undefined
	}
}
