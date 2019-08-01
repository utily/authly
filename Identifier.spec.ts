import * as authly from "./index"

describe("Identifier", () => {
	it("generate", () => expect(authly.Identifier.is(authly.Identifier.generate(10))).toBeTruthy())
	it("generate length 9", () => expect(authly.Identifier.generate(9)).toHaveLength(9))
	it("generate length 10", () => expect(authly.Identifier.generate(10)).toHaveLength(10))
	it("generate length 11", () => expect(authly.Identifier.generate(11)).toHaveLength(11))
	it("generate length 12", () => expect(authly.Identifier.generate(12)).toHaveLength(12))
	it("generate length 12", () => expect(authly.Identifier.generate(12)).toHaveLength(12))

	it("is random", () => expect(authly.Identifier.is(authly.Identifier.generate(64))).toBeTruthy())
	it("is", () => expect(authly.Identifier.is("aAzZ09-_")).toBeTruthy())
	it("is all", () => expect(authly.Identifier.is("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_")).toBeTruthy())
	it("is not !", () => expect(authly.Identifier.is("hej!0123")).toBeFalsy())
	it("is not /", () => expect(authly.Identifier.is("hej/0123")).toBeFalsy())
	it("is not =", () => expect(authly.Identifier.is("hej=0123")).toBeFalsy())
	it("is not .", () => expect(authly.Identifier.is("hej.0123")).toBeFalsy())

	const binary = [0, 16, 131, 16, 81, 135, 32, 146, 139, 48, 211, 143, 65, 20, 147, 81, 85, 151, 97, 150, 155, 113, 215, 159, 130, 24, 163, 146, 89, 167, 162, 154, 171, 178, 219, 175, 195, 28, 179, 211, 93, 183, 227, 158, 187, 243, 223, 191]
	const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
	it("fromBinary", () => expect(authly.Identifier.fromBinary(Uint8Array.from(binary))).toEqual(all))
	it("toBinary", () => expect(authly.Identifier.toBinary(all)).toEqual(Uint8Array.from(binary)))

	it("fromHexadecimal length 24", () => expect(authly.Identifier.fromHexadecimal("5d4282b672ed3c7738183bd3")).toEqual("XUKCtnLtPHc4GDvT"))
	it("toHexadecimal length 24", () => expect(authly.Identifier.toHexadecimal("XUKCtnLtPHc4GDvT")).toEqual("5d4282b672ed3c7738183bd3"))
	it("fromHexadecimal length 23", () => expect(authly.Identifier.fromHexadecimal("5d4282b672ed3c7738183bd")).toEqual("XUKCtnLtPHc4GDvQ"))
	it("toHexadecimal length 23", () => expect(authly.Identifier.toHexadecimal("XUKCtnLtPHc4GDvQ", 23)).toEqual("5d4282b672ed3c7738183bd"))
	it("fromHexadecimal length 22", () => expect(authly.Identifier.fromHexadecimal("5d4282b672ed3c7738183b")).toEqual("XUKCtnLtPHc4GDs"))
	it("toHexadecimal length 22", () => expect(authly.Identifier.toHexadecimal("XUKCtnLtPHc4GDvs", 22)).toEqual("5d4282b672ed3c7738183b"))
	it("fromHexadecimal length 21", () => expect(authly.Identifier.fromHexadecimal("5d4282b672ed3c7738183")).toEqual("XUKCtnLtPHc4GDA"))
	it("toHexadecimal length 21", () => expect(authly.Identifier.toHexadecimal("XUKCtnLtPHc4GDA", 21)).toEqual("5d4282b672ed3c7738183"))
	it("fromHexadecimal length 20", () => expect(authly.Identifier.fromHexadecimal("5d4282b672ed3c773818")).toEqual("XUKCtnLtPHc4GA"))
	it("toHexadecimal length 20", () => expect(authly.Identifier.toHexadecimal("XUKCtnLtPHc4GA")).toEqual("5d4282b672ed3c773818"))
})
