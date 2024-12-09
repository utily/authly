import { typedly } from "typedly"
import { Configuration } from "./Configuration"
import { Type } from "./Type"

export class Encoder<T extends Type.Constraints<T>> {
	private constructor(private readonly properties: Properties<T>) {}
	async process(claims: Type.Claims<T>): Promise<Type.Payload<T>> {
		return (
			await Promise.all(
				typedly.Object.entries(claims).map(async ([key, value]) => await this.properties[key].process(value))
			)
		).reduce((result, [key, value]) => ({ ...result, [key]: value }), {} as Type.Payload<T>)
	}
	static create<T extends Type.Constraints<T>>(configuration: Configuration<T>): Encoder<T> {
		return new this(
			typedly.Object.reduce<Properties<T>, Configuration<T>>(
				configuration,
				(result, [key, value]) => ({ ...result, [key]: Property.create(value) }),
				{} as Properties<T>
			)
		)
	}
}
export namespace Encoder {}

type Properties<T extends Type.Constraints<T>> = {
	[Claim in keyof T]: Property<T, Claim>
}
class Property<T extends Type.Constraints<T>, P extends keyof T> {
	private constructor(readonly name: T[P]["name"], readonly encode: Configuration.Property<T, P>["encode"]) {}
	async process(value: T[P]["claim"]): Promise<[T[P]["name"], T[P]["payload"]]> {
		return [this.name, await this.encode(value)]
	}
	static create<T extends Type.Constraints<T>, P extends keyof T>(
		configuration: Configuration.Property<T, P>
	): Property<T, P> {
		return new this(configuration.name, configuration.encode)
	}
}
