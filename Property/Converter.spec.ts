import { isoly } from "isoly"
import { Converter } from "./Converter"
import { Creatable } from "./Creatable"
const insideObject = { num: [10, 29, 7], foo: ["here", "test"] }

const conversionMap: Creatable.Converter = {
	foo: {
		forward: (value: string) => value + "transformed",
		backward: (value: string) => value.replace("transformed", ""),
	},
	num: {
		forward: (value: number) => value + 5,
		backward: (value: number) => value - 5,
	},
	arrayMapping: {
		forward: (value: number[]) => value.map(v => v / 5),
		backward: (value: number[]) => value.map(v => v * 5),
	},
	"inside.foo": {
		forward: (value: string) => value + "different",
		backward: (value: string) => value.replace("different", ""),
	},
	"inside.inside": {
		forward: ((value: { num: number[]; foo: string[] }) => "NotObject") as Creatable.Converter[string]["forward"],
		backward: (value: string) => insideObject,
	},
	issued: {
		forward: (value: string) => isoly.DateTime.epoch(value, "seconds"),
		backward: (value: number) => isoly.DateTime.create(value),
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
const converter = new Converter(conversionMap)

describe("Converter", () => {
	it("Converter.is", async () => {
		expect(Creatable.Converter.is(conversionMap)).toBe(true)
	})
	it("Empty Transformmap", async () => {
		const converter = new Converter({})
		expect(await converter.apply(transformObject)).toEqual(transformObject)
	})
	it("Transform Forward", async () => {
		expect(await converter.apply(transformObject)).toEqual(transformedObject)
	})

	it("Transform Backwards", async () => {
		expect(await converter.reverse(transformedObject)).toEqual(transformObject)
	})

	it("Transform Both Ways", async () => {
		expect(await converter.reverse(await converter.apply(transformObject))).toEqual(transformObject)
	})
})
