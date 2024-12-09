import { isoly } from "isoly"
import { authly } from "../index"

type Type = authly.Processor.Type<{
	issued: { name: "iat"; claim: isoly.DateTime; payload: number }
	foo: { name: "f"; claim: string; payload: string }
	number: { name: "n"; claim: number; payload: number }
	array: { name: "a"; claim: number[]; payload: number[] }
}>

const claims: authly.Processor.Type.Claims<Type> = {
	issued: "2023-05-10T10:47:46.000Z",
	foo: "Some",
	number: 3,
	array: [100, 22, 15],
}
const payload: authly.Processor.Type.Payload<Type> = {
	iat: 1683715666,
	f: "SomeTransformed",
	n: 8,
	a: [20, 4.4, 3],
}

const configuration: authly.Processor.Configuration<Type> = {
	issued: {
		name: "iat",
		encode: value => isoly.DateTime.epoch(value, "seconds"),
		decode: async value => {
			await new Promise(resolve => setTimeout(resolve, 0))
			return isoly.DateTime.create(value)
		},
	},
	foo: {
		name: "f",
		encode: value => value + "Transformed",
		decode: value => value?.replace("Transformed", ""),
	},
	number: {
		name: "n",
		encode: value => value + 5,
		decode: value => value - 5,
	},
	array: {
		name: "a",
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
			flagly: { name: "flagly"; claim: Record<string, never>; payload: string }
		}>
		const processor = authly.Processor.create<Map>({
			flagly: { name: "flagly", encode: () => "", decode: () => ({}) },
		})
		expect(await processor.encode({ flagly: {} })).toEqual({ flagly: "" })
		expect(await processor.decode({ flagly: "" })).toEqual({ flagly: {} })
	})
})
