import { Converter as CConverter } from "./Converter"
import { Crypto as CCrypto } from "./Crypto"
import { Renamer as CRenamer } from "./Renamer"

export type Creatable = CRenamer | CConverter | CCrypto

export namespace Creatable {
	export function is(value: Creatable | any): value is Creatable {
		return CCrypto.is(value) || CConverter.is(value) || CRenamer.is(value)
	}
	export type Converter = CConverter
	export type Crypto = CCrypto
	export type Renamer = CRenamer

	export namespace Converter {
		export const is = CConverter.is
	}
	export namespace Crypto {
		export const is = CCrypto.is
	}
	export namespace Renamer {
		export const is = CRenamer.is
	}
}
