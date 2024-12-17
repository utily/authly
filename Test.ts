import { isoly } from "isoly"
import { authly } from "./index"

export namespace Test {
	export const keys = {
		public:
			"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRkP7wOUeOjevJnHuAGH39TqxhiArpuD/RbOb23cg3+v2kEGiI5HtTecivd5dbtGu41SWkTCnFis3rxQK8G1+6A1K7ibeAdkRSrpM9cZKo+nmfqdmn47TVBS4G6P0BLUvw6hgKltX9mqCPpLRGv/fDEjCd04VpKNbjsqg5x+1LwwIDAQAB",
		private:
			"MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBANGQ/vA5R46N68mce4AYff1OrGGICum4P9Fs5vbdyDf6/aQQaIjke1N5yK93l1u0a7jVJaRMKcWKzevFArwbX7oDUruJt4B2RFKukz1xkqj6eZ+p2afjtNUFLgbo/QEtS/DqGAqW1f2aoI+ktEa/98MSMJ3ThWko1uOyqDnH7UvDAgMBAAECgYBInbqJGP//mJPMb4mn0FTP0lQPE6ncZLjQY7EAd8cqBrGfCQR/8tP9D+UHUCRFZZYyHMGHVdDfn4JNIR4aek3HsVdCMWKBcfAP4dZ9mgZyQnQHEUyeaV3D5MwpcEaQ60URgNAtBqD+hExBTcwdNHV89jCOsmKsF07mc0Rce8r4kQJBAOsrN6XHQgMAAGeLzLN6XUu2Lc7PcGFulcETbnEFmS/vnFEmDp7QcYmeZR2Nh0oXvcrVNJHNnC5YluvWbAhP2okCQQDkITUhJ5L1nJGn3ysGLKEIPAnBqBDGWbZ46uWGvtAwP1a0838k95blhQF7bDOCmxelbMjDQ4womaxzAaY+9jDrAkBEhPAOzlLOevajNNlsxc9fGvKX2lr9GHJrshSwu5fZnq/l+PezkDo0hcEibjUoAmjbK2nIvaau3kMC7hPGDDY5AkADfAJcvEcBW1/aKY11ra7T+l7Hx3JiJTKlTCkvUrDJW95OKz3w6ZszbEGmifOLdiT5UN0MJnb4k8hPhWHtqkL7AkBhZ27YxBXJNQJQjr6spZhXgP2ayBhaRB+6JKVTfcJQpDQyXIIRlBZS1HQBesn8ZIk69t9n6NJTAhRv0QWILFXe",
	}
	export const times = {
		issued: "2024-01-01T12:00:00.000Z",
		verified: "2024-01-01T16:00:00.000Z",
		expires: "2024-01-01T20:00:00.000Z",
		leeway: "2024-01-01T20:00:30.000Z",
		expired: "2024-01-01T21:00:00.000Z",
	}
	export type Type = authly.Processor.Type<{
		iat: { name: "issued"; original: isoly.DateTime; encoded: number } // optional
		iss: { name: "issuer"; original: string; encoded: string } // optional
		aud: { name: "audience"; original: string; encoded: string } // optional
		exp: { name: "expires"; original: string; encoded: number } // optional
		foo: { name: "bar"; original: string; encoded: number }
	}>
	export const configuration: authly.Processor.Configuration<Type> = {
		iss: { name: "issuer", encode: value => value, decode: value => value },
		iat: {
			name: "issued",
			encode: value => isoly.DateTime.epoch(value),
			decode: value => isoly.DateTime.create(value * 1_000),
		},
		aud: { name: "audience", encode: value => value, decode: value => value },
		exp: {
			name: "expires",
			encode: value => isoly.DateTime.epoch(value),
			decode: value => isoly.DateTime.create(value),
		},
		foo: { name: "bar", encode: value => parseInt(value), decode: value => value.toString(10) },
	}
	export const payload: authly.Processor.Type.Payload<Type> = {
		expires: Test.times.expires,
		bar: "123",
	}
	export const token = {
		signed:
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQxMTAwMDAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIiwiZXhwIjoxNzA0MTM5MjAwLCJmb28iOjEyM30.g-ciEnlP3BMWar1LvuihjqNyp1PBsqkW4-sS0h1mw3_aTwDBxQbO7MwY5KjJX9_gMbgFMxjqnqiRedzGkv4avhCqbFcDGsfp7RX9jArpA1vQaZ_n0gqTbBgeCaZ4ZwiwZJ_w4kJbaBDnZwPK4svdFMsV4OvMA2WAGcpUbT_qjgQ",
		unsigned:
			"eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpYXQiOjE3MDQxMTAwMDAsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIiwiZXhwIjoxNzA0MTM5MjAwLCJmb28iOjEyM30.",
	}
}
