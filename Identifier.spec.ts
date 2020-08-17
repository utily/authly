import * as authly from "./index"

describe("Identifier", () => {
	it("generate", () => expect(authly.Identifier.is(authly.Identifier.generate(12))).toBeTruthy())
	it("generate lengths", () => {
		for (const length of authly.Identifier.length) {
			const identifier = authly.Identifier.generate(length)
			expect(identifier).toHaveLength(length)
			expect(authly.Identifier.fromBinary(authly.Identifier.toBinary(identifier))).toEqual(identifier)
			expect(authly.Identifier.fromHexadecimal(authly.Identifier.toHexadecimal(identifier))).toEqual(identifier)
		}
	})
	it("is random", () => expect(authly.Identifier.is(authly.Identifier.generate(64))).toBeTruthy())
	it("is random length", () => expect(authly.Identifier.is(authly.Identifier.generate(64), 64)).toBeTruthy())
	it("is not length", () => expect(authly.Identifier.is(authly.Identifier.generate(64), 32)).toBeFalsy())
	it("is", () => expect(authly.Identifier.is("aAzZ09-_")).toBeTruthy())
	it("is all", () =>
		expect(authly.Identifier.is("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_")).toBeTruthy())
	it("is not !", () => expect(authly.Identifier.is("hej!0123")).toBeFalsy())
	it("is not /", () => expect(authly.Identifier.is("hej/0123")).toBeFalsy())
	it("is not =", () => expect(authly.Identifier.is("hej=0123")).toBeFalsy())
	it("is not .", () => expect(authly.Identifier.is("hej.0123")).toBeFalsy())

	const binary = [
		0,
		16,
		131,
		16,
		81,
		135,
		32,
		146,
		139,
		48,
		211,
		143,
		65,
		20,
		147,
		81,
		85,
		151,
		97,
		150,
		155,
		113,
		215,
		159,
		130,
		24,
		163,
		146,
		89,
		167,
		162,
		154,
		171,
		178,
		219,
		175,
		195,
		28,
		179,
		211,
		93,
		183,
		227,
		158,
		187,
		243,
		223,
		191,
	]
	const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
	it("fromBinary", () => expect(authly.Identifier.fromBinary(Uint8Array.from(binary))).toEqual(all))
	it("toBinary", () => expect(authly.Identifier.toBinary(all)).toEqual(Uint8Array.from(binary)))

	it("fromHexadecimal length 24", () =>
		expect(authly.Identifier.fromHexadecimal("5d4282b672ed3c7738183bd3")).toEqual("XUKCtnLtPHc4GDvT"))
	it("toHexadecimal length 24", () =>
		expect(authly.Identifier.toHexadecimal("XUKCtnLtPHc4GDvT")).toEqual("5d4282b672ed3c7738183bd3"))
	it("fromHexadecimal length 23", () =>
		expect(authly.Identifier.fromHexadecimal("5d4282b672ed3c7738183bd")).toEqual("XUKCtnLtPHc4GDvQ"))
	it("toHexadecimal length 23", () =>
		expect(authly.Identifier.toHexadecimal("XUKCtnLtPHc4GDvQ", 23)).toEqual("5d4282b672ed3c7738183bd"))
	it("fromHexadecimal length 22", () =>
		expect(authly.Identifier.fromHexadecimal("5d4282b672ed3c7738183b")).toEqual("XUKCtnLtPHc4GDs"))
	it("toHexadecimal length 22", () =>
		expect(authly.Identifier.toHexadecimal("XUKCtnLtPHc4GDvs", 22)).toEqual("5d4282b672ed3c7738183b"))
	it("fromHexadecimal length 21", () =>
		expect(authly.Identifier.fromHexadecimal("5d4282b672ed3c7738183")).toEqual("XUKCtnLtPHc4GDA"))
	it("toHexadecimal length 21", () =>
		expect(authly.Identifier.toHexadecimal("XUKCtnLtPHc4GDA", 21)).toEqual("5d4282b672ed3c7738183"))
	it("fromHexadecimal length 20", () =>
		expect(authly.Identifier.fromHexadecimal("5d4282b672ed3c773818")).toEqual("XUKCtnLtPHc4GA"))
	it("toHexadecimal length 20", () =>
		expect(authly.Identifier.toHexadecimal("XUKCtnLtPHc4GA", 20)).toEqual("5d4282b672ed3c773818"))

	it("toBinary length 4", () => expect(authly.Identifier.toBinary("tgAg")).toEqual(Uint8Array.from([182, 0, 32])))
	it("fromBinary length 4", () => expect(authly.Identifier.fromBinary(Uint8Array.from([182, 0, 32]))).toEqual("tgAg"))

	it("toHexadecimal length 4", () => expect(authly.Identifier.toHexadecimal("tgAg")).toEqual("b60020"))
	it("fromHexadecimal length 4", () => expect(authly.Identifier.fromHexadecimal("b60020")).toEqual("tgAg"))
	it("toHexadecimal test", () => expect(authly.Identifier.toHexadecimal("test")).toEqual("b5eb2d"))
	it("fromHexadecimal test", () => expect(authly.Identifier.fromHexadecimal("b5eb2d")).toEqual("test"))
	it("toHexadecimal demo", () => expect(authly.Identifier.toHexadecimal("demo")).toEqual("75e9a8"))
	it("fromHexadecimal demo", () => expect(authly.Identifier.fromHexadecimal("75e9a8")).toEqual("demo"))
	it("toHexadecimal QYklGX_K", () => expect(authly.Identifier.toHexadecimal("QYklGX_K")).toEqual("418925197fca"))
	it("fromHexadecimal QYklGX_K", () => expect(authly.Identifier.fromHexadecimal("418925197fca")).toEqual("QYklGX_K"))
	it("toHexadecimal length 6", () => expect(authly.Identifier.toHexadecimal("DvQecA")).toEqual("0ef41e70"))
	it("fromHexadecimal length 6", () => expect(authly.Identifier.fromHexadecimal("0ef41e70")).toEqual("DvQecA"))
})
