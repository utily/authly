import { Payload } from "../../Payload"
import { Configuration as ConverterConfiguration } from "./Configuration"

export class Converter {
	constructor(readonly configuration: ConverterConfiguration) {}

	async apply(payload: Payload | undefined): Promise<Payload | undefined> {
		return payload && this.convert(payload, "encode")
	}
	async reverse(payload: Payload | undefined): Promise<Payload | undefined> {
		return payload && this.convert(payload, "decode")
	}
	private convert(payload: Payload, direction: "encode" | "decode"): Promise<Payload> {
		return Object.entries(this.configuration).reduce<Promise<Payload>>(
			async (result, [key, mapping]) => await this.convertProperty(await result, key.split("."), mapping[direction]),
			Promise.resolve(payload)
		)
	}
	private async convertProperty(
		payload: Payload,
		property: string[],
		mapping: (value: Payload.Value) => Payload.Value | Promise<Payload.Value | undefined> | undefined
	): Promise<Payload> {
		const result = { ...payload }
		if (result[property[0]] != undefined)
			result[property[0]] =
				property.length == 1
					? await mapping(result[property[0]] as Payload)
					: await this.convertProperty(result[property[0]] as Payload, property.slice(1), mapping)
		return result
	}
}
export namespace Converter {
	export import Configuration = ConverterConfiguration
}
