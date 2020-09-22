import * as Property from "./Property"
export class Actor<T extends Actor<T>> {
	protected readonly transformers: Property.Transformer[] = []
	constructor(readonly id?: string) {}
	//Add more overloads
	add(...argument: Property.Creatable[]): T
	add(...argument: Property.Transformer[]): T
	add(...argument: (Property.Creatable | Property.Transformer)[]): T {
		argument.forEach(value =>
			this.transformers.push(Property.Creatable.is(value) ? this.creatableToTransformer(value) : value)
		)
		return (this as unknown) as T
	}
	private creatableToTransformer(creatable: Property.Creatable): Property.Transformer {
		return Property.Creatable.Converter.is(creatable)
			? new Property.Converter(creatable)
			: Property.Creatable.Crypto.is(creatable)
			? Property.Crypto.create(creatable[0], ...creatable.slice(1))
			: new Property.Renamer(creatable)
	}
}
