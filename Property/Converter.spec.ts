import { Converter } from "./Converter"

const conversionMap = {
	foo: {
		forward: (value: string) => value + "transformed",
		backward: (value: string) => value.replace("transformed", ""),
	},
	num: {
		forward: (value: number) => value + 5,
		backward: (value: number) => value - 5,
	},
	arrayMapping: {
		forward: (value: number) => value / 5,
		backward: (value: number) => value * 5,
	},
}
const transformObject = {
	foo: "Some",
	num: 3,
	inside: { foo: "Value", inside: { num: [10, 29, 7], foo: ["here", "test"] } },
	arrayMapping: [100, 22, 15],
}
const transformedObject = {
	foo: "Sometransformed",
	num: 8,
	inside: { foo: "Valuetransformed", inside: { num: [15, 34, 12], foo: ["heretransformed", "testtransformed"] } },
	arrayMapping: [20, 4.4, 3],
}
const converter = new Converter(conversionMap)

describe("Converter", () => {
	it("Transform Forward", () => {
		expect(converter.apply(transformObject)).toEqual(transformedObject)
	})

	it("Transform Backwards", () => {
		expect(converter.reverse(transformedObject)).toEqual(transformObject)
	})

	it("Transform Both Ways", () => {
		expect(converter.reverse(converter.apply(transformObject))).toEqual(transformObject)
	})
})
