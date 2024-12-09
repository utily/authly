import { typedly } from "typedly"
import { Configuration } from "./Configuration"
import { Type } from "./Type"

export class Encoder<T extends Type.Constraints<T>> {
	private constructor(private readonly properties: Properties<T>) {}
	process(claims: Type.Claims<T>): Type.Payload<T> {
		return typedly.Object.reduce<Type.Payload<T>, Type.Claims<T>>(
			claims,
			(result, [key, value]) => {
				const [name, processed] = this.properties[key].process(value)
				return { ...result, [name]: processed }
			},
			{} as Type.Payload<T>
		)
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
	process(value: T[P]["claim"]): [T[P]["name"], T[P]["payload"]] {
		return [this.name, this.encode(value)]
	}
	static create<T extends Type.Constraints<T>, P extends keyof T>(
		configuration: Configuration.Property<T, P>
	): Property<T, P> {
		return new this(configuration.name, configuration.encode)
	}
}
