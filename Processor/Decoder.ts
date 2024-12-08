import { Payload } from "../Payload"
import { Configuration } from "./Configuration"
import { Type } from "./Type"

export class Decoder<T extends Type> {
	private constructor(private readonly properties: Properties<T>) {}
	process(payload: Type.Payload<T>): Type.Claims<T> {
		return Object.fromEntries<Type.Claims<T>>(
			Object.entries(payload).map(([key, value]: [keyof Properties<T>, Properties<T>[keyof Properties<T>]]) =>
				(this.properties[key] as Property).process(value as any)
			)
		) as Type.Claims<T>
	}
	static create<T extends Type>(configuration: Configuration<T>): Decoder<T> {
		return new Decoder<T>(
			Object.fromEntries(Object.entries(configuration).map(([n, p]) => Property.create(n, p))) as any as Properties<T>
		)
	}
}
export namespace Decoder {}

type Properties<T extends Type> = {
	[Claim in keyof T as T[Claim]["name"]]: Property<T[Claim]["payload"], Claim, T[Claim]["claim"]>
}
class Property<PayloadValue = Payload[string], ClaimName = string, ClaimValue = never> {
	private constructor(
		private readonly rename: ClaimName,
		private readonly decode: (value: PayloadValue) => ClaimValue
	) {}
	process(value: PayloadValue): [ClaimName, ClaimValue] {
		return [this.rename, this.decode(value)]
	}
	static create<PayloadName = string, PayloadValue = Payload[string], ClaimName = string, ClaimValue = never>(
		name: ClaimName,
		configuration: Configuration.Property<ClaimValue, PayloadName, PayloadValue>
	): [PayloadName, Property<PayloadValue, ClaimName, ClaimValue>] {
		return [
			configuration.rename ?? (name as any as PayloadName),
			new Property<PayloadValue, ClaimName, ClaimValue>(
				name,
				configuration.decode ?? (async (v: PayloadValue): Promise<ClaimValue> => v as any as ClaimValue)
			),
		]
	}
}
