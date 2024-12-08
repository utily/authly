import { Payload } from "../Payload"
import { Configuration } from "./Configuration"
import { Type } from "./Type"

export class Encoder<T extends Type> {
	private constructor(private readonly properties: Properties<T>) {}
	process(claims: Type.Claims<T>): Type.Payload<T> {
		return Object.fromEntries(
			Object.entries(claims).map(([claim, value]) => this.properties[claim].process(value))
		) as Type.Payload<T>
	}
	static create<T extends Type>(configuration: Configuration<T>): Encoder<T> {
		return new Encoder<T>(
			Object.fromEntries(Object.entries(configuration).map(([n, p]) => Property.create(n, p))) as Properties<T>
		)
	}
}
export namespace Encoder {}

type Properties<P extends Type> = {
	[Claim in keyof P]: Property<P[Claim]["claim"], P[Claim]["name"], P[Claim]["payload"]>
}
class Property<ClaimValue = never, PayloadName = string, PayloadValue = Payload[string]> {
	private constructor(readonly rename: PayloadName, readonly encode: (value: ClaimValue) => PayloadValue) {}
	process(value: ClaimValue): [PayloadName, PayloadValue] {
		return [this.rename, this.encode(value)]
	}
	static create<ClaimName = string, ClaimValue = never, PayloadName = string, PayloadValue = Payload[string]>(
		name: ClaimName,
		configuration: Configuration.Property<ClaimValue, PayloadName, PayloadValue>
	): [ClaimName, Property<ClaimValue, PayloadName, PayloadValue>] {
		return [
			name,
			new Property<ClaimValue, PayloadName, PayloadValue>(
				(configuration.rename ?? name) as any as PayloadName,
				configuration.encode ?? ((v: ClaimValue): PayloadValue => v as any)
			),
		]
	}
}
