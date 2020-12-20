import { Payload } from "../Payload"
import { Creatable } from "./Creatable"

export class Converter {
	constructor(readonly conversionMap: Creatable.Converter) {}

	async apply(payload: Payload | undefined): Promise<Payload | undefined> {
		return payload && this.convert(payload, true)
	}
	async reverse(payload: Payload | undefined): Promise<Payload | undefined> {
		return payload && this.convert(payload, false)
	}

	private async convert(payload: Payload, forward: boolean): Promise<Payload> {
		for (const key in this.conversionMap) {
			const fnction = forward ? this.conversionMap[key].forward : this.conversionMap[key].backward
			const property: string[] = key.split(".")
			payload = await this.convertProperty(payload, property, fnction)
		}
		return payload
	}
	private async convertProperty(
		payload: Payload,
		property: string[],
		fnction: (value: Payload.Value) => Payload.Value | Promise<Payload.Value | undefined> | undefined
	): Promise<Payload> {
		const result = { ...payload }
		if (result[property[0]])
			result[property[0]] =
				property.length == 1
					? await fnction(result[property[0]] as Payload)
					: await this.convertProperty(result[property[0]] as Payload, property.slice(1), fnction)
		return result
	}
}
