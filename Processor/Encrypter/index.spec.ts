import { authly } from "../../index"

describe("authly.Processor.Encrypter", () => {
	const encrypter = new authly.Processor.Encrypter("secret", "undefined", 123456789)
	it("top level claim", async () => {
		const { encode, decode } = encrypter.generate("encrypted")
		expect(await encode({ property: "value", number: 1337 })).toEqual("f9VCdpkeKUbv6pEG_-2AXqZczVPCUp1ykC5oV7Ptz_xd3w")
		expect(await decode("f9VCdpkeKUbv6pEG_-2AXqZczVPCUp1ykC5oV7Ptz_xd3w")).toEqual({ property: "value", number: 1337 })
	})
	it("sub claim", async () => {
		const { encode, decode } = encrypter.generate("things.encrypted")
		expect(await encode({ property: "value", number: 1337 })).toEqual("IwVZ3J9-bOpO1-9llM3GQRmjR4pL1xkYhqLoQ_We6H9ilg")
		expect(await decode("IwVZ3J9-bOpO1-9llM3GQRmjR4pL1xkYhqLoQ_We6H9ilg")).toEqual({ property: "value", number: 1337 })
	})
})
