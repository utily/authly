import { isoly } from "isoly"
import { authly } from "../../index"

const insideObject = { num: [10, 29, 7], foo: ["here", "test"] }

const conversionMap: authly.Property.Converter.Configuration = {
	foo: {
		encode: (value: string) => value + "transformed",
		decode: (value: string) => value.replace("transformed", ""),
	},
	num: {
		encode: (value: number) => value + 5,
		decode: (value: number) => value - 5,
	},
	arrayMapping: {
		encode: (value: number[]) => value.map(v => v / 5),
		decode: (value: number[]) => value.map(v => v * 5),
	},
	"inside.foo": {
		encode: (value: string) => value + "different",
		decode: (value: string) => value.replace("different", ""),
	},
	"inside.inside": {
		encode: ((value: { num: number[]; foo: string[] }) =>
			"NotObject") as authly.Property.Converter.Configuration[string]["encode"],
		decode: (value: string) => insideObject,
	},
	issued: {
		encode: (value: string) => isoly.DateTime.epoch(value, "seconds"),
		decode: (value: number) => isoly.DateTime.create(value),
	},
}

const transformObject = {
	foo: "Some",
	num: 3,
	inside: { foo: "Value", inside: { num: [10, 29, 7], foo: ["here", "test"] } },
	arrayMapping: [100, 22, 15],
	issued: "2023-05-10T10:47:46.000Z",
}
const transformedObject = {
	foo: "Sometransformed",
	num: 8,
	inside: { foo: "Valuedifferent", inside: "NotObject" },
	arrayMapping: [20, 4.4, 3],
	issued: 1683715666,
}
const converter = new authly.Property.Converter(conversionMap)

describe("Converter", () => {
	it("Converter.is", async () => {
		expect(authly.Property.Converter.Configuration.is(conversionMap)).toBe(true)
	})
	it("Empty Transformmap", async () => {
		const converter = new authly.Property.Converter({})
		expect(await converter.apply(transformObject)).toEqual(transformObject)
	})
	it("Transform encode", async () => {
		expect(await converter.apply(transformObject)).toEqual(transformedObject)
	})

	it("Transform decodes", async () => {
		expect(await converter.reverse(transformedObject)).toEqual(transformObject)
	})

	it("Transform Both Ways", async () => {
		expect(await converter.reverse(await converter.apply(transformObject))).toEqual(transformObject)
	})
	it("empty string <---> empty object", async () => {
		// this conversion is possible with utily/flagly
		const map: authly.Property.Converter.Configuration = {
			flagly: {
				encode: (value: string): Record<string, undefined> => ({}),
				decode: (value: Record<string, unknown>): string => "",
			},
		}
		const converter = new authly.Property.Converter(map)
		expect(await converter.apply({ flagly: "" })).toEqual({ flagly: {} })
	})
})
