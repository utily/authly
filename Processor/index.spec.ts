import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { authly } from "../index"

type Type = authly.Processor.Type<{
	iss: { name: "issuer"; original: string; encoded: string } // required
	aud: { name: "audience"; original: string; encoded: string } // required
	iat: { name: "issued"; original: isoly.DateTime; encoded: number } // required
	f: { name: "foo"; original: string; encoded: string }
	n: { name: "number"; original: number; encoded: number }
	a: { name: "array"; original: number[]; encoded: number[] }
}>

const claims: authly.Processor.Type.Claims<Type> = {
	issuer: "issuer",
	audience: "audience",
	issued: "2023-05-10T10:47:46.000Z",
	foo: "Some",
	number: 3,
	array: [100, 22, 15],
}
const payload: authly.Processor.Type.Payload<Type> = {
	iss: "issuer",
	aud: "audience",
	iat: 1683715666,
	f: "SomeTransformed",
	n: 8,
	a: [20, 4.4, 3],
}

const configuration: authly.Processor.Configuration<Type> = {
	iss: { name: "issuer", encode: value => value, decode: value => value },
	aud: { name: "audience", encode: value => value, decode: value => value },
	iat: {
		name: "issued",
		encode: value => isoly.DateTime.epoch(value, "seconds"),
		decode: async value => {
			await new Promise(resolve => setTimeout(resolve, 0))
			return isoly.DateTime.create(value)
		},
	},
	f: {
		name: "foo",
		encode: value => value + "Transformed",
		decode: value => value?.replace("Transformed", ""),
	},
	n: {
		name: "number",
		encode: value => value + 5,
		decode: value => value - 5,
	},
	a: {
		name: "array",
		encode: value => value.map(v => v / 5),
		decode: value => value.map(v => v * 5),
	},
}
const processor = authly.Processor.create(configuration)

describe("Processor", () => {
	it("encode", async () => expect(await processor.encode(claims)).toEqual(payload))
	it("decode", async () => expect(await processor.decode(payload)).toEqual(claims))
	it("empty string <---> empty object", async () => {
		type Map = authly.Processor.Type<{
			iss: { name: "issuer"; original: string; encoded: string }
			aud: { name: "audience"; original: string; encoded: string }
			iat: { name: "issued"; original: number; encoded: number }
			flagly: { name: "flagly"; original: Record<string, never>; encoded: string }
		}>
		const processor = authly.Processor.create<Map>({
			iss: { name: "issuer", encode: value => value, decode: value => value },
			aud: { name: "audience", encode: value => value, decode: value => value },
			iat: { name: "issued", encode: value => value, decode: value => value },
			flagly: { name: "flagly", encode: () => "", decode: () => ({}) },
		})
		expect(await processor.encode({ issuer: "issuer", audience: "audience", issued: 1234567890, flagly: {} })).toEqual({
			iss: "issuer",
			aud: "audience",
			iat: 1234567890,
			flagly: "",
		})
		expect(await processor.decode({ iss: "issuer", aud: "audience", iat: 1234567890, flagly: "" })).toEqual({
			issuer: "issuer",
			audience: "audience",
			issued: 1234567890,
			flagly: {},
		})
	})
	it("encrypt / decrypt", async () => {
		type MyValue = { hello: string; foo: number }
		type Map = authly.Processor.Type<{
			iss: { name: "issuer"; original: string; encoded: string }
			aud: { name: "audience"; original: string; encoded: string }
			iat: { name: "issued"; original: number; encoded: number }
			enc: { name: "encrypted"; original: MyValue; encoded: cryptly.Base64 }
		}>
		const processor = authly.Processor.create<Map>({
			iss: { name: "issuer", encode: value => value, decode: value => value },
			aud: { name: "audience", encode: value => value, decode: value => value },
			iat: { name: "issued", encode: value => value, decode: value => value },
			enc: {
				name: "encrypted",
				...new authly.Processor.Encrypter("secret", "undefined", 123456789).generate<MyValue>("enc"),
			},
		})
		const source = {
			issuer: "issuer",
			audience: "audience",
			issued: 1234567890,
			encrypted: { hello: "world", foo: 123 },
		}
		const encoded = await processor.encode(source)
		expect(encoded).toEqual({
			iss: "issuer",
			aud: "audience",
			iat: 1234567890,
			enc: "TpmwTpMu3GDGffny6Stw7nEV7AtqWWnqXE0c",
		})
		const decoded = await processor.decode(encoded)
		expect(decoded).toEqual(source)
	})
})
