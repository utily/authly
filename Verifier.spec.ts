import { fixtures } from "./fixtures"
import { authly } from "./index"

authly.Actor.staticTime = fixtures.times.verified

describe("authly.Verifier", () => {
	const verifier = authly.Verifier.create<fixtures.Type>(fixtures.configuration, [
		authly.Algorithm.RS256(fixtures.keys.public),
	])
	const verifiers = {
		no: authly.Verifier.create(fixtures.configuration, []),
		none: authly.Verifier.create<fixtures.Type>(fixtures.configuration, [authly.Algorithm.none()]),
	}
	const result = {
		...fixtures.claims,
		token: fixtures.token.signed,
	}
	it("staticTime", async () => {
		expect(authly.Verifier.staticTime).toEqual(fixtures.times.verified)
	})
	it("verification with time to spare", async () => {
		expect(await verifier.verify(fixtures.token.signed, "unknown")).toMatchObject(result)
		expect(await verifier.verify(fixtures.token.unsigned, ["unknown"])).toEqual(undefined)
	})
	it("verification with leeway", async () => {
		authly.Verifier.staticTime = fixtures.times.leeway
		expect(await verifier.verify(fixtures.token.signed, "unknown")).toMatchObject(result)
		expect(await verifier.verify(fixtures.token.unsigned, ["unknown"])).toEqual(undefined)
		delete authly.Verifier.staticTime
	})
	it("no algorithm", async () => {
		expect(await verifiers.no.verify(fixtures.token.signed, "unknown")).toEqual(undefined)
		expect(await verifiers.no.verify(fixtures.token.unsigned, ["unknown"])).toEqual(undefined)
	})
	it("unpack", async () => {
		expect(await verifier.unpack(fixtures.token.signed)).toMatchObject(result)
		expect(await verifiers.no.unpack(fixtures.token.signed)).toMatchObject(result)
		expect(await verifiers.none.unpack(fixtures.token.signed)).toMatchObject(result)
		expect(await verifier.unpack(fixtures.token.unsigned)).toMatchObject({
			...result,
			token: fixtures.token.unsigned,
		})
		expect(await verifiers.no.unpack(fixtures.token.unsigned)).toMatchObject({
			...result,
			token: fixtures.token.unsigned,
		})
		expect(await verifiers.none.unpack(fixtures.token.unsigned)).toMatchObject({
			...result,
			token: fixtures.token.unsigned,
		})
	})
	it("none algorithm", async () => {
		expect(await verifiers.none.verify(fixtures.token.signed, "unknown")).toEqual(undefined)
		expect(await verifiers.none.verify(fixtures.token.unsigned, ["unknown"])).toEqual(undefined)
	})
	it("verification expired token", async () => {
		authly.Verifier.staticTime = fixtures.times.expired
		expect(await verifier.verify(fixtures.token.signed, "unknown")).toEqual(undefined)
		expect(await verifier.verify(fixtures.token.unsigned, ["unknown"])).toEqual(undefined)
		delete authly.Verifier.staticTime
	})
})
