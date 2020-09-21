import { Payload } from "../Payload"

export interface Transformer {
	apply: (payload: Payload) => Promise<Payload> | Payload
	reverse: (payload: Payload) => Promise<Payload> | Payload
}
