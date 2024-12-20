import { typedly } from "typedly"
import { authly } from "../index"

describe("authly.Processor.Encrypter", () => {
	const encrypter = new authly.Processor.Encrypter("secret")
	const claims: authly.Claims = { iat: 1704067200, sub: "undefined" }
	it.each([
		["encrypted", "WSNLnhuPsQ_Nwbqoio9uZid0LRV-gu9OvVcPQUI8PE2d0g"],
		["things.encrypted", "gv2sWR7t_OVEhoc-x_HGEy3znrLkQXmYV1Jkqmr6dn5d9g"],
	])("encrypt + decrypt", async (path, encrypted) => {
		const { encode, decode } = encrypter.generate(path)
		expect(
			await encode({ property: "value", number: 1337 }, { original: {}, encoded: typedly.Promise.promisify(claims) })
		).toEqual(encrypted)
		expect(await decode(encrypted, { original: {}, encoded: claims })).toEqual({
			property: "value",
			number: 1337,
		})
	})
})
