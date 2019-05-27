import { PropertyEncrypter } from "./PropertyEncrypter"
import { PropertyDecrypter } from "./PropertyDecrypter"
import * as base64Url from "base64-url"

describe("PropertyEncrypter", () => {
	it("encoding - decoding", async () => {
		const encoder = new TextEncoder()
		const decoder = new TextDecoder()
		const cleartext = { property: "value", number: 1337 }
		const encoded = encoder.encode(JSON.stringify(cleartext))
		const encrypted = base64Url.encode(decoder.decode(encoded))
		const decrypted = encoder.encode(base64Url.decode(encrypted))
		const decoded = JSON.parse(decoder.decode(decrypted))
		expect(decoded).toEqual({ property: "value", number: 1337 })
	})
	it("encrypt", async () => {
		const encrypter = new PropertyEncrypter("secret", ["encrypted"])
		const encrypted = await encrypter.process({ iss: "issuer", iat: 123456789, encrypted: { property: "value", number: 1337 } })
		expect(encrypted).toEqual({
			iss: "issuer",
			iat: 123456789,
			encrypted: "f9VCdpkeKUbv6pEG_-2AXqZczVPCUp1ykC5oV7Ptz_xd3w",
		})
	})
	it("decrypt", async () => {
		const decrypter = new PropertyDecrypter("secret", ["encrypted"])
		const decrypted = await decrypter.process({ iss: "issuer", iat: 123456789, encrypted: "f9VCdpkeKUbv6pEG_-2AXqZczVPCUp1ykC5oV7Ptz_xd3w" })
		expect(decrypted).toEqual({
			iss: "issuer",
			iat: 123456789,
			encrypted: { property: "value", number: 1337 },
		})
	})
})
