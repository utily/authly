import * as authly from "./index"

describe("token", () => {
	it("is", () =>
		expect(
			authly.Token.is("eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpYXQiOjQ5MDYyMDAwLCJ0ZXN0IjoidGVzdCJ9.")
		).toBeTruthy())
})
