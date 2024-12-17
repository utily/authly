import { isoly } from "isoly"
import { isly } from "isly"
import { fixtures } from "./fixtures"
import { authly } from "./index"

authly.Issuer.staticTime = fixtures.times.issued
authly.Verifier.staticTime = fixtures.times.verified

interface User {
	name: { first: string; last: string }
	roles: string[]
}

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
		const configuration: authly.Processor.Configuration<Type> = {
			iss: { name: "issuer", ...authly.Processor.Converter() },
			aud: { name: "audience", ...authly.Processor.Converter() },
			iat: { name: "issued", ...authly.Processor.Converter.dateTime() },
			nam: { name: "name", ...authly.Processor.Converter() },
			rol: { name: "roles", encode: value => value.join(" "), decode: value => value.split(" ") },
		}
		const issuer = authly.Issuer.create<Type>(
			configuration,
			"issuer",
			"audience",
			authly.Algorithm.RS256(fixtures.keys.public, fixtures.keys.private)
		)
		const user: User = {
			name: { first: "Jessie", last: "Doe" },
			roles: ["accountant", "user"],
		}
		const result =
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQxMTAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIiwibmFtIjp7ImZpcnN0IjoiSmVzc2llIiwibGFzdCI6IkRvZSJ9LCJyb2wiOiJhY2NvdW50YW50IHVzZXIifQ.Pl4iFN8csQruGvQ7NOxqb3yeBOdNjdjQmikoTTK0mRWgZjW687fmDPMHlayL2-6RZfszJf5uiot1Hlpr63I0eriWsLd8Wv3yFyDmTKPtZL20Hh5okvVCYmFMSF7mMfZunG-Hzza2MzVbCmqmbt09zHrfdxf3BWluXxGfkiC5-zg"
		expect(await issuer.sign(user)).toEqual(result)
		const verifier = authly.Verifier.create<Type>(configuration, authly.Algorithm.RS256(fixtures.keys.public))
		const verified = await verifier.verify(result, "audience")
		expect(verified).toMatchObject(user)
		expect(Key.is(verified)).toEqual(true)
	})
	it("HS256", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		const issuer = authly.Issuer.create<fixtures.Type>(fixtures.configuration, "issuer", "audience", algorithm)
		const result =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQxMTAwMDAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIiwiZXhwIjoxNzA0MTM5MjAwLCJmb28iOjEyM30.pQfJMeDm6MkdLMrFQYKpMAAfiBTWRRkW47mZjQrx8Sc"
		expect(await issuer.sign(fixtures.claims)).toEqual(result)
		const verifier = authly.Verifier.create<fixtures.Type>(fixtures.configuration, [algorithm])
		expect(await verifier.verify(result, "audience")).toMatchObject({ ...fixtures.claims, token: result })
	})
	it("HS256 with kid", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		algorithm.kid = "myKeyId1234"
		const issuer = authly.Issuer.create<fixtures.Type>(fixtures.configuration, "issuer", "audience", algorithm)
		const result =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im15S2V5SWQxMjM0In0.eyJpYXQiOjE3MDQxMTAwMDAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIiwiZXhwIjoxNzA0MTM5MjAwLCJmb28iOjEyM30.hJNfkQMS3u14J0-Y31z0Cz_sPNBSShdf8O_YuW3jJeA"
		expect(await issuer.sign(fixtures.claims)).toEqual(result)
		const verifier = authly.Verifier.create<fixtures.Type>(fixtures.configuration, [algorithm])
		expect(await verifier.verify(result, "audience")).toMatchObject({ ...fixtures.claims, token: result })
	})
	it("corrupted signature", async () => {
		const verifier = authly.Verifier.create(fixtures.configuration, [authly.Algorithm.RS256(fixtures.keys.public)])
		expect(
			await verifier.verify(
				fixtures.token.signed
					.split(".")
					.map((segment, index, segments) => (index == segments.length - 1 ? segment : segment.replace("A", "B")))
					.join("."),
				"audience"
			)
		).toEqual(undefined)
	})
})
