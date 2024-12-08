import { Configuration as ProcessorConfiguration } from "./Configuration"
import { Decoder } from "./Decoder"
import { Encoder } from "./Encoder"
import { Type as ProcessorType } from "./Type"

export class Processor<P extends Processor.Type> {
	#encoder: Encoder<P> | undefined
	private get encoder(): Encoder<P> {
		return (this.#encoder ??= Encoder.create<P>(this.configuration))
	}
	#decoder: Decoder<P> | undefined
	private get decoder(): Decoder<P> {
		return (this.#decoder ??= Decoder.create<P>(this.configuration))
	}
	private constructor(readonly configuration: Processor.Configuration<P>) {}
	encode(claims: Processor.Type.Claims<P>): Processor.Type.Payload<P> {
		return this.encoder.process(claims)
	}
	decode(payload: Processor.Type.Payload<P>): Processor.Type.Claims<P> {
		return this.decoder.process(payload)
	}
	static create<P extends Processor.Type>(configuration: Processor.Configuration<P>): Processor<P> {
		return new Processor(configuration)
	}
}
export namespace Processor {
	export import Configuration = ProcessorConfiguration
	export import Type = ProcessorType
}
