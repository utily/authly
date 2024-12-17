import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { Converter } from "./Converter"
export class Encrypter<T> {
	constructor(
		private readonly secret: string,
		private readonly converter: Converter<T, Uint8Array> = Converter.toBinary(Converter.json())
	) {}
	private issued(issued: isoly.DateTime | number, unit: "seconds" | "milliseconds"): string {
		return (typeof issued == "number" ? issued : isoly.DateTime.epoch(issued, unit)).toString(10)
	}
	private async process(data: Uint8Array, secret: string): Promise<Uint8Array> {
		const key = await new cryptly.Digester("SHA-512").digest(new TextEncoder().encode(secret))
		const result = new Uint8Array(data.length)
		for (let index = 0; index < data.length; index++)
			result[index] = data[index] ^ key[index]
		return result
	}
	async encode(
		path: string,
		value: T,
		subject: string,
		issued: isoly.DateTime | number,
		{ unit = "seconds", standard = "url" }: Encrypter.Options = {}
	): Promise<cryptly.Base64> {
		const secret = this.secret + subject + this.issued(issued, unit) + path
		return cryptly.Base64.encode(await this.process(await this.converter.encode(value), secret), standard)
	}
	async decode(
		path: string,
		value: cryptly.Base64,
		subject: string,
		issued: isoly.DateTime | number,
		{ unit = "seconds", standard = "url" }: Encrypter.Options = {}
	): Promise<T> {
		const secret = this.secret + subject + this.issued(issued, unit) + path
		return await this.converter.decode(await this.process(cryptly.Base64.decode(value, standard), secret))
	}
}
export namespace Encrypter {
	export interface Options {
		unit?: "seconds" | "milliseconds"
		standard?: cryptly.Base64.Standard
	}
}
