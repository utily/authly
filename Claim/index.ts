import { Type as CType } from "./Type"

export interface Claim {
	type: CType
	abbreviation: string
	encrypted?: true
	optional?: true
}
// tslint:disable: no-shadowed-variable
export namespace Claim {
	export function is(value: any | Claim): value is Claim {
		return typeof(value) == "object" &&
			CType.is(value.type) &&
			typeof(value.abbreviation) == "string" &&
			(value.encrypted == undefined || value.encrypted == true) &&
			(value.optional == undefined || value.optional == true)
	}
	export type Type = CType
	export namespace Type {
		export const is = CType.is
	}
}
