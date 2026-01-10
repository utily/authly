import { typedly } from "typedly"
import { Configuration } from "./Configuration"
import { Converter } from "./Converter"
import { Type } from "./Type"

export class Decoder<T extends Type.Constraints<T>> {
	private constructor(private readonly properties: Decoder.Properties<T>) {}
	async process(payload: Type.Claims<T>): Promise<Type.Payload<T>> {
		const resolvers: { [Key in keyof Type.Claims<T>]?: (value: any) => void } = {}
		const context: Converter.Context.Decode<Type.Payload<T>, Type.Claims<T>> = {
			original: typedly.Object.entries(payload).reduce((result, [key]) => {
				return { ...result, [key]: new Promise<any>(resolve => (resolvers[key] = resolve)) }
			}, {} as Converter.Context.Decode<Type.Payload<T>, Type.Claims<T>>["original"]),
			encoded: payload,
		}
		return (
			await Promise.all(
				typedly.Object.entries(payload).map(async ([key, value]) => {
					const result = await this.properties[key].process(value, context)
					resolvers[key]?.(result.value)
					return [result.key, result.value] as const
				})
			)
		).reduce((result, [key, value]) => ({ ...result, [key]: value }), {} as Type.Payload<T>)
	}
	static create<T extends Type.Constraints<T>>(configuration: Configuration<T>): Decoder<T> {
		return new this(
			typedly.Object.reduce<Decoder.Properties<T>, Configuration<T>>(
				configuration,
				(result, [key, value]) => ({ ...result, [key]: Decoder.Property.create(key, value) }),
				{} as Decoder.Properties<T>
			)
		)
	}
}
export namespace Decoder {
	export type Properties<T extends Type.Constraints<T>> = {
		[Claim in keyof T]: Property<T, Claim>
	}
	export class Property<T extends Type.Constraints<T>, P extends keyof Type.Claims<T>> {
		private constructor(
			private readonly prettyClaimName: T[P]["name"],
			private readonly decode: Configuration.Property<T, P>["decode"]
		) {}
		async process(
			value: T[P]["encoded"],
			context: Converter.Context.Decode<Type.Payload<T>, Type.Claims<T>>
		): Promise<{ key: T[P]["name"]; value: T[P]["original"] }> {
			return { key: this.prettyClaimName, value: await this.decode(value, context) }
		}
		static create<T extends Type.Constraints<T>, P extends keyof T>(
			_: P,
			configuration: Configuration.Property<T, P>
		): Property<T, P> {
			return new this(configuration.name, configuration.decode)
		}
	}
	export namespace Property {}
}
