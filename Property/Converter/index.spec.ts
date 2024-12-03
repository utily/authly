import { isoly } from "isoly"
import { authly } from "../../index"

// const insideObject = { num: [10, 29, 7], foo: ["here", "test"] }

type Source = { foo: string; num: number; array: number[]; issued: isoly.DateTime }
type Target = { foo: string; num: number; array: number[]; issued: number }
const source: Source = {
	foo: "Some",
	num: 3,
	// inside: { foo: "Value", inside: { num: [10, 29, 7], foo: ["here", "test"] } },
	array: [100, 22, 15],
	issued: "2023-05-10T10:47:46.000Z",
}
const target: Target = {
	foo: "Sometransformed",
	num: 8,
	// inside: { foo: "Valuedifferent", inside: "NotObject" },
	array: [20, 4.4, 3],
	issued: 1683715666,
}

const conversionMap: authly.Property.Converter.Configuration<Source, Target> = {
	foo: {
		encode: value => value + "transformed",
		decode: value => value?.replace("transformed", "") ?? "",
	},
	num: {
		encode: value => value + 5,
		decode: value => (value ?? 0) - 5,
	},
	array: {
		encode: value => value.map(v => v / 5),
		decode: value => value?.map(v => v * 5) ?? 0,
	},
	// asd: {
	// 	encode: (value: string) => value,
	// 	decode: (value): string | undefined => value?.toString() ?? "",
	// },
	// "inside.foo": {
	// encode: (value: string) => value + "different",
	// decode: (value: string) => value.replace("different", ""),
	// },
	// "inside.inside": {
	// encode: (value: { num: number[]; foo: string[] }) => "NotObject",
	// decode: (value: string) => insideObject,
	// },
	issued: {
		encode: value => isoly.DateTime.epoch(value, "seconds"),
		decode: value => isoly.DateTime.create(value ?? 0),
	},
}

const converter = new authly.Property.Converter<typeof source, typeof target>(conversionMap)

describe("Converter", () => {
	it("Converter.Configuration.is", async () => {
		expect(authly.Property.Converter.Configuration.is(conversionMap)).toBe(true)
	})
	it("Empty Transformmap", async () => {
		const converter = new authly.Property.Converter({})
		expect(await converter.apply(source)).toEqual(source)
	})
	it("Transform encode", async () => {
		expect(await converter.apply(source)).toEqual(target)
	})

	it("Transform decodes", async () => {
		expect(await converter.reverse(target)).toEqual(source)
	})

	it("Transform Both Ways", async () => {
		expect(await converter.reverse(await converter.apply(source))).toEqual(source)
	})
	it("empty string <---> empty object", async () => {
		// this conversion is possible with utily/flagly
		const map: authly.Property.Converter.Configuration<{ hello: string }, { hello: number }> = {
			hello: {
				encode: value => parseInt(value) || undefined,
				decode: value => value?.toString() ?? "",
			},
		}
		const converter = new authly.Property.Converter(map)
		expect(await converter.apply({ hello: "123" })).toEqual({ hello: 123 })
	})
})
