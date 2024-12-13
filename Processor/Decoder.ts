import { typedly } from "typedly"
import { Configuration } from "./Configuration"
import { Type } from "./Type"

export class Decoder<T extends Type.Constraints<T>> {
	private constructor(private readonly properties: Properties<T>) {}
	async process(payload: Type.Payload<T>): Promise<Type.Claims<T>> {
		return (
			await Promise.all(
				// TODO: should we only pass value if it is not undefined?
				typedly.Object.entries(payload).map(async ([key, value]) => this.properties[key].process(value))
			)
		).reduce((result, [key, value]) => ({ ...result, [key]: value }), {} as Type.Claims<T>)
	}
	static create<T extends Type.Constraints<T>>(configuration: Configuration<T>): Decoder<T> {
		return new this(
			typedly.Object.reduce<Properties<T>, Configuration<T>>(
				configuration,
				(result, [key, value]) => ({ ...result, [key]: Property.create(key, value) }),
				{} as Properties<T>
			)
		)
	}
}
export namespace Decoder {}

type Properties<T extends Type.Constraints<T>> = {
	[Claim in keyof T]: Property<T, Claim>
}
export class Property<T extends Type.Constraints<T>, P extends keyof Type.Payload<T>> {
	private constructor(
		private readonly prettyClaimName: T[P]["name"],
		private readonly decode: Configuration.Property<T, P>["decode"]
	) {}
	async process(value: T[P]["encoded"]): Promise<[T[P]["name"], T[P]["original"]]> {
		return [this.prettyClaimName, await this.decode(value)]
	}
	static create<T extends Type.Constraints<T>, P extends keyof T>(
		_: P,
		configuration: Configuration.Property<T, P>
	): Property<T, P> {
		return new this(configuration.name, configuration.decode)
	}
}
