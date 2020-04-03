import * as authly from "./index"

describe("Verifier", () => {
	const verifier = authly.Verifier.create("audience", authly.Algorithm.HS256("secret"))
	const validIssuer = authly.Issuer.create("audience", authly.Algorithm.HS256("secret"))
	const noneVerifier = authly.Verifier.create("audience", authly.Algorithm.none())
	const noneIssuer = authly.Issuer.create("audience", authly.Algorithm.none())
	authly.Issuer.defaultIssuedAt = 1570094329996
	it("undefined", async () => expect(await verifier.verify(undefined)).toEqual(undefined))
	it("not a token", async () => expect(await verifier.verify("not a token")).toEqual(undefined))
	it("not.a.token", async () => expect(await verifier.verify("not.a.token")).toEqual(undefined))
	it("token without signature", async () => expect(await verifier.verify(noneIssuer && await noneIssuer.sign({ alpha: "a" }))).toEqual(undefined))
	it("token with valid signature", async () => expect(await verifier.verify(validIssuer && await validIssuer.sign({ alpha: "a" }))).toEqual({"alpha": "a", "iat": 1570094329996, "iss": "audience"}))
	it("Verifying both standard base64 encoded and url base 64 encoded jwt.", async () => {
		const json = {
			"url": "https://example.com?param1=123",
			"url2": "https://example.com?param1=321",
		}
		const jwt = noneIssuer && await noneIssuer.sign(json, 1570094329996)
		const base64url = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJhdWRpZW5jZSIsImlhdCI6MTU3MDA5NDMyOTk5NiwidXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbT9wYXJhbTE9MTIzIiwidXJsMiI6Imh0dHBzOi8vZXhhbXBsZS5jb20_cGFyYW0xPTMyMSJ9."
		const base64std = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJhdWRpZW5jZSIsImlhdCI6MTU3MDA5NDMyOTk5NiwidXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbT9wYXJhbTE9MTIzIiwidXJsMiI6Imh0dHBzOi8vZXhhbXBsZS5jb20/cGFyYW0xPTMyMSJ9."
		expect(jwt).toEqual(base64url)
		expect(jwt).not.toEqual(base64std)
		expect(noneVerifier && await noneVerifier.verify(base64url)).toBeTruthy()
		expect(noneVerifier && await noneVerifier.verify(base64std)).toBeTruthy()
	})
	it("Verifying both standard base64 encoded and url base 64 encoded jwt.", async () => {
		const json = {
			"url": "https://example.com?param1=123",
			"url2": "https://example.com?param1=321",
		}
		const jwt = validIssuer && await validIssuer.sign(json, 1570094329996)
		const base64url = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdWRpZW5jZSIsImlhdCI6MTU3MDA5NDMyOTk5NiwidXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbT9wYXJhbTE9MTIzIiwidXJsMiI6Imh0dHBzOi8vZXhhbXBsZS5jb20_cGFyYW0xPTMyMSJ9.D-QL6NX4Te8lNv2_aQlHRa8ETMuM4emKSGaMBo48r7s"
		// Sign part in base64std is already url encoded since before. This test is for checking backwards compatibility with a previous incorrect use of base64 standard encoding when signing and verifying data (except for the last "sign" part of jwt).
		const base64std = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdWRpZW5jZSIsImlhdCI6MTU3MDA5NDMyOTk5NiwidXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbT9wYXJhbTE9MTIzIiwidXJsMiI6Imh0dHBzOi8vZXhhbXBsZS5jb20/cGFyYW0xPTMyMSJ9.v4jQ4w1rr5AYr0U_bAUv5Swn41NIuENvykhyt52NpX8"
		expect(jwt).toEqual(base64url)
		expect(jwt).not.toEqual(base64std)
		expect(verifier && await verifier.verify(base64url)).toBeTruthy()
		expect(verifier && await verifier.verify(base64std)).toBeTruthy()
	})
	it("Verifying both standard base64 encoded and url base 64 encoded jwt with old and new issuers.", async () => {
		const json = {
			"url": "https://example.com?param1=123",
			"url2": "https://example.com?param1=321",
		}
		const jwtUrl = validIssuer && await validIssuer.sign(json, 1570094329996)
		const jwtStandard = validIssuer && await validIssuer.sign(json, 1570094329996, true)
		const base64url = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdWRpZW5jZSIsImlhdCI6MTU3MDA5NDMyOTk5NiwidXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbT9wYXJhbTE9MTIzIiwidXJsMiI6Imh0dHBzOi8vZXhhbXBsZS5jb20_cGFyYW0xPTMyMSJ9.D-QL6NX4Te8lNv2_aQlHRa8ETMuM4emKSGaMBo48r7s"
		// Sign part in base64std is already url encoded since before. This test is for checking backwards compatibility with a previous incorrect use of base64 standard encoding when signing and verifying data (except for the last "sign" part of jwt).
		const base64std = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdWRpZW5jZSIsImlhdCI6MTU3MDA5NDMyOTk5NiwidXJsIjoiaHR0cHM6Ly9leGFtcGxlLmNvbT9wYXJhbTE9MTIzIiwidXJsMiI6Imh0dHBzOi8vZXhhbXBsZS5jb20/cGFyYW0xPTMyMSJ9.v4jQ4w1rr5AYr0U_bAUv5Swn41NIuENvykhyt52NpX8"
		expect(jwtUrl).toEqual(base64url)
		expect(jwtStandard).toEqual(base64std)
		expect(verifier && await verifier.verify(base64url)).toBeTruthy()
		expect(verifier && await verifier.verify(base64std)).toBeTruthy()
	})
	it("Verifying both standard base64 encoded and url base 64 encoded jwt with old and new issuers (no '/').", async () => {
		const json = {
			"prop": "some value not including equal character",
		}
		const jwtUrl = validIssuer && await validIssuer.sign(json, 1570094329996)
		const jwtStandard = validIssuer && await validIssuer.sign(json, 1570094329996, true)
		expect(jwtUrl).toEqual(jwtStandard)
		expect(verifier && await verifier.verify(jwtUrl)).toBeTruthy()
		expect(verifier && await verifier.verify(jwtStandard)).toBeTruthy()
	})
})
