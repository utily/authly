import { Creatable } from "./Creatable"
import { Payload } from "../Payload"

export class Converter {
	constructor(readonly conversionMap: Creatable.Converter) {}

	apply(payload: Payload): Payload {
		return this.convert(payload, true)
	}
	reverse(payload: Payload): Payload {
		return this.convert(payload, false)
	}
	private convert(payload: Payload, forward: boolean): Payload {
		const result: Payload = {}
		for (const key in payload) {
			if (key in this.conversionMap) {
				result[key] = this.resolve(
					payload[key],
					forward,
					forward ? this.conversionMap[key].forward : this.conversionMap[key].backward
				)
			} else
				result[key] = this.resolve(payload[key], forward)
		}
		return result
	}
	private resolve(
		payload: Payload.Value | undefined,
		forward: boolean,
		fnction?: (value: Payload.Value) => Payload.Value
	): Payload.Value {
		let result: any
		if (Array.isArray(payload)) {
			result = []
			payload.forEach(value => {
				result.push(this.resolve(value, forward, fnction))
			})
		} else {
			result =
				typeof payload == "object" ? this.convert(payload, forward) : fnction && payload ? fnction(payload) : payload
		}
		return result
	}
}
