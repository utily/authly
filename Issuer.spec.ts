import { fixtures } from "./fixtures"
import { authly } from "./index"

authly.Actor.staticTime = fixtures.times.issued

describe("authly.Issuer", () => {
	const issuer: authly.Issuer<fixtures.Type> = authly.Issuer.create(
		fixtures.configuration,
		"issuer",
		"audience",
		authly.Algorithm.RS256(fixtures.keys.public, fixtures.keys.private)
	)
	it("staticTime", async () => {
		expect(authly.Issuer.staticTime).toEqual(fixtures.times.issued)
	})
	it("signing", async () => {
		expect(await issuer.sign(fixtures.claims)).toEqual(fixtures.token.signed)
	})
	it("unsigned", async () => {
		const issuer: authly.Issuer<fixtures.Type> = authly.Issuer.create(
			fixtures.configuration,
			"issuer",
			"audience",
			authly.Algorithm.none()
		)
		expect(await issuer.sign(fixtures.claims)).toEqual(fixtures.token.unsigned)
	})
})
