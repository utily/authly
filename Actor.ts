import * as Property from "./Property"
export class Actor<T extends Actor<T>> {
	protected readonly transformers: Property.Transformer[] = []
	constructor(readonly id?: string) {}

	add(...argument: (Property.Configuration | Property.Transformer | undefined)[]): T {
		argument.forEach(
			value =>
				value && this.transformers.push(Property.Configuration.is(value) ? this.creatableToTransformer(value) : value)
		)
		return this as unknown as T
	}

	private creatableToTransformer(creatable: Property.Configuration): Property.Transformer {
		return Property.Converter.Configuration.is(creatable)
			? new Property.Converter(creatable)
			: Property.Crypto.Configuration.is(creatable)
			? Property.Crypto.create(creatable[0], ...creatable.slice(1))
			: new Property.Renamer(creatable)
	}
}
export namespace Actor {}
