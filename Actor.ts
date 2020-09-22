import * as Property from "./Property"
export class Actor<T extends Actor<T>> {
	protected readonly transformers: Property.Transformer[] = []
	constructor(readonly id?: string) {}
	//Add more overloads
	add(...argument: (Property.Creatable | Property.Transformer)[]): T {
		argument.forEach(value =>
			this.transformers.push(Property.Creatable.is(value) ? this.creatableToTransformer(value) : value)
		)
		return (this as unknown) as T
	}
	private creatableToTransformer(creatable: Property.Creatable): Property.Transformer {
		console.log(creatable)
		return Property.Creatable.Converter.is(creatable)
			? (console.log("Converter"), new Property.Converter(creatable))
			: Property.Creatable.Crypto.is(creatable)
			? (console.log("Crypto"), Property.Crypto.create(creatable[0], ...creatable.slice(1)))
			: (console.log("Renamer"), new Property.Renamer(creatable))
	}
}
