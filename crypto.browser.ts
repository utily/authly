export const crypto = (self.crypto || window.crypto || (window as unknown as { msCrypto: any }).msCrypto)
