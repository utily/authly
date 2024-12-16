import { isoly } from "isoly"
import { isly } from "isly"
import { fixtures } from "./fixtures"
import { authly } from "./index"

authly.Issuer.staticTime = fixtures.times.issued
authly.Verifier.staticTime = fixtures.times.verified

interface Key {
	issuer: string
	audience: string
	issued: string
	name: { first: string; last: string }
	roles: string[]
}
namespace Key {
	export const type = isly.object<Key>({
		issuer: isly.string(),
		issued: isly.fromIs("isoly.DateTime", isoly.DateTime.is),
		audience: isly.string(),
		name: isly.object({ first: isly.string(), last: isly.string() }),
		roles: isly.array(isly.string()),
	})
	export const is = type.is
	export const flaw = type.flaw
}

describe("authly", () => {
	it("RS256", async () => {
		type Type = authly.Processor.Type<{
			iss: { name: "issuer"; original: string; encoded: string }
			aud: { name: "audience"; original: string; encoded: string }
			iat: { name: "issued"; original: string; encoded: number }
			nam: { name: "name"; original: Key["name"]; encoded: Key["name"] }
			rol: { name: "roles"; original: Key["roles"]; encoded: string }
		}>
		const issuer = authly.Issuer.create<Type>(
			{
				iss: { name: "issuer", encode: value => value, decode: value => value },
				aud: { name: "audience", encode: value => value, decode: value => value },
				iat: { name: "issued", encode: value => 123, decode: value => "qwe" },
				nam: { name: "name", encode: value => value, decode: value => value },
				rol: { name: "roles", encode: value => value.join(" "), decode: value => value.split(" ") },
			},
			"issuerId",
			"audienceId",
			authly.Algorithm.RS256(fixtures.keys.private, fixtures.keys.public)
		)
		// expect(issuer.sign())
	})
	it("HS256", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		const issuer = authly.Issuer.create<fixtures.Type>(fixtures.configuration, "unknown", "unknown", algorithm)
		const result =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQxMTAwMDAsImlzcyI6InVua25vd24iLCJhdWQiOiJ1bmtub3duIiwiZXhwIjoxNzA0MTM5MjAwLCJmb28iOjEyM30.CZfK-IUpXWJknrmzcgY8gqAqqMixVulSQ-E1LSG9oXo"
		expect(await issuer.sign(fixtures.claims)).toEqual(result)
		const verifier = authly.Verifier.create<fixtures.Type>(fixtures.configuration, [algorithm])
		expect(await verifier.verify(result, "unknown")).toMatchObject({ ...fixtures.claims, token: result })
	})
	it("HS256 with kid", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		algorithm.kid = "myKeyId1234"
		const issuer = authly.Issuer.create<fixtures.Type>(fixtures.configuration, "unknown", "unknown", algorithm)
		const result =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im15S2V5SWQxMjM0In0.eyJpYXQiOjE3MDQxMTAwMDAsImlzcyI6InVua25vd24iLCJhdWQiOiJ1bmtub3duIiwiZXhwIjoxNzA0MTM5MjAwLCJmb28iOjEyM30.QZuY8EgTfvnVdw-moF7X7pR9qym1CYd7kCGu33cKPik"
		expect(await issuer.sign(fixtures.claims)).toEqual(result)
		const verifier = authly.Verifier.create<fixtures.Type>(fixtures.configuration, [algorithm])
		expect(await verifier.verify(result, "unknown")).toMatchObject({ ...fixtures.claims, token: result })
	})
	it("corrupted signature", async () => {
		const verifier = authly.Verifier.create(fixtures.configuration, [authly.Algorithm.RS256(fixtures.keys.public)])
		expect(
			await verifier.verify(
				fixtures.token.signed
					.split(".")
					.map((segment, index, segments) => (index == segments.length - 1 ? segment : segment.replace("A", "B")))
					.join("."),
				"unknown"
			)
		).toEqual(undefined)
	})
})
