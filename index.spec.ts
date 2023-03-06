import * as authly from "./index"
authly.Issuer.defaultIssuedAt = new Date("1970-01-01T13:37:42.000Z")

describe("authly", () => {
	it("none", async () => {
		const algorithm = authly.Algorithm.none()
		const issuer = authly.Issuer.create("issuer", algorithm)
		expect(issuer).toBeTruthy()
		if (issuer) {
			issuer.audience = ["verifier", "audience"]
			const token = await issuer.sign({ test: "test" })
			expect(token).toEqual(
				"eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjQ5MDYyLCJhdWQiOlsidmVyaWZpZXIiLCJhdWRpZW5jZSJdLCJ0ZXN0IjoidGVzdCJ9."
			)
			const verifier = authly.Verifier.create(algorithm)
			expect(verifier).toBeTruthy()
			if (verifier) {
				expect(await verifier.verify(token)).toEqual({
					iss: "issuer",
					aud: ["verifier", "audience"],
					iat: 49062,
					test: "test",
					token,
				})
			}
		}
	})
	it("HS256", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		const issuer = authly.Issuer.create("issuer", algorithm)
		issuer.audience = ["verifier", "audience"]
		const token = await issuer.sign({ test: "test" })
		expect(token).toEqual(
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjQ5MDYyLCJhdWQiOlsidmVyaWZpZXIiLCJhdWRpZW5jZSJdLCJ0ZXN0IjoidGVzdCJ9.BxRECvB1umtdTIs7FsiCPcw7y-nPob2rCK-nC4WHwew"
		)
		const verifier = authly.Verifier.create(algorithm)
		expect(verifier).toBeTruthy()
		if (verifier) {
			expect(await verifier.verify(token)).toEqual({
				iss: "issuer",
				aud: ["verifier", "audience"],
				iat: 49062,
				test: "test",
				token,
			})
		}
	})
	// kid is support with issuer. verifier ignores it.
	it("HS256 with kid", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		algorithm.kid = "myKeyId1234"
		const issuer = authly.Issuer.create("issuer", algorithm)
		issuer.audience = ["verifier", "audience"]
		const token = await issuer.sign({ test: "test" })
		expect(token).toEqual(
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im15S2V5SWQxMjM0In0.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjQ5MDYyLCJhdWQiOlsidmVyaWZpZXIiLCJhdWRpZW5jZSJdLCJ0ZXN0IjoidGVzdCJ9.-ZfQqhBgYFRc1c2xxexXx-RV26I6fNLUHsL1pY_n5KI"
		)
	})
	it("RS256", async () => {
		const algorithm = authly.Algorithm.RS256(
			"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRkP7wOUeOjevJnHuAGH39TqxhiArpuD/RbOb23cg3+v2kEGiI5HtTecivd5dbtGu41SWkTCnFis3rxQK8G1+6A1K7ibeAdkRSrpM9cZKo+nmfqdmn47TVBS4G6P0BLUvw6hgKltX9mqCPpLRGv/fDEjCd04VpKNbjsqg5x+1LwwIDAQAB",
			"MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBANGQ/vA5R46N68mce4AYff1OrGGICum4P9Fs5vbdyDf6/aQQaIjke1N5yK93l1u0a7jVJaRMKcWKzevFArwbX7oDUruJt4B2RFKukz1xkqj6eZ+p2afjtNUFLgbo/QEtS/DqGAqW1f2aoI+ktEa/98MSMJ3ThWko1uOyqDnH7UvDAgMBAAECgYBInbqJGP//mJPMb4mn0FTP0lQPE6ncZLjQY7EAd8cqBrGfCQR/8tP9D+UHUCRFZZYyHMGHVdDfn4JNIR4aek3HsVdCMWKBcfAP4dZ9mgZyQnQHEUyeaV3D5MwpcEaQ60URgNAtBqD+hExBTcwdNHV89jCOsmKsF07mc0Rce8r4kQJBAOsrN6XHQgMAAGeLzLN6XUu2Lc7PcGFulcETbnEFmS/vnFEmDp7QcYmeZR2Nh0oXvcrVNJHNnC5YluvWbAhP2okCQQDkITUhJ5L1nJGn3ysGLKEIPAnBqBDGWbZ46uWGvtAwP1a0838k95blhQF7bDOCmxelbMjDQ4womaxzAaY+9jDrAkBEhPAOzlLOevajNNlsxc9fGvKX2lr9GHJrshSwu5fZnq/l+PezkDo0hcEibjUoAmjbK2nIvaau3kMC7hPGDDY5AkADfAJcvEcBW1/aKY11ra7T+l7Hx3JiJTKlTCkvUrDJW95OKz3w6ZszbEGmifOLdiT5UN0MJnb4k8hPhWHtqkL7AkBhZ27YxBXJNQJQjr6spZhXgP2ayBhaRB+6JKVTfcJQpDQyXIIRlBZS1HQBesn8ZIk69t9n6NJTAhRv0QWILFXe"
		)
		const issuer = authly.Issuer.create("issuer", algorithm)
		expect(issuer).toBeTruthy()
		if (issuer) {
			issuer.audience = ["verifier", "audience"]
			const token = await issuer.sign({ test: "test" }, new Date("1970-01-01T13:37:42.000Z"))
			expect(token).toEqual(
				"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjQ5MDYyLCJhdWQiOlsidmVyaWZpZXIiLCJhdWRpZW5jZSJdLCJ0ZXN0IjoidGVzdCJ9.UpIL2h414R-XCQv0-jzRRduK5C63iPB2MQMmovUyf65hXpAU-gz73syv30d4D0XFjMVpn4GqHRy_-iOr09ICqORScDmGHbhjv6IRsj0TkLrDHlLoNaf2ozYNuRYiBCiQ7OdJOnIC70e__eEcgZFfrh3-wScw-V-bYD01F782_70"
			)
			const verifier = authly.Verifier.create(algorithm)
			expect(verifier).toBeTruthy()
			if (verifier) {
				expect(await verifier.verify(token)).toEqual({
					iss: "issuer",
					aud: ["verifier", "audience"],
					iat: 49062,
					test: "test",
					token,
				})
			}
		}
	})
	it("any", async () => {
		const token =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjQ5MDYyLCJhdWQiOlsidmVyaWZpZXIiLCJhdWRpZW5jZSJdLCJ0ZXN0IjoidGVzdCJ9.BxRECvB1umtdTIs7FsiCPcw7y-nPob2rCK-nC4WHwew"
		const verifier = authly.Verifier.create()
		expect(verifier).toBeTruthy()
		if (verifier) {
			expect(await verifier.verify(token)).toEqual({
				iss: "issuer",
				aud: ["verifier", "audience"],
				iat: 49062,
				test: "test",
				token,
			})
		}
	})
	it("HS256 + property encryption", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		const issuer = authly.Issuer.create("issuer", algorithm).add(["property-key", "secret"])
		issuer.audience = ["verifier", "audience"]
		const token = await issuer.sign({ test: "test", secret: { number: 1337, string: "The power of Attraction." } })
		expect(token).toEqual(
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjQ5MDYyLCJhdWQiOlsidmVyaWZpZXIiLCJhdWRpZW5jZSJdLCJ0ZXN0IjoidGVzdCIsInNlY3JldCI6ImliQTV2OFVVUmNuYWp2THBENEdVd0pQNndDdjQtWVVLZmcySlRBOFl5OHU4czc0RXZtaXphLTJKV05YRlQwSUZDN21WIn0.FB01HRV7j12FW6Y-8GZbamFM5i29hXu80ueXXrMShZk"
		)
		const verifier = authly.Verifier.create(algorithm)
		expect(verifier).toBeTruthy()
		expect(await verifier.verify(token)).toEqual({
			iss: "issuer",
			aud: ["verifier", "audience"],
			iat: 49062,
			test: "test",
			secret: "ibA5v8UURcnajvLpD4GUwJP6wCv4-YUKfg2JTA8Yy8u8s74Evmiza-2JWNXFT0IFC7mV",
			token,
		})
		expect(await verifier.add(["property-key", "secret"]).verify(token)).toEqual({
			iss: "issuer",
			aud: ["verifier", "audience"],
			iat: 49062,
			test: "test",
			secret: { number: 1337, string: "The power of Attraction." },
			token,
		})
	})
	it("HS256 + property encryption + renamer", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		const issuer = authly.Issuer.create("issuer", algorithm)
			.add({ toEncrypt: "secret" })
			.add(["property-key", "secret", "test"])
		issuer.audience = ["verifier", "audience"]
		const token = await issuer.sign({
			test: [{ test: "test" }],
			toEncrypt: { number: 1337, string: "The power of Attraction." },
		})
		const verifier = authly.Verifier.create(algorithm)
		expect(verifier).toBeTruthy()
		expect(
			await verifier
				.add({ issuer: "iss", testing: "test", toEncrypt: "secret" })
				.add(["property-key", "secret", "test"])
				.verify(token)
		).toEqual({
			issuer: "issuer",
			aud: ["verifier", "audience"],
			iat: 49062,
			testing: [{ testing: "test" }],
			toEncrypt: { number: 1337, string: "The power of Attraction." },
			token,
		})
	})
})
