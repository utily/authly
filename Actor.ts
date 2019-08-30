import { PropertyCrypto } from "./PropertyCrypto"
export class Actor<T extends Actor<T>> {
	protected readonly cryptos: PropertyCrypto[] = []
	constructor(readonly id: string) {
	}
	add(secret: string, ...properties: string[]): T {
		const crypto = PropertyCrypto.create(secret, ...properties)
		if (crypto)
			this.cryptos.push(crypto)
		return this as unknown as T
	}
}
