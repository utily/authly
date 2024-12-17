import { cryptly } from "cryptly"
import { Converter } from "../Converter"

export class Encrypter {
	private readonly secret: string
	constructor(secret: string, subject: string, issued: number) {
		this.secret = secret + subject + issued
	}
	private async process(data: Uint8Array, secret: string): Promise<Uint8Array> {
		const key = await new cryptly.Digester("SHA-512").digest(new TextEncoder().encode(secret))
		const result = new Uint8Array(data.length)
		for (let index = 0; index < data.length; index++)
			result[index] = data[index] ^ key[index]
		return result
	}
	generate<C>(
		path: string,
		converter: Converter<C, Uint8Array> = Converter.toBinary(Converter.json())
	): Converter<C, cryptly.Base64> {
		const secret = this.secret + path
		return {
			encode: async (value: C): Promise<cryptly.Base64> =>
				cryptly.Base64.encode(await this.process(await converter.encode(value), secret), "url"),
			decode: async (value: cryptly.Base64): Promise<C> =>
				await converter.decode(await this.process(cryptly.Base64.decode(value, "url"), secret)),
		}
	}
}
export namespace Encrypter {}
