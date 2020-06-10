import * as WebCrypto from "node-webcrypto-ossl"

export const crypto = new WebCrypto.Crypto() as Crypto
