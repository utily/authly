import { authly } from "./index"
import { Test } from "./Test"

authly.Actor.staticTime = Test.times.issued

describe("authly.Issuer", () => {
	const issuer: authly.Issuer<Test.Type> = authly.Issuer.create(
		Test.configuration,
		"issuer",
		"audience",
		authly.Algorithm.RS256(Test.keys.public, Test.keys.private)
	)
	it("staticTime", async () => {
		expect(authly.Issuer.staticTime).toEqual(Test.times.issued)
	})
	it("signing", async () => {
		expect(await issuer.sign(Test.payload)).toEqual(Test.token.signed)
	})
	it("unsigned", async () => {
		const issuer: authly.Issuer<Test.Type> = authly.Issuer.create(
			Test.configuration,
			"issuer",
			"audience",
			authly.Algorithm.none()
		)
		expect(await issuer.sign(Test.payload)).toEqual(Test.token.unsigned)
	})
})
