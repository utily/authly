import { typedly } from "typedly"
import { Configuration } from "./Configuration"
import { Type } from "./Type"

export class Decoder<T extends Type.Constraints<T>> {
	private constructor(private readonly configuration: Configuration<T>, private readonly properties: Properties<T>) {}
	async process(payload: Type.Payload<T>): Promise<Type.Claims<T>> {
		const state = typedly.Object.entries(payload).reduce<State<T>>((result, [key]) => {
			return { ...result, [this.configuration[key].name]: typedly.Promise.create<any>() }
		}, {} as State<T>)
		return (
			await Promise.all(
				// TODO: should we only pass value if it is not undefined?
				typedly.Object.entries(payload).map(async ([key, value]) => {
					const result = await this.properties[key].process(value, state)
					;(state[this.configuration[key].name] as typedly.Promise<T[keyof T]["original"]>).resolve(result.value)
					return [result.key, result.value] as const
				})
			)
		).reduce((result, [key, value]) => ({ ...result, [key]: value }), {} as Type.Claims<T>)
	}
	static create<T extends Type.Constraints<T>>(configuration: Configuration<T>): Decoder<T> {
		return new this(
			configuration,
			typedly.Object.reduce<Properties<T>, Configuration<T>>(
				configuration,
				(result, [key, value]) => ({ ...result, [key]: Property.create(key, value) }),
				{} as Properties<T>
			)
		)
	}
}
type State<T extends Type.Constraints<T>> = {
	[Claim in keyof T as T[Claim]["name"]]: typedly.Promise<T[Claim]["original"]>
}
export namespace Decoder {
	export type State<T extends Type.Constraints<T>> = {
		[Claim in keyof T as T[Claim]["name"]]: Promise<T[Claim]["original"]>
	}
}

type Properties<T extends Type.Constraints<T>> = {
	[Claim in keyof T]: Property<T, Claim>
}
export class Property<T extends Type.Constraints<T>, P extends keyof Type.Payload<T>> {
	private constructor(
		private readonly prettyClaimName: T[P]["name"],
		private readonly decode: Configuration.Property<T, P>["decode"]
	) {}
	async process(
		value: T[P]["encoded"],
		state: Decoder.State<T>
	): Promise<{ key: T[P]["name"]; value: T[P]["original"] }> {
		return { key: this.prettyClaimName, value: await this.decode(value, state) }
	}
	static create<T extends Type.Constraints<T>, P extends keyof T>(
		_: P,
		configuration: Configuration.Property<T, P>
	): Property<T, P> {
		return new this(configuration.name, configuration.decode)
	}
}
export namespace Property {}
