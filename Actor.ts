import * as Property from "./Property"
export class Actor<T extends Actor<T>> {
	protected readonly transformers: Property.Transformer[] = []
	constructor(readonly id: string) {}
	add(secret: string, ...properties: string[]): T
	add(forwardTransformMap: Property.RenameMap): T
	add(conversionMap: { [key: string]: Property.Conversion }): T
	add(argument: string | Property.RenameMap | { [key: string]: Property.Conversion }, ...properties: string[]): T {
		if (typeof argument == "string") {
			const crypto = Property.Crypto.create(argument, ...properties)
			if (crypto)
				this.transformers.push(crypto)
		} else
			this.transformers.push(
				Property.RenameMap.is(argument) ? new Property.Renamer(argument) : new Property.Converter(argument)
			)
		return (this as unknown) as T
	}
}
