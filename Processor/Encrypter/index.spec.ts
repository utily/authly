import { authly } from "../../index"

describe("authly.Processor.Encrypter", () => {
	const encrypter = new authly.Processor.Encrypter("secret")
	it("top level claim", async () => {
		expect(await encrypter.encode("encrypted", { property: "value", number: 1337 }, "undefined", 1704067200)).toEqual(
			"WSNLnhuPsQ_Nwbqoio9uZid0LRV-gu9OvVcPQUI8PE2d0g"
		)
		expect(
			await encrypter.decode(
				"encrypted",
				"WSNLnhuPsQ_Nwbqoio9uZid0LRV-gu9OvVcPQUI8PE2d0g",
				"undefined",
				"2024-01-01T00:00:00.000Z"
			)
		).toEqual({ property: "value", number: 1337 })
	})
	it("sub claim", async () => {
		expect(
			await encrypter.encode("things.encrypted", { property: "value", number: 1337 }, "undefined", 1704067200)
		).toEqual("gv2sWR7t_OVEhoc-x_HGEy3znrLkQXmYV1Jkqmr6dn5d9g")
		expect(
			await encrypter.decode(
				"things.encrypted",
				"gv2sWR7t_OVEhoc-x_HGEy3znrLkQXmYV1Jkqmr6dn5d9g",
				"undefined",
				"2024-01-01T00:00:00.000Z"
			)
		).toEqual({ property: "value", number: 1337 })
	})
})
