import { isoly } from "isoly"
import { authly } from "../index"

interface Type extends authly.Processor.Type {
	issued: { name: "iat"; claim: isoly.DateTime; payload: number }
	foo: { name: "f"; claim: string; payload: string }
	number: { name: "n"; claim: number; payload: number }
	array: { name: "a"; claim: number[]; payload: number[] }
}

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
// const issued: authly.Processor.Configuration.Property<isoly.DateTime, "iat", number> = {
const issued: authly.Processor.Configuration<Type>["issued"] = {
	rename: "iat",
	encode: (value: isoly.DateTime): number => isoly.DateTime.epoch(value, "seconds"),
	decode: (value: number): isoly.DateTime => isoly.DateTime.create(value),
}

const configuration: authly.Processor.Configuration<Type> = {
	issued,
	foo: {
		rename: "f",
		encode: value => value + "Transformed",
		decode: value => value?.replace("Transformed", ""),
	},
	number: {
		rename: "n",
		encode: value => value + 5,
		decode: value => value - 5,
	},
	array: {
		rename: "a",
		encode: value => value.map(v => v / 5),
		decode: value => value.map(v => v * 5),
	},
} as authly.Processor.Configuration<Type>
const processor = authly.Processor.create(configuration)

describe("Processor", () => {
	it("encode", () => {
		expect(processor.encode(claims)).toEqual(payload)
	})
	it("decode", () => {
		expect(processor.decode(payload)).toEqual(claims)
	})
	// it("Transform Both Ways", async () => {
	// 	expect(await converter.reverse(await converter.apply(claims))).toEqual(claims)
	// })
	// it("empty string <---> empty object", async () => {
	// 	// this conversion is possible with utily/flagly
	// 	const map: authly.Property.Converter.Configuration<{ flagly: string }, { flagly: Record<string, any> }> = {
	// 		flagly: {
	// 			encode: () => ({}),
	// 			decode: () => "",
	// 		},
	// 	}
	// 	const converter = new authly.Property.Converter(map)
	// 	expect(await converter.apply({ flagly: "" })).toEqual({ flagly: {} })
	// })
	// it("Only encode", async () => {
	// 	const converter = new authly.Property.Converter<{ foo: number }, { foo: string }>({
	// 		foo: {
	// 			encode: value => value.toString(),
	// 		},
	// 	})
	// 	const source = { foo: 123 }
	// 	const target = await converter.apply(source)
	// 	expect(target).toEqual({ foo: "123" })
	// 	expect(await converter.reverse(target)).toEqual(target)
	// })
	// it("Only decode", async () => {
	// 	const converter = new authly.Property.Converter<{ foo: number }, { foo: string }>({
	// 		foo: {
	// 			decode: value => parseFloat(value),
	// 		},
	// 	})
	// 	const target = { foo: "123" }
	// 	const source = await converter.reverse(target)
	// 	expect(source).toEqual({ foo: 123 })
	// 	expect(target).toEqual({ foo: "123" })
	// 	expect(await converter.apply(source)).toEqual(source)
	// })
})
