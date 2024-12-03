import { Payload } from "../../Payload"
import { Configuration as ConverterConfiguration } from "./Configuration"

export class Converter<S extends Record<string, unknown> = Record<string, unknown>, T extends Payload = Payload> {
	constructor(readonly configuration: ConverterConfiguration<S, T>) {}

	async apply(payload: S | undefined): Promise<T | undefined> {
		return payload && this.convert(payload, "encode")
	}
	async reverse(payload: T | undefined): Promise<S | undefined> {
		return payload && this.convert(payload, "decode")
	}
	private async convert(source: S, direction: "encode"): Promise<T>
	private async convert(target: T, direction: "decode"): Promise<S>
	private async convert(payload: Record<string, unknown>, direction: "encode" | "decode"): Promise<any> {
		return Object.entries(this.configuration).reduce<Promise<Payload>>(async (result, [key, mapping]) => {
			return await this.convertProperty({ ...(await result) }, key.split("."), (mapping as any)[direction])
		}, Promise.resolve({ ...payload } as Payload))
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
