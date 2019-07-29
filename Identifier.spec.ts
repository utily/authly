import * as authly from "./index"

describe("Identifier", () => {
	it("generates", async () => expect(authly.Identifier.is(authly.Identifier.generate(10))))
	it("generates correct length 9", async () => expect(authly.Identifier.generate(9).length == 9))
	it("generates correct length 10", async () => expect(authly.Identifier.generate(10).length == 10))
	it("generates correct length 11", async () => expect(authly.Identifier.generate(11).length == 11))

	it("generates correct length 12", async () => expect(authly.Identifier.generate(12).length == 12))
	it("is", async () => expect(authly.Identifier.is("aAzZ09-_")))
	it("is not", async () => expect(!authly.Identifier.is("hej!")))
})
