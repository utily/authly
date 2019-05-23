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
	verify(data: string | Token): Payload | undefined {
		const splitted = data.split(".", 3)
		const header: Header = JSON.parse(base64Url.decode(splitted[0]))
		const algorithm = this.algorithms[header.alg]
		return algorithm && algorithm.verify(data, splitted[2]) ? JSON.parse(base64Url.decode(splitted[1])) : undefined
	}
}
