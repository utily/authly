import { authly } from "../../dist/cjs"

const transformObject = { foo: "Some", inside: { foo: "Value", inside: { foo: "here" } } }
const transformedObject = {
	bar: "Some",
	outside: {
		bar: "Value",
		outside: {
			bar: "here",
		},
	},
}
const transformMap = { foo: "bar", inside: "outside" }
const propertyRenamer = new authly.Property.Renamer(transformMap)
const nestedObject = { foo: [{ foo: "bar" }, { inside: "outside" }] }
const transformedNestedObject = { bar: [{ bar: "bar" }, { outside: "outside" }] }

describe("Renamer", () => {
	it("forward Transform", () => {
		expect(propertyRenamer.apply(transformObject)).toEqual(transformedObject)
	})
	it("backward Transform", () => {
		expect(propertyRenamer.reverse(transformedObject)).toEqual(transformObject)
	})
	it("Forward and backward Transform", () => {
		expect(propertyRenamer.reverse(propertyRenamer.apply(transformObject))).toEqual(transformObject)
	})
	it("Nested Arrays", () => {
		expect(propertyRenamer.apply(nestedObject)).toEqual(transformedNestedObject)
	})
})
