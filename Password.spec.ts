import { Password } from "./Password"
import * as Algorithm from "./Algorithm"

describe("Password", () => {
	const hash = {
		hash: "iYEer0irUbg9Iv8DgPAsn2hMe_e4sSLt6Ll3RU482v4SDQ7rqoJBEQYJJX9RANmbUBwoI63S4PG35roLyAUD2A",
		salt: "salt",
	}
	it("hash", async () => {
		expect(await Password.hash(new Algorithm.HS512("secret-pepper"), "password", "salt")).toEqual(hash)
	})
	it("verify", async () => {
		expect(await Password.verify(new Algorithm.HS512("secret-pepper"), hash, "password")).toBeTruthy()
	})
})
