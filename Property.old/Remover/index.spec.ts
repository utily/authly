import { authly } from "../../index"

const transformObject = { foo: "Some", inside: { foo: "Value", inside: { foo: "here" } } }
const transformedObject = { inside: { foo: "Value", inside: {} } }
const removeArray = ["foo", "inside.inside.foo"]
const propertyRemover = authly.Property.Remover.create(removeArray)

describe("Remover", () => {
	it("Nested Removal", () => {
		expect(propertyRemover?.apply(transformObject)).toEqual(transformedObject)
	})
})
