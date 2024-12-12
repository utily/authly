import { Payload } from "../../Payload"
import { Transformer } from "../Transformer"
import { Configuration as RenamerConfiguration } from "./Configuration"

export class Renamer implements Transformer {
	private readonly mapping: { encode: Renamer.Configuration; decode: Renamer.Configuration }
	constructor(encode: Renamer.Configuration) {
		this.mapping = { encode, decode: Object.entries(encode).reduce((r, [key, value]) => ({ ...r, [value]: key }), {}) }
	}
	apply(payload: Payload | undefined): Payload | undefined {
		return payload && this.remap(payload, this.mapping.encode)
	}
	reverse(payload: Payload | undefined): Payload | undefined {
		return payload && this.remap(payload, this.mapping.decode)
	}
	private remap(payload: Payload, mapping: Renamer.Configuration): Payload {
		const result: Payload = {}
		for (const key in payload)
			if (key in mapping)
				result[mapping[key]] = this.resolve(payload[key], mapping)
			else
				result[key] = this.resolve(payload[key], mapping)
		return result
	}
	private resolve<T>(payload: T, mapping: Renamer.Configuration): T {
		let result: any
		if (Array.isArray(payload)) {
			result = []
			payload.forEach(value => result.push(this.resolve(value, mapping)))
		} else
			result = typeof payload == "object" ? this.remap(payload as unknown as Payload, mapping) : payload
		return result as T
	}
}
export namespace Renamer {
	export import Configuration = RenamerConfiguration
}
