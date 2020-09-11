import { PropertyRenamer } from "./PropertyRenamer"
import { PropertyCrypto } from "./PropertyCrypto"
import { Transformer } from "./Transformer"
export class Actor<T extends Actor<T>> {
	protected readonly cryptos: Transformer[] = []
	constructor(readonly id: string) {}
	add(secret: string, ...properties: string[]): T
	add(forwardTransformMap: { [key: string]: string }): T
	add(argument: string | { [key: string]: string }, ...properties: string[]): T {
		switch (typeof argument) {
			case "string":
				const crypto = PropertyCrypto.create(argument, ...properties)
				if (crypto)
					this.cryptos.push(crypto)
				break
			case "object":
				if (argument != {})
					this.cryptos.push(new PropertyRenamer(argument))
				break
		}
		return (this as unknown) as T
	}
}
