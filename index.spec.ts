import * as authly from "."

describe("authly", () =>{
	it("none", async () => {
		const algorithm = new authly.Algorithm.None()
		const issuer = new authly.Issuer("issuer", algorithm)
		issuer.audience = [ "verifier", "audience"]
		const token = await issuer.sign({ test: "test" }, new Date("1970-01-01T13:37:42.000Z"))
		expect(token).toEqual("eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjQ5MDYyMDAwLCJhdWQiOlsidmVyaWZpZXIiLCJhdWRpZW5jZSJdLCJ0ZXN0IjoidGVzdCJ9.")
		const verifier = new authly.Verifier("audience", algorithm)
		expect(await verifier.verify(token)).toEqual({
			iss: "issuer",
			aud: [ "verifier", "audience" ],
			iat: 49062000,
			test: "test",
		})
	})
	it("HS256", async () => {
		const algorithm = new authly.Algorithm.HS256(authly.Base64.decode("secret-key", "url"))
		const issuer = new authly.Issuer("issuer", algorithm)
		issuer.audience = [ "verifier", "audience"]
		const token = await issuer.sign({ test: "test" }, new Date("1970-01-01T13:37:42.000Z"))
		expect(token).toEqual("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpc3N1ZXIiLCJpYXQiOjQ5MDYyMDAwLCJhdWQiOlsidmVyaWZpZXIiLCJhdWRpZW5jZSJdLCJ0ZXN0IjoidGVzdCJ9.7zOG5XjdMk6r4YhddJPEvDi2PFYjQrYVJ4stYJpRcgg")
		const verifier = new authly.Verifier("audience", algorithm)
		expect(await verifier.verify(token)).toEqual({
			iss: "issuer",
			aud: [ "verifier", "audience" ],
			iat: 49062000,
			test: "test",
		})
	})
})
