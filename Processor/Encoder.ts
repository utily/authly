import { typedly } from "typedly"
import { Configuration } from "./Configuration"
import { Converter } from "./Converter"
import { Type } from "./Type"

export class Encoder<T extends Type.Constraints<T>> {
	private constructor(
		private readonly keys: Record<keyof Type.Payload<T>, keyof T>,
		private readonly properties: Encoder.Properties<T>
	) {}
	async process(payload: Type.Payload<T>): Promise<Type.Claims<T>> {
		const resolvers: { [Key in keyof Type.Payload<T>]?: (value: any) => void } = {}
		const context: Converter.Context.Encode<Type.Payload<T>, Type.Claims<T>> = {
			original: payload,
			encoded: typedly.Object.entries(payload).reduce((result, [key]) => {
				return { ...result, [this.keys[key]]: new Promise<any>(resolve => (resolvers[key] = resolve)) }
			}, {} as Converter.Context.Encode<Type.Payload<T>, Type.Claims<T>>["encoded"]),
		}
		return (
			await Promise.all(
				typedly.Object.entries(payload).map(async ([key, value]) => {
					const result = await (this.properties[key] as Encoder.Property<T, keyof T>).process(value, context)
					resolvers[key]?.(result.value)
					return [result.key, result.value] as const
				})
			)
		).reduce((result, [key, value]) => ({ ...result, [key]: value }), {} as Type.Claims<T>)
	}
	static create<T extends Type.Constraints<T>>(configuration: Configuration<T>): Encoder<T> {
		return new this(
			typedly.Object.reduce<Record<keyof Type.Payload<T>, keyof T>, Configuration<T>>(
				configuration,
				(result, [key, value]) => ({ ...result, [value.name]: key }),
				{} as Record<keyof Type.Payload<T>, keyof T>
			),
			typedly.Object.reduce<Encoder.Properties<T>, Configuration<T>>(
				configuration,
				(result, [key, value]) => ({ ...result, [value.name]: Encoder.Property.create(key, value) }),
				{} as Encoder.Properties<T>
			)
		)
	}
}
export namespace Encoder {
	export type Properties<T extends Type.Constraints<T> = Type.Standard> = {
		[Claim in keyof T as T[Claim]["name"]]: Property<T, Claim>
	}
	export class Property<T extends Type.Constraints<T>, P extends keyof T> {
		private constructor(readonly jwtClaimName: P, readonly encode: Configuration.Property<T, P>["encode"]) {}
		async process(
			value: T[P]["original"],
			context: Converter.Context.Encode<Type.Payload<T>, Type.Claims<T>>
		): Promise<{ key: P; value: T[P]["encoded"] }> {
			return { key: this.jwtClaimName, value: await this.encode(value, context) }
		}
		static create<T extends Type.Constraints<T>, P extends keyof T>(
			jwtClaimName: P,
			configuration: Configuration.Property<T, P>
		): Property<T, P> {
			return new this(jwtClaimName, configuration.encode)
		}
	}
}
