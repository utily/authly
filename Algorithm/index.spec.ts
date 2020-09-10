import { Identifier } from "cryptly"
import { Algorithm } from "./index"

describe("Algorithm.RS256", () => {
	const privateKey =
		"MIIBOwIBAAJBALYK0zmwuYkH3YWcFNLLddx5cwDxEY7Gi1xITuQqRrU4yD3uSw+J" +
		"WYKknb4Tbndb6iEHY+e6gIGD+49TojnNeIUCAwEAAQJARyuYRRe4kcBHdPL+mSL+" +
		"Y0IAGkAlUyKAXYXPghidKD/v/oLrFaZWALGM2clv6UoYYpPnInSgbcud4sTcfeUm" +
		"QQIhAN2JZ2qv0WGcbIopBpwpQ5jDxMGVkmkVVUEWWABGF8+pAiEA0lySxTELZm8b" +
		"Gx9UEDRghN+Qv/OuIKFldu1Ba4f8W30CIQCaQFIBtunTTVdF28r+cLzgYW9eWwbW" +
		"pEP4TdZ4WlW6AQIhAMDCTUdeUpjxlH/87BXROORozAXocBW8bvJUI486U5ctAiAd" +
		"InviQqJd1KTGRDmWIGrE5YACVmW2JSszD9t5VKxkAA=="

	it("sign", async () => {
		const algorithm = Algorithm.RS256(undefined, privateKey)
		const signature = algorithm
			? await algorithm.sign(
					"amount=2050&currency=EUR&ip=1.1.1.1&card[pan]=4111111111111111&card[expire_month]=06&card[expire_year]=2022&card[csc]=123"
			  )
			: ""
		const hexadecimalSignature = Identifier.toHexadecimal(signature)
		expect(hexadecimalSignature).toEqual(
			"7ae0e14d35b2a15a7ff812a1899d7f0a5d28063f0c276081876a51fc3773f499459f944f8b57c6e0e76b47c218b20ebaad7c6250dcd1804dd19c87fb7f1216ba"
		)
	})
})
