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
	// kid is support with issuer. Verifier ignores it.
	it("HS256 with kid", async () => {
		const algorithm = authly.Algorithm.HS256("secret-key")
		algorithm.kid = "myKeyId1234"
		const issuer = authly.Issuer.create("issuer", algorithm)
		issuer.audience = ["verifier", "audience"]
		const token = await issuer.sign({ test: "test" })
		expect(token).toEqual(
			// This JWT includes the kid-property:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im15S2V5SWQxMjM0In0.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjQ5MDYyLCJhdWQiOlsidmVyaWZpZXIiLCJhdWRpZW5jZSJdLCJ0ZXN0IjoidGVzdCJ9.-ZfQqhBgYFRc1c2xxexXx-RV26I6fNLUHsL1pY_n5KI"
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
	it("googleapis", async () => {
		// Testing and demonstrating
		// https://developers.google.com/identity/protocols/oauth2/service-account#jwt-auth

		// Service accounts, for creating and downloading keys:
		// https://console.cloud.google.com/iam-admin/serviceaccounts
		const privateKey = {
			type: "service_account",
			project_id: "prefab-backbone-377710",
			private_key_id: "aa7174439209aa9bf615ee1296f4e54b379990c6",
			private_key:
				"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDYvrpFP/2WEYXr\nLZNsnWtsPs3HbLYNQa7h/8BrM+NJ0JHZk1IQzWa/yRyfH4P5Zyet9APBwnJq6YCY\nG/CINhlo0H+5Ep+oZCw/ZivS93rgGP7iT0I1eeWvplAvfiFiOu8PsyeFWJm7oSAT\nr+HY/+61PZzZAfAvFxYmKQWYHMsitxyLP0IFsNcpMNYC35z532yYqMTIMjIk6f51\ntEwSPWak8LEOYjSskPZ0Y+XMtfKyOb5Nj8NiQ2o6oNlx/IJVC6bjkk/3U7dPN+dN\nSFVaAZ/tKKYgk7WLGEXlXcIxUlrATlZRlKRhr1HX5i2xvxzssYQE3BaHHp7LroGE\n7Qr4uifhAgMBAAECggEAGYGOWYZfgOi0ffm5ytMWmGEmpaR3IwW6/wjx+5uaUG4t\nL7G8u1H0mLahud8DUJbxTjD0PTm07bxnP98v1dOp91Hr6dtVcwNAysArAZNSgCso\n2Xhyxei/nQVBE+mvo4fkaJBQYwqLYs9h/zcYKIlrraPfwJDQEzaQCnMS37Tpub6j\nuUvI1jv6eAQWNygzaLyzO+3vglCws2BMNGyeLzTXogFTngE9v3MbVEuRCAY+BEPf\naWexidpMQ1oEsCch0r5ROU25AEXKmiumXjcHI+k58xywC2BvNREQLq0BW3zuMlVf\nszzogVRFWCVXnmcdRnSMbARwSHhbwHvU8xPpmsLxsQKBgQDuYOTC3/wFDOY/sfdq\nHfZ7hsV70dMmyu2TQBoRvnn7l+Jo3ALMp5wLF0cQecg2WNiMUxpw4bnJGQV/DfME\nFSbzysunlOHBCOwrKgVduspS7CuFHVs3tVsKf/8pE8sVvL5wHjhhNpuoLw1/XALm\nKRo5y31/PX2A6Yo3d5Kmk9rUKQKBgQDoxHCENXAm/vRRFPyHG3kDPUAFy17FHGUL\nHST3dJ29dcR2gga4ZoS/b05uSXN0yGJGxgAESY6pqltHduwPKXD4UZj2560LB8Zk\nwDj9Lxdfcs5nPZOKLLtGCxWFQd3AElsgxqNp8HBXv3p+IRC2JLsJHKtu6yNapm5u\nHtFUDGzs+QKBgQDIAixvBhgi9KvMDbqWIwXIp0/TkD4mcmXcAxDcioE3BD1H1jHT\nHV7kP2e0/zlpwCoRszigNgT4IjJmZIHejxDbxPATb+vrV10w6lUOS8euw9HQIs2C\ndHwq1zJ0eNMRLghrci/EAVmhR7l/fug/zYTfsUlfFWzUWR9LYtx9P9l/4QKBgA62\n9GH3OtrMPUeu6vPjkbfZtGVpYNlXHTAhrIeUMLCcdEoFmEUp/fRYJf4k2I6maEgP\nFksvFzy0j0aqRuwCc6jPB7t8E91hpXITEMc4peKb0F6Ibv5KK6CW7Mpaypjs0CP3\nSrdUwtVZPnYgwvywv74ouNGvPbHqWYrOme8VRgGJAoGBAJhlN2g3YWjA3gAhmUUo\npNfzPTgjmYZZbRzH/G5DzquAn8rUMA3ua4LAYiu+9TM9cEz/Lhr9bX941x+K/wzk\nde+njoJTNUmI1wUjP7dMr6/UpnpSU1te0SkNd43DoJuwPGDTMuO9ZNjZAHhtwx0x\nPcc7DRpAxb8c86aCqxVhNWlN\n-----END PRIVATE KEY-----\n",
			client_email: "utily-cloudly-analytics-dev@prefab-backbone-377710.iam.gserviceaccount.com",
			client_id: "116287929807825169678",
			auth_uri: "https://accounts.google.com/o/oauth2/auth",
			token_uri: "https://oauth2.googleapis.com/token",
			auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
			client_x509_cert_url:
				"https://www.googleapis.com/robot/v1/metadata/x509/utily-cloudly-analytics-dev%40prefab-backbone-377710.iam.gserviceaccount.com",
		}

		// The downloaded key from google has the private_key in PEM-format, transform it:
		const base64key = (
			(privateKey.private_key.match(
				/(?:^|-+\s*BEGIN PRIVATE KEY\s*-+\s*)([A-Za-z0-9+/\s]+={0,3})(?:\s*-+\s*END PRIVATE KEY\s*-+|$)/s
			) ?? [])[1] ?? ""
		).replace(/\s/g, "")

		// No public key is needed:
		const key = authly.Algorithm.RS256(undefined, base64key)
		expect(key).toBeTruthy()
		if (key) {
			// Attach kid in key to be attach to header of JWT:
			key.kid = privateKey.private_key_id
			const issuer = authly.Issuer.create(privateKey.client_email, key)
			// Always exactly an hour:
			issuer.duration = 3600

			const token = await issuer.sign({
				iss: privateKey.client_email,
				sub: privateKey.client_email,
				aud: "https://bigquery.googleapis.com/",
			})
			expect(token).toEqual(
				"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFhNzE3NDQzOTIwOWFhOWJmNjE1ZWUxMjk2ZjRlNTRiMzc5OTkwYzYifQ.eyJpc3MiOiJ1dGlseS1jbG91ZGx5LWFuYWx5dGljcy1kZXZAcHJlZmFiLWJhY2tib25lLTM3NzcxMC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImlhdCI6NDkwNjIsImV4cCI6NTI2NjIsInN1YiI6InV0aWx5LWNsb3VkbHktYW5hbHl0aWNzLWRldkBwcmVmYWItYmFja2JvbmUtMzc3NzEwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwiYXVkIjoiaHR0cHM6Ly9iaWdxdWVyeS5nb29nbGVhcGlzLmNvbS8ifQ.cMbWO8u41HnwOKiMi-XaNxm9k185r6aFYSD0_a1aVG_hEaZcu8Y4o3dFMcdQCG2NLR-YopZKq4Q2MezOVAryP_FgIsBCsk42y7wktH9i-W0fchy_dtTl2bo_--Au7XxVAzr93LDV3sXusK03Uv3hsdwe4XvC_PUjPtU2KjAZ1fKv442bUMuORzTeGEvOJQP3CpGDfodM5567lKguXUSi7FqDQMHO00dSDxVopJLNRVSAqmx6dcSNdYKHJ4V7inffQn_KjDSVJeyoygBvYrui7ja_xcFGeHilsTV1zENnwP1Yt_LhO8XksrakvgZXxuypx8iGuoTo7-ufcrCuYzqulg"
			)
		}
	})
})
