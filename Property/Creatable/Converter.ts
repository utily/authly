import { Payload } from "../../Payload"
export interface Converter {
	[key: string]: {
		forward: (value: Payload.Value) => Payload.Value
		backward: (value: Payload.Value) => Payload.Value
	}
}

export namespace Converter {
	export function is(value: Converter | any): value is Converter {
		return typeof value == "object" && Object.entries(value).every(v => typeof v == "function")
	}
}
