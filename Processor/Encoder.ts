import { typedly } from "typedly"
import { Configuration } from "./Configuration"
import { Type } from "./Type"

export class Encoder<T extends Type.Constraints<T>> {
	private constructor(private readonly properties: Properties<T>) {}
	async process(claims: Type.Claims<T>): Promise<Type.Payload<T>> {
		const state = typedly.Object.entries(claims).reduce<State<T>>((result, [key]) => {
			return { ...result, [key]: typedly.Promise.create<any>() }
		}, {} as State<T>)
		return (
			await Promise.all(
				typedly.Object.entries(claims).map(async ([key, value]) => {
					const result = await (this.properties[key] as Property<T, keyof T>).process(value, state)
					;(state[key] as typedly.Promise<T[keyof T]>).resolve(result.value as any)
					return [result.key, result.value] as const
				})
			)
		).reduce((result, [key, value]) => ({ ...result, [key]: value }), {} as Type.Payload<T>)
	}
	static create<T extends Type.Constraints<T>>(configuration: Configuration<T>): Encoder<T> {
		return new this(
			typedly.Object.reduce<Properties<T>, Configuration<T>>(
				configuration,
				(result, [key, value]) => ({ ...result, [value.name]: Property.create(key, value) }),
				{} as Properties<T>
			)
		)
	}
}

type State<T extends Type.Constraints<T>> = {
	[Claim in keyof T as T[Claim]["name"]]: typedly.Promise<T[Claim]["encoded"]>
}
export namespace Encoder {
	export type State<T extends Type.Constraints<T>> = {
		[Claim in keyof T as T[Claim]["name"]]: Promise<T[Claim]["encoded"]>
	}
}

type Properties<T extends Type.Constraints<T> = Type.Required> = {
	[Claim in keyof T as T[Claim]["name"]]: Property<T, Claim>
}
class Property<T extends Type.Constraints<T>, P extends keyof T> {
	private constructor(readonly jwtClaimName: P, readonly encode: Configuration.Property<T, P>["encode"]) {}
	async process(value: T[P]["original"], state: Encoder.State<T>): Promise<{ key: P; value: T[P]["encoded"] }> {
		return { key: this.jwtClaimName, value: await this.encode(value, state) }
	}
	static create<T extends Type.Constraints<T>, P extends keyof T>(
		jwtClaimName: P,
		configuration: Configuration.Property<T, P>
	): Property<T, P> {
		return new this(jwtClaimName, configuration.encode)
	}
}
