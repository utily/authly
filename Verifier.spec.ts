import * as authly from "./index"

describe("Verifier", () => {
	const verifier = authly.Verifier.create("audience", authly.Algorithm.HS256("secret"))
	const noneIssuer = authly.Issuer.create("audience", authly.Algorithm.none())
	const validIssuer = authly.Issuer.create("audience", authly.Algorithm.HS256("secret"))
	authly.Issuer.defaultIssuedAt = 1570094329996
	it("undefined", async () => expect(await verifier.verify(undefined)).toEqual(undefined))
	it("not a token", async () => expect(await verifier.verify("not a token")).toEqual(undefined))
	it("not.a.token", async () => expect(await verifier.verify("not.a.token")).toEqual(undefined))
	it("token without signature", async () => expect(await verifier.verify(noneIssuer && await noneIssuer.sign({ alpha: "a" }))).toEqual(undefined))
	it("token with valid signature", async () => expect(await verifier.verify(validIssuer && await validIssuer.sign({ alpha: "a" }))).toEqual({"alpha": "a", "iat": 1570094329996, "iss": "audience"}))
})
