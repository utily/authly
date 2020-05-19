export const crypto = ((window || self).crypto || ((window || self) as unknown as { msCrypto: any }).msCrypto)
