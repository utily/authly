import { authly } from "./index"
import { Test } from "./Test"

authly.Issuer.staticTime = Test.times.issued
authly.Verifier.staticTime = Test.times.verified

describe("authly", () => {
	it("RS256", async () => {
		type Type = authly.Processor.Type<{
			iss: { name: "issuer"; original: string; encoded: string }
			aud: { name: "audience"; original: string; encoded: string }
			iat: { name: "issued"; original: string; encoded: number }
			sub: { name: "subject"; original: string; encoded: string }
			nam: { name: "name"; original: { first: string; last: string }; encoded: string }
			rol: { name: "roles"; original: string[]; encoded: string }
		}>
		type Key = authly.Processor.Type.Payload<Type>
		const encrypter = new authly.Processor.Encrypter("secret")
		const configuration: authly.Processor.Configuration<Type> = {
			iss: { name: "issuer", ...authly.Processor.Converter.identity() },
			aud: { name: "audience", ...authly.Processor.Converter.identity() },
			iat: { name: "issued", ...authly.Processor.Converter.dateTime() },
			sub: { name: "subject", ...authly.Processor.Converter.identity() },
			nam: {
				name: "name",
				encode: value => `${value.first} ${value.last}`,
				decode: value => (([first, last]) => ({ first, last }))(value.split(" ")),
			},
			rol: {
				name: "roles",
				...encrypter.generate("rol"),
			},
		}
		const issuer = authly.Issuer.create<Type>(
			configuration,
			"issuer",
			"audience",
			authly.Algorithm.RS256(Test.keys.public, Test.keys.private)
		)
		const result =
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQxMTAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIiwic3ViIjoibXlVc2VySWQiLCJuYW0iOnsiZmlyc3QiOiJKZXNzaWUiLCJsYXN0IjoiRG9lIn0sInJvbCI6IlVlbFVSZ0U3bnNfRXlHbXVkLXhaX0hveCJ9.cJ2w_d55lD_-D_vCnNwwGOxFRd5n5wp5H9A5avCKt4quLTmuLXdafJTaqlrglyn8FnYfbO51aMpZFS6bNNRfhWLIOonlWjR5qDdHvoWQSzi4RSHKooKrEFW4B6MoJMWhWWZ7ibNPeSX0vk0YXK1cO9hjBeFcAU4za8Pur-nelRs"
		const source: Pick<Key, "subject" | "name" | "roles"> = {
			subject: "myUserId",
			name: { first: "Jessie", last: "Doe" },
			roles: ["manager", "user"],
		}
		expect(await issuer.sign(source)).toEqual(result)
		const verifier = authly.Verifier.create<Type>(configuration, authly.Algorithm.RS256(Test.keys.public))
		const verified = await verifier.verify(result, "audience")
		expect(verified).toMatchObject(source)
	})
	it("HS256", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		const issuer = authly.Issuer.create<Test.Type>(Test.configuration, "issuer", "audience", algorithm)
		const result =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQxMTAwMDAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIiwiZXhwIjoxNzA0MTM5MjAwLCJmb28iOjEyM30.pQfJMeDm6MkdLMrFQYKpMAAfiBTWRRkW47mZjQrx8Sc"
		expect(await issuer.sign(Test.payload)).toEqual(result)
		const verifier = authly.Verifier.create<Test.Type>(Test.configuration, [algorithm])
		expect(await verifier.verify(result, "audience")).toMatchObject({ ...Test.payload, token: result })
	})
	it("HS256 with kid", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		algorithm.kid = "myKeyId1234"
		const issuer = authly.Issuer.create<Test.Type>(Test.configuration, "issuer", "audience", algorithm)
		const result =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im15S2V5SWQxMjM0In0.eyJpYXQiOjE3MDQxMTAwMDAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIiwiZXhwIjoxNzA0MTM5MjAwLCJmb28iOjEyM30.hJNfkQMS3u14J0-Y31z0Cz_sPNBSShdf8O_YuW3jJeA"
		expect(await issuer.sign(Test.payload)).toEqual(result)
		const verifier = authly.Verifier.create<Test.Type>(Test.configuration, [algorithm])
		expect(await verifier.verify(result, "audience")).toMatchObject({ ...Test.payload, token: result })
	})
	it("corrupted signature", async () => {
		const verifier = authly.Verifier.create(Test.configuration, [authly.Algorithm.RS256(Test.keys.public)])
		expect(
			await verifier.verify(
				Test.token.signed
					.split(".")
					.map((segment, index, segments) => (index == segments.length - 1 ? segment : segment.replace("A", "B")))
					.join("."),
				"audience"
			)
		).toEqual(undefined)
	})
})
