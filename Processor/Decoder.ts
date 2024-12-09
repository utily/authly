import { typedly } from "typedly"
import { Configuration } from "./Configuration"
import { Type } from "./Type"

export class Decoder<T extends Type.Constraints<T>> {
	private constructor(private readonly properties: Properties<T>) {}
	process(payload: Type.Payload<T>): Type.Claims<T> {
		return typedly.Object.reduce<Type.Claims<T>, Type.Payload<T>>(
			payload,
			(result, [key, value]) => {
				const [name, processed] = this.properties[key].process(value as any)
				return { ...result, [name]: processed }
			},
			{} as Type.Claims<T>
		)
	}
	static create<T extends Type.Constraints<T>>(configuration: Configuration<T>): Decoder<T> {
		return new this(
			typedly.Object.reduce(
				configuration,
				(result, [key, value]) => ({ ...result, [value.name]: Property.create(key, value) }),
				{} as Properties<T>
			)
		)
	}
}
export namespace Decoder {}

type Properties<T extends Type.Constraints<T>> = {
	[Claim in keyof Type.Payload<T>]: Property<T, Claim>
}
export class Property<T extends Type.Constraints<T>, P extends keyof T> {
	private constructor(private readonly name: P, private readonly decode: Configuration.Property<T, P>["decode"]) {}
	process(encoded: T[P]["payload"]): [P, T[P]["claim"]] {
		return [this.name, this.decode(encoded)]
	}
	static create<T extends Type.Constraints<T>, P extends keyof T>(
		name: P,
		configuration: Configuration.Property<T, P>
	): Property<T, P> {
		return new this(name, configuration.decode)
	}
}
