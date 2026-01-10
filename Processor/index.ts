import { Configuration as ProcessorConfiguration } from "./Configuration"
import { Converter as ProcessorConverter } from "./Converter"
import { Decoder } from "./Decoder"
import { Encoder } from "./Encoder"
import { Encrypter as ProcessorEncrypter } from "./Encrypter"
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
	name<Claim extends keyof T>(claim: Claim): T[Claim]["name"] {
		return this.configuration[claim]["name"]
	}
	async encode(claims: Processor.Type.Payload<T>): Promise<Processor.Type.Claims<T>> {
		return await this.encoder.process(claims)
	}
	async decode(payload: Processor.Type.Claims<T>): Promise<Processor.Type.Payload<T>> {
		return await this.decoder.process(payload)
	}
	static create<T extends Processor.Type.Constraints<T>>(configuration: Processor.Configuration<T>): Processor<T> {
		return new this(configuration)
	}
}
export namespace Processor {
	export import Configuration = ProcessorConfiguration
	export import Converter = ProcessorConverter
	export import Type = ProcessorType
	export import Encrypter = ProcessorEncrypter
}
