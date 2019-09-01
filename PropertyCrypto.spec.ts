import { PropertyCrypto } from "./PropertyCrypto"

describe("PropertyCrypto", () => {
	const crypto = PropertyCrypto.create("secret", "encrypted", "things.encrypted")
	it("encrypt", async () => {
		const encrypted = await crypto.encrypt({ iss: "issuer", iat: 123456789, encrypted: { property: "value", number: 1337 } })
		expect(encrypted).toEqual({
			iss: "issuer",
			iat: 123456789,
			encrypted: "f9VCdpkeKUbv6pEG_-2AXqZczVPCUp1ykC5oV7Ptz_xd3w",
		})
	})
	it("decrypt", async () => {
		const decrypted = await crypto.decrypt({ iss: "issuer", iat: 123456789, encrypted: "f9VCdpkeKUbv6pEG_-2AXqZczVPCUp1ykC5oV7Ptz_xd3w" })
		expect(decrypted).toEqual({
			iss: "issuer",
			iat: 123456789,
			encrypted: { property: "value", number: 1337 },
		})
	})
	it("deep encrypt", async () => {
		const encrypted = await crypto.encrypt({ iss: "issuer", iat: 123456789, things: { public: "nothing to hide", encrypted: { property: "value", number: 1337 } } })
		expect(encrypted).toEqual({
			iss: "issuer",
			iat: 123456789,
			things: {
				public: "nothing to hide",
				encrypted: "IwVZ3J9-bOpO1-9llM3GQRmjR4pL1xkYhqLoQ_We6H9ilg",
			},
		})
	})
	it("deep decrypt", async () => {
		const decrypted = await crypto.decrypt({ iss: "issuer", iat: 123456789, things: { public: "nothing to hide", encrypted: "IwVZ3J9-bOpO1-9llM3GQRmjR4pL1xkYhqLoQ_We6H9ilg" }})
		expect(decrypted).toEqual({
			iss: "issuer",
			iat: 123456789,
			things: {
				public: "nothing to hide",
				encrypted: { property: "value", number: 1337 },
			},
		})
	})
})
