import { isoly } from "isoly"
import { authly } from "../../index"

const inside = { num: [10, 29, 7], foo: ["here", "test"] }
const source = {
	foo: "Some",
	num: 3,
	inside: { foo: "Value", inside: structuredClone(inside) },
	array: [100, 22, 15],
	issued: "2023-05-10T10:47:46.000Z",
}
const target = {
	foo: "Sometransformed",
	num: 8,
	inside: { foo: "Valuedifferent", inside: "NotObject" },
	array: [20, 4.4, 3],
	issued: 1683715666,
}

const conversionMap: authly.Property.Converter.Configuration<typeof source, typeof target> = {
	foo: {
		encode: value => value + "transformed",
		decode: value => value?.replace("transformed", ""),
	},
	num: {
		encode: value => value + 5,
		decode: value => value - 5,
	},
	array: {
		encode: value => value.map(v => v / 5),
		decode: value => value.map(v => v * 5),
	},
	"inside.foo": {
		encode: () => "Valuedifferent",
		decode: () => "Value",
	},
	"inside.inside": {
		encode: () => "NotObject",
		decode: () => inside,
	},
	issued: {
		encode: value => isoly.DateTime.epoch(value, "seconds"),
		decode: value => isoly.DateTime.create(value),
	},
}

const converter = new authly.Property.Converter<typeof source, typeof target>(conversionMap)

describe("Converter", () => {
	it("Converter.Configuration.is", async () => {
		expect(authly.Property.Converter.Configuration.is(conversionMap)).toBe(true)
		expect(authly.Property.Converter.Configuration.is({ foo: { encode: (value: string) => value } })).toEqual(true)
		expect(authly.Property.Converter.Configuration.is({ foo: { decode: (value: string) => value } })).toEqual(true)
		expect(authly.Property.Converter.Configuration.is({ foo: {} })).toEqual(true)
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
		const map: authly.Property.Converter.Configuration<{ flagly: string }, { flagly: Record<string, any> }> = {
			flagly: {
				encode: () => ({}),
				decode: () => "",
			},
		}
		const converter = new authly.Property.Converter(map)
		expect(await converter.apply({ flagly: "" })).toEqual({ flagly: {} })
	})
	it("Only encode", async () => {
		const converter = new authly.Property.Converter<{ foo: number }, { foo: string }>({
			foo: {
				encode: value => value.toString(),
			},
		})
		const source = { foo: 123 }
		const target = await converter.apply(source)
		expect(target).toEqual({ foo: "123" })
		expect(await converter.reverse(target)).toEqual(target)
	})
	it("Only decode", async () => {
		const converter = new authly.Property.Converter<{ foo: number }, { foo: string }>({
			foo: {
				decode: value => parseFloat(value),
			},
		})
		const target = { foo: "123" }
		const source = await converter.reverse(target)
		expect(source).toEqual({ foo: 123 })
		expect(target).toEqual({ foo: "123" })
		expect(await converter.apply(source)).toEqual(source)
	})
})
