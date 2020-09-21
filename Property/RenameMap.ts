export interface RenameMap {
	[key: string]: string
}
export namespace RenameMap {
	export function is(value: RenameMap | any): value is RenameMap {
		return typeof value == "object" && Object.entries(value).every(thing => typeof thing[1] == "string")
	}
}
