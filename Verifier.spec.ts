import { authly } from "./index"
import { Test } from "./Test"

authly.Actor.staticTime = Test.times.verified

describe("authly.Verifier", () => {
	const verifier = authly.Verifier.create<Test.Type>(Test.configuration, [authly.Algorithm.RS256(Test.keys.public)])
	const verifiers = {
		no: authly.Verifier.create(Test.configuration, []),
		none: authly.Verifier.create<Test.Type>(Test.configuration, [authly.Algorithm.none()]),
	}
	const result = {
		...Test.payload,
		token: Test.token.signed,
	}
	it("staticTime", async () => {
		expect(authly.Verifier.staticTime).toEqual(Test.times.verified)
	})
	it("unpack", async () => {
		expect(await verifier.unpack(Test.token.signed)).toMatchObject(result)
		expect(await verifiers.no.unpack(Test.token.signed)).toMatchObject(result)
		expect(await verifiers.none.unpack(Test.token.signed)).toMatchObject(result)
		expect(await verifier.unpack(Test.token.unsigned)).toMatchObject({
			...result,
			token: Test.token.unsigned,
		})
		expect(await verifiers.no.unpack(Test.token.unsigned)).toMatchObject({
			...result,
			token: Test.token.unsigned,
		})
		expect(await verifiers.none.unpack(Test.token.unsigned)).toMatchObject({
			...result,
			token: Test.token.unsigned,
		})
	})
	it("verification with time to spare", async () => {
		expect(await verifier.verify(Test.token.signed, "audience")).toMatchObject(result)
		expect(await verifier.verify(Test.token.unsigned, ["audience"])).toEqual(undefined)
	})
	it("verification with leeway", async () => {
		authly.Verifier.staticTime = Test.times.leeway
		expect(await verifier.verify(Test.token.signed, "audience")).toMatchObject(result)
		expect(await verifier.verify(Test.token.unsigned, ["audience"])).toEqual(undefined)
		delete authly.Verifier.staticTime
	})
	it("no algorithm", async () => {
		expect(await verifiers.no.verify(Test.token.signed, "audience")).toEqual(undefined)
		expect(await verifiers.no.verify(Test.token.unsigned, ["audience"])).toEqual(undefined)
	})
	it("none algorithm", async () => {
		expect(await verifiers.none.verify(Test.token.signed, "audience")).toEqual(undefined)
		expect(await verifiers.none.verify(Test.token.unsigned, ["audience"])).toEqual(undefined)
	})
	it("verification expired token", async () => {
		authly.Verifier.staticTime = Test.times.expired
		expect(await verifier.verify(Test.token.signed, "audience")).toEqual(undefined)
		expect(await verifier.verify(Test.token.unsigned, ["audience"])).toEqual(undefined)
		delete authly.Verifier.staticTime
	})
})
