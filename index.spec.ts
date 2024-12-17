import { fixtures } from "./fixtures"
import { authly } from "./index"

authly.Issuer.staticTime = fixtures.times.issued
authly.Verifier.staticTime = fixtures.times.verified

describe("authly", () => {
	it("RS256", async () => {
		interface Key {
			subject: string
			issuer: string
			audience: string
			issued: string
			name: { first: string; last: string }
			roles: string[]
		}
		type Type = authly.Processor.Type<{
			iss: { name: "issuer"; original: string; encoded: string }
			aud: { name: "audience"; original: string; encoded: string }
			iat: { name: "issued"; original: string; encoded: number }
			sub: { name: "subject"; original: string; encoded: string }
			nam: { name: "name"; original: Key["name"]; encoded: Key["name"] }
			rol: { name: "roles"; original: Key["roles"]; encoded: string }
		}>
		const encrypter = new authly.Processor.Encrypter<string[]>("secret")
		const configuration: authly.Processor.Configuration<Type> = {
			iss: { name: "issuer", ...authly.Processor.Converter() },
			aud: { name: "audience", ...authly.Processor.Converter() },
			iat: { name: "issued", ...authly.Processor.Converter.dateTime() },
			sub: { name: "subject", ...authly.Processor.Converter() },
			nam: { name: "name", ...authly.Processor.Converter() },
			rol: {
				name: "roles",
				encode: async (value, state) =>
					await encrypter.encode("rol", value, await state.subject, await state.issued, { unit: "seconds" }),
				decode: async (value, state) => await encrypter.decode("rol", value, await state.subject, await state.issued),
			},
		}
		const issuer = authly.Issuer.create<Type>(
			configuration,
			"issuer",
			"audience",
			authly.Algorithm.RS256(fixtures.keys.public, fixtures.keys.private)
		)
		const result =
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQxMTAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIiwic3ViIjoibXlVc2VySWQiLCJuYW0iOnsiZmlyc3QiOiJKZXNzaWUiLCJsYXN0IjoiRG9lIn0sInJvbCI6IlVlbFVSZ0U3bnNfRXlHbXVkLXhaX0hveCJ9.cJ2w_d55lD_-D_vCnNwwGOxFRd5n5wp5H9A5avCKt4quLTmuLXdafJTaqlrglyn8FnYfbO51aMpZFS6bNNRfhWLIOonlWjR5qDdHvoWQSzi4RSHKooKrEFW4B6MoJMWhWWZ7ibNPeSX0vk0YXK1cO9hjBeFcAU4za8Pur-nelRs"
		const source: Pick<Key, "subject" | "name" | "roles"> = {
			subject: "myUserId",
			name: { first: "Jessie", last: "Doe" },
			roles: ["manager", "user"],
		}
		expect(await issuer.sign(source)).toEqual(result)
		const verifier = authly.Verifier.create<Type>(configuration, authly.Algorithm.RS256(fixtures.keys.public))
		const verified = await verifier.verify(result, "audience")
		expect(verified).toMatchObject(source)
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
