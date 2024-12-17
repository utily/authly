import { cryptly } from "cryptly"
import { Converter } from "./Converter"

export class Encrypter {
	constructor(private readonly secret: string) {}
	private async process(data: Uint8Array, secret: string): Promise<Uint8Array> {
		const key = await new cryptly.Digester("SHA-512").digest(new TextEncoder().encode(secret))
		const result = new Uint8Array(data.length)
		for (let index = 0; index < data.length; index++)
			result[index] = data[index] ^ key[index]
		return result
	}
	generate<T>(path: string, converter: Converter<T, string> = Converter.json()): Converter<T, cryptly.Base64> {
		const c = Converter.toBinary(converter)
		return {
			encode: async (value: T, context: Converter.Context.Encode): Promise<cryptly.Base64> => {
				const secret = this.secret + ((await context.encoded.sub) ?? "") + ((await context.encoded.iat) ?? 0) + path
				return cryptly.Base64.encode(await this.process(await c.encode(value, context), secret), "url")
			},
			decode: async (value: cryptly.Base64, context: Converter.Context.Decode): Promise<T> => {
				const secret = this.secret + (context.encoded.sub ?? "") + (context.encoded.iat ?? 0) + path
				return await c.decode(await this.process(cryptly.Base64.decode(value, "url"), secret), context)
			},
		}
	}
}
export namespace Encrypter {}
