import { Configuration as ProcessorConfiguration } from "./Configuration"
import { Decoder } from "./Decoder"
import { Encoder } from "./Encoder"
import { Type as ProcessorType } from "./Type"

export class Processor<T extends Processor.Type.Constraints<T>> {
	#encoder: Encoder<T> | undefined
	private get encoder(): Encoder<T> {
		return (this.#encoder ??= Encoder.create<T>(this.configuration))
	}
	#decoder: Decoder<T> | undefined
	private get decoder(): Decoder<T> {
		return (this.#decoder ??= Decoder.create<T>(this.configuration))
	}
	private constructor(readonly configuration: Processor.Configuration<T>) {}
	encode(claims: Processor.Type.Claims<T>): Processor.Type.Payload<T> {
		return this.encoder.process(claims)
	}
	decode(payload: Processor.Type.Payload<T>): Processor.Type.Claims<T> {
		return this.decoder.process(payload)
	}
	static create<T extends Processor.Type.Constraints<T>>(configuration: Processor.Configuration<T>): Processor<T> {
		return new Processor(configuration)
	}
}
export namespace Processor {
	export import Configuration = ProcessorConfiguration
	export import Type = ProcessorType
}
