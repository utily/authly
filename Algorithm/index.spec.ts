import { cryptly } from "cryptly"
import { authly } from ".."

describe("Algorithm.RS256", () => {
	const privateKey =
		"MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBANGQ/vA5R46N68mce4AYff1OrGGICum4P9Fs5vbdyDf6/aQQaIjke1N5yK93l1u0a7jVJaRMKcWKzevFArwbX7oDUruJt4B2RFKukz1xkqj6eZ+p2afjtNUFLgbo/QEtS/DqGAqW1f2aoI+ktEa/98MSMJ3ThWko1uOyqDnH7UvDAgMBAAECgYBInbqJGP//mJPMb4mn0FTP0lQPE6ncZLjQY7EAd8cqBrGfCQR/8tP9D+UHUCRFZZYyHMGHVdDfn4JNIR4aek3HsVdCMWKBcfAP4dZ9mgZyQnQHEUyeaV3D5MwpcEaQ60URgNAtBqD+hExBTcwdNHV89jCOsmKsF07mc0Rce8r4kQJBAOsrN6XHQgMAAGeLzLN6XUu2Lc7PcGFulcETbnEFmS/vnFEmDp7QcYmeZR2Nh0oXvcrVNJHNnC5YluvWbAhP2okCQQDkITUhJ5L1nJGn3ysGLKEIPAnBqBDGWbZ46uWGvtAwP1a0838k95blhQF7bDOCmxelbMjDQ4womaxzAaY+9jDrAkBEhPAOzlLOevajNNlsxc9fGvKX2lr9GHJrshSwu5fZnq/l+PezkDo0hcEibjUoAmjbK2nIvaau3kMC7hPGDDY5AkADfAJcvEcBW1/aKY11ra7T+l7Hx3JiJTKlTCkvUrDJW95OKz3w6ZszbEGmifOLdiT5UN0MJnb4k8hPhWHtqkL7AkBhZ27YxBXJNQJQjr6spZhXgP2ayBhaRB+6JKVTfcJQpDQyXIIRlBZS1HQBesn8ZIk69t9n6NJTAhRv0QWILFXe"

	it("sign", async () => {
		const algorithm = authly.Algorithm.RS256(undefined, privateKey)
		const signature = algorithm
			? await algorithm.sign(
					"amount=2050&currency=EUR&ip=1.1.1.1&card[pan]=4111111111111111&card[expire_month]=06&card[expire_year]=2022&card[csc]=123"
			  )
			: ""
		const hexadecimalSignature = cryptly.Identifier.toHexadecimal(signature)
		expect(hexadecimalSignature).toEqual(
			"881de666d7f61c796c1c900784901b1b9bb8298af26bf10f79b2fd59231ab3383d9183ea8120bac3abead1000c4fab63bf6cf1345a31209acfe910c9286e9a3db7d4d15d1ae8e279ef05d5e43184b608ad39741ab04e28095fb8a0c48974e55fd0fe58ac5ef1f6c16670f67fd1c1b9a2a06273b079dc29e0daef6319a2e63545"
		)
	})
})
