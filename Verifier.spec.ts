import * as authly from "./index"

describe("Verifier", () => {
	const verifier = authly.Verifier.create<authly.Payload>(
		authly.Algorithm.HS256("nothing"),
		authly.Algorithm.HS256("secret")
	)
	const validIssuer = authly.Issuer.create("audience", authly.Algorithm.HS256("secret"))
	const noneVerifier = authly.Verifier.create(authly.Algorithm.none())
	const noneIssuer = authly.Issuer.create("audience", authly.Algorithm.none())
	authly.Issuer.defaultIssuedAt = 1570094329996
	it("undefined", async () => expect(await verifier.verify(undefined, "audience")).toEqual(undefined))
	it("not a token", async () => expect(await verifier.verify("not a token", "audience")).toEqual(undefined))
	it("not.a.token", async () => expect(await verifier.verify("not.a.token", "audience")).toEqual(undefined))
	it("token without signature", async () =>
		expect(await verifier.verify(noneIssuer && (await noneIssuer.sign({ alpha: "a" })), "audience")).toEqual(undefined))
	it("token with valid signature", async () =>
		expect(await verifier.verify(validIssuer && (await validIssuer.sign({ alpha: "a" })), "audience")).toEqual({
			alpha: "a",
			iat: 1570094329,
			iss: "audience",
			token: expect.any(String),
		}))
	it("Verifying both standard base64 encoded and url base 64 encoded jwt.", async () => {
		const json = {
			url: "https://example.com?param1=123",
			url2: "https://example.com?param1=321",
		}
		const jwt = noneIssuer && (await noneIssuer.sign(json, 1570094329996))
		const base64url =
			"eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJhdWRpZW5jZSIsImlhdCI6MTU3MDA5NDMyOTk5NiwidXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbT9wYXJhbTE9MTIzIiwidXJsMiI6Imh0dHBzOi8vZXhhbXBsZS5jb20_cGFyYW0xPTMyMSJ9."
		const base64std =
			"eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJhdWRpZW5jZSIsImlhdCI6MTU3MDA5NDMyOTk5NiwidXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbT9wYXJhbTE9MTIzIiwidXJsMiI6Imh0dHBzOi8vZXhhbXBsZS5jb20/cGFyYW0xPTMyMSJ9."
		expect(jwt).toEqual(base64url)
		expect(jwt).not.toEqual(base64std)
		expect(noneVerifier && (await noneVerifier.verify(base64url, "audience"))).toBeTruthy()
		expect(noneVerifier && (await noneVerifier.verify(base64std, "audience"))).toBeTruthy()
	})
	it("Verifying both standard base64 encoded and url base 64 encoded jwt.", async () => {
		const json = {
			url: "https://example.com?param1=123",
			url2: "https://example.com?param1=321",
		}
		const jwt = validIssuer && (await validIssuer.sign(json, 1570094329996))
		const base64url =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdWRpZW5jZSIsImlhdCI6MTU3MDA5NDMyOTk5NiwidXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbT9wYXJhbTE9MTIzIiwidXJsMiI6Imh0dHBzOi8vZXhhbXBsZS5jb20_cGFyYW0xPTMyMSJ9.D-QL6NX4Te8lNv2_aQlHRa8ETMuM4emKSGaMBo48r7s"
		// Sign part in base64std is already url encoded since before. This test is for checking backwards compatibility with a previous incorrect use of base64 standard encoding when signing and verifying data (except for the last "sign" part of jwt).
		const base64std =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdWRpZW5jZSIsImlhdCI6MTU3MDA5NDMyOTk5NiwidXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbT9wYXJhbTE9MTIzIiwidXJsMiI6Imh0dHBzOi8vZXhhbXBsZS5jb20/cGFyYW0xPTMyMSJ9.v4jQ4w1rr5AYr0U_bAUv5Swn41NIuENvykhyt52NpX8"
		expect(jwt).toEqual(base64url)
		expect(jwt).not.toEqual(base64std)
		expect(verifier && (await verifier.verify(base64url, "audience"))).toBeTruthy()
		expect(verifier && (await verifier.verify(base64std, "audience"))).toBeTruthy()
	})
	it("verifier.authenticate", async () => {
		const verifier = authly.Verifier.create(authly.Algorithm.HS256("secret"))
		const tokenWithOutAud =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOmZhbHNlLCJpYXQiOjE1MTYyMzkwMjJ9.PnPG46OTl2k5BY3e7gkqP_I4mZyTWya6DrLS97ZLQYM"
		expect(await verifier.authenticate(`Bearer ${tokenWithOutAud}`)).toEqual({
			sub: "1234567890",
			name: "John Doe",
			admin: false,
			iat: 1516239022,
			token: tokenWithOutAud,
		})
		expect(await verifier.authenticate(`Bearer ${tokenWithOutAud}`, "otherAudience")).toEqual({
			sub: "1234567890",
			name: "John Doe",
			admin: false,
			iat: 1516239022,
			token: tokenWithOutAud,
		})

		const tokenWithAud =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYXVkIjoibXlBdWRpZW5jZSIsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjJ9.TNLiTO8u6869MstuZ4ODGT6Xijj3mJJnb0U78jWIh0E"
		expect(await verifier.authenticate(`Bearer ${tokenWithAud}`, "myAudience")).toEqual({
			admin: true,
			aud: "myAudience",
			iat: 1516239022,
			name: "John Doe",
			sub: "1234567890",
			token: tokenWithAud,
		})
		expect(await verifier.authenticate(`Bearer ${tokenWithAud}`, "otherAudience", "myAudience")).toEqual({
			admin: true,
			aud: "myAudience",
			iat: 1516239022,
			name: "John Doe",
			sub: "1234567890",
			token: tokenWithAud,
		})
		expect(await verifier.authenticate(`Bearer ${tokenWithAud}`, "otherAudience")).toBeUndefined()
		// Changed payload:
		expect(
			await verifier.authenticate(
				"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.PnPG46OTl2k5BY3e7gkqP_I4mZyTWya6DrLS97ZLQYM"
			)
		).toBeUndefined()
	})
})
