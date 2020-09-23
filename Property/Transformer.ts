import { Payload } from "../Payload"
/** TODO Typeguard transformer */
export interface Transformer {
	apply: (payload: Payload | undefined) => Promise<Payload | undefined> | Payload | undefined
	reverse: (payload: Payload | undefined) => Promise<Payload | undefined> | Payload | undefined
}
