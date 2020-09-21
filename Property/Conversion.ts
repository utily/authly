import { Payload } from "../Payload"
export interface Conversion {
	forward: (value: Payload.Value) => Payload.Value
	backward: (value: Payload.Value) => Payload.Value
}
