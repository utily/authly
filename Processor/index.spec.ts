import { cryptly } from "cryptly"
import { isoly } from "isoly"
import { authly } from "../index"

type Type = authly.Processor.Type<{
	iat: { name: "issued"; claim: isoly.DateTime; payload: number } // required
	iss: { name: "issuer"; claim: string; payload: string } // required
	f: { name: "foo"; claim: string; payload: string }
	n: { name: "number"; claim: number; payload: number }
	a: { name: "array"; claim: number[]; payload: number[] }
}>

const claims: authly.Processor.Type.Claims<Type> = {
	issued: "2023-05-10T10:47:46.000Z",
	issuer: "undefined",
	foo: "Some",
	number: 3,
	array: [100, 22, 15],
}
const payload: authly.Processor.Type.Payload<Type> = {
	iat: 1683715666,
	iss: "undefined",
	f: "SomeTransformed",
	n: 8,
	a: [20, 4.4, 3],
}

const configuration: authly.Processor.Configuration<Type> = {
	iat: {
		name: "issued",
		encode: value => isoly.DateTime.epoch(value, "seconds"),
		decode: async value => {
			await new Promise(resolve => setTimeout(resolve, 0))
			return isoly.DateTime.create(value)
		},
	},
	iss: {
		name: "issuer",
		encode: value => value,
		decode: value => value,
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
			iat: { name: "issued"; claim: number; payload: number }
			iss: { name: "issuer"; claim: string; payload: string }
			flagly: { name: "flagly"; claim: Record<string, never>; payload: string }
		}>
		const processor = authly.Processor.create<Map>({
			iat: { name: "issued", encode: value => value, decode: value => value },
			iss: { name: "issuer", encode: value => value, decode: value => value },
			flagly: { name: "flagly", encode: () => "", decode: () => ({}) },
		})
		expect(await processor.encode({ issued: 1234567890, issuer: "undefined", flagly: {} })).toEqual({
			iat: 1234567890,
			iss: "undefined",
			flagly: "",
		})
		expect(await processor.decode({ iat: 1234567890, iss: "undefined", flagly: "" })).toEqual({
			issued: 1234567890,
			issuer: "undefined",
			flagly: {},
		})
	})
	it("encrypt / decrypt", async () => {
		type MyValue = { hello: string; foo: number }
		type Map = authly.Processor.Type<{
			iat: { name: "issued"; claim: number; payload: number }
			iss: { name: "issuer"; claim: string; payload: string }
			enc: { name: "encrypted"; claim: MyValue; payload: cryptly.Base64 }
		}>
		const processor = authly.Processor.create<Map>({
			iat: { name: "issued", encode: value => value, decode: value => value },
			iss: { name: "issuer", encode: value => value, decode: value => value },
			enc: {
				name: "encrypted",
				...new authly.Processor.Encrypter("secret", "undefined", 123456789).generate<MyValue>("enc"),
			},
		})
		const source = { issuer: "undefined", issued: 1234567890, encrypted: { hello: "world", foo: 123 } }
		const encoded = await processor.encode(source)
		expect(encoded).toEqual({ iss: "undefined", iat: 1234567890, enc: "TpmwTpMu3GDGffny6Stw7nEV7AtqWWnqXE0c" })
		const decoded = await processor.decode(encoded)
		expect(decoded).toEqual(source)
	})
})
