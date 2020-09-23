import { Creatable } from "./Creatable"
import { Payload } from "../Payload"

/** TODO test empty conversionmap */
export class Converter {
	constructor(readonly conversionMap: Creatable.Converter) {}

	apply(payload: Payload | undefined): Payload | undefined {
		return payload && this.convert(payload, true)
	}
	reverse(payload: Payload | undefined): Payload | undefined {
		return payload && this.convert(payload, false)
	}

	private convert(payload: Payload, forward: boolean): Payload {
		for (const key in this.conversionMap) {
			const fnction = forward ? this.conversionMap[key].forward : this.conversionMap[key].backward
			const property: string[] = key.split(".")
			payload = this.convertProperty(payload, property, fnction)
		}
		return payload
	}
	private convertProperty(
		payload: Payload,
		property: string[],
		fnction: (value: Payload.Value) => Payload.Value
	): Payload {
		const result = { ...payload }
		if (result[property[0]])
			result[property[0]] =
				property.length == 1
					? fnction(result[property[0]] as Payload)
					: this.convertProperty(result[property[0]] as Payload, property.slice(1), fnction)
		return result
	}
}
