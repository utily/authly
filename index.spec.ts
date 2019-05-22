import * as authly from "."

describe("authly", () =>{
	it("none", () => {
		const algorithm = new authly.Algorithm.None()
		const issuer = new authly.Issuer(algorithm)
		const token = issuer.sign({ test: "test" }, new Date("1970-01-01T13:37:42.000Z"))
		expect(token).toEqual("eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpYXQiOjQ5MDYyMDAwLCJ0ZXN0IjoidGVzdCJ9.")
		const verifier = new authly.Verifier(algorithm)
		expect(verifier.verify(token)).toEqual({
			iat: 49062000,
			test: "test",
		})
	})
})
