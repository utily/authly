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
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteVVzZXJJZCIsIm5hbSI6Ikplc3NpZSBEb2UiLCJyb2wiOiJVZWxVUmdFN25zX0V5R211ZC14Wl9Ib3giLCJpYXQiOjE3MDQxMTAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIn0.oKGqKQrNM6OYLtFG08B-64tm7tfLDrrI3UA3lxkhJK401p3MkXBVGeqHqhTwTX7v4r03KNkuL-Y5qjiLcJi0MgbSfJ727mt-SZKjo7G5CeMEeqlMItLHnHWcDZQjWfZRlM7PLrdjK0UdI3e0IwPgN3kiKsJwnCWoE8OAHtYxbts"
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
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDQxMzkyMDAsImZvbyI6MTIzLCJpYXQiOjE3MDQxMTAwMDAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIn0._j6DqXg_ZRn-SYGZKj6oS76FHf2YmKBlGgk73EOt5dQ"
		expect(await issuer.sign(Test.payload)).toEqual(result)
		const verifier = authly.Verifier.create<Test.Type>(Test.configuration, [algorithm])
		expect(await verifier.verify(result, "audience")).toMatchObject({ ...Test.payload, token: result })
	})
	it("HS256 with kid", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		algorithm.kid = "myKeyId1234"
		const issuer = authly.Issuer.create<Test.Type>(Test.configuration, "issuer", "audience", algorithm)
		const result =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im15S2V5SWQxMjM0In0.eyJleHAiOjE3MDQxMzkyMDAsImZvbyI6MTIzLCJpYXQiOjE3MDQxMTAwMDAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIn0.yVo_znugEa_udktzibSpHUyMXn8aDhgHPPCL3p-tpk0"
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
