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
			"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnzyis1ZjfNB0bBgKFMSvvkTtwlvBsaJq7S5wA+kzeVOVpVWwkWdVha4s38XM/pa/yr47av7+z3VTmvDRyAHcaT92whREFpLv9cj5lTeJSibyr/Mrm/YtjCZVWgaOYIhwrXwKLqPr/11inWsAkfIytvHWTxZYEcXLgAXFuUuaS3uF9gEiNQwzGTU1v0FqkqTBr4B8nW3HCN47XUu0t8Y0e+lf4s4OxQawWD79J9/5d3Ry0vbV3Am1FtGJiJvOwRsIfVChDpYStTcHTCMqtvWbV6L11BWkpzGXSW4Hv43qa+GSYOD2QU68Mb59oSk2OB+BtOLpJofmbGEGgvmwyCI9MwIDAQAB",
			"MIIEogIBAAKCAQEAnzyis1ZjfNB0bBgKFMSvvkTtwlvBsaJq7S5wA+kzeVOVpVWwkWdVha4s38XM/pa/yr47av7+z3VTmvDRyAHcaT92whREFpLv9cj5lTeJSibyr/Mrm/YtjCZVWgaOYIhwrXwKLqPr/11inWsAkfIytvHWTxZYEcXLgAXFuUuaS3uF9gEiNQwzGTU1v0FqkqTBr4B8nW3HCN47XUu0t8Y0e+lf4s4OxQawWD79J9/5d3Ry0vbV3Am1FtGJiJvOwRsIfVChDpYStTcHTCMqtvWbV6L11BWkpzGXSW4Hv43qa+GSYOD2QU68Mb59oSk2OB+BtOLpJofmbGEGgvmwyCI9MwIDAQABAoIBACiARq2wkltjtcjskFvZ7w1JAORHbEufEO1Eu27zOIlqbgyAcAl7q+/1bip4Z/x1IVES84/yTaM8p0goamMhvgry/mS8vNi1BN2SAZEnb/7xSxbflb70bX9RHLJqKnp5GZe2jexw+wyXlwaM+bclUCrh9e1ltH7IvUrRrQnFJfh+is1fRon9Co9Li0GwoN0x0byrrngU8Ak3Y6D9D8GjQA4Elm94ST3izJv8iCOLSDBmzsPsXfcCUZfmTfZ5DbUDMbMxRnSo3nQeoKGC0Lj9FkWcfmLcpGlSXTO+Ww1L7EGq+PT3NtRae1FZPwjddQ1/4V905kyQFLamAA5YlSpE2wkCgYEAy1OPLQcZt4NQnQzPz2SBJqQN2P5u3vXl+zNVKP8w4eBv0vWuJJF+hkGNnSxXQrTkvDOIUddSKOzHHgSg4nY6K02ecyT0PPm/UZvtRpWrnBjcEVtHEJNpbU9pLD5iZ0J9sbzPU/LxPmuAP2Bs8JmTn6aFRspFrP7W0s1Nmk2jsm0CgYEAyH0X+jpoqxj4efZfkUrg5GbSEhf+dZglf0tTOA5bVg8IYwtmNk/pniLG/zI7c+GlTc9BBwfMr59EzBq/eFMI7+LgXaVUsM/sS4Ry+yeK6SJx/otIMWtDfqxsLD8CPMCRvecC2Pip4uSgrl0MOebl9XKp57GoaUWRWRHqwV4Y6h8CgYAZhI4mh4qZtnhKjY4TKDjxQYufXSdLAi9v3FxmvchDwOgn4L+PRVdMwDNms2bsL0m5uPn104EzM6w1vzz1zwKz5pTpPI0OjgWN13Tq8+PKvm/4Ga2MjgOgPWQkslulO/oMcXbPwWC3hcRdr9tcQtn9Imf9n2spL/6EDFId+Hp/7QKBgAqlWdiXsWckdE1Fn91/NGHsc8syKvjjk1onDcw0NvVi5vcba9oGdElJX3e9mxqUKMrw7msJJv1MX8LWyMQC5L6YNYHDfbPF1q5L4i8j8mRex97UVokJQRRA452V2vCO6S5ETgpnad36de3MUxHgCOX3qL382Qx9/THVmbma3YfRAoGAUxL/Eu5yvMK8SAt/dJK6FedngcM3JEFNplmtLYVLWhkIlNRGDwkg3I5Ky18Ae9n7dHVueyslrb6weq7dTkYDi3iOYRW8HRkIQh06wEdbxt0shTzAJvvCQfrBjg/3747WSsf/zBTcHihTRBdAv6OmdhV4/dD5YBfLAkLrd+mX7iE="
		)
		const issuer = authly.Issuer.create("issuer", algorithm)
		expect(issuer).toBeTruthy()
		if (issuer) {
			issuer.audience = ["verifier", "audience"]
			const token = await issuer.sign({ test: "test" }, new Date("1970-01-01T13:37:42.000Z"))
			expect(token).toEqual(
				"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjQ5MDYyLCJhdWQiOlsidmVyaWZpZXIiLCJhdWRpZW5jZSJdLCJ0ZXN0IjoidGVzdCJ9.J5j1sp_C0X2jFzf9M2viSDKsOUNUyoLB6z4lBNButfkngnRNRSGh-5P-_6igbLQA5wRBwInlRTXwLj7LZtyldJ8ZPMEhOX5VPunSL3vGfw-7gk1Rc6c2CrjkvXKEhoQJxY0NqIZxAwAkrUB3Lpu3JmvouVpPdgf6VzQbtm0M4Zmk9Z6hu3peNSHvd6v49O8wI0SKFFdOKwbsgMTpPi8tA0tYr_C9lCE2l5V1Uf-7FSJatjckxQVtgg-wiZAp69g_pdAHt1xSiosViJIrZnhhz6FhrGr4E3TyIGxViF_hSk2UPp9ny8m7VOSMU5nYtKwydF5KXm57RNffCXM95dRV5w"
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
