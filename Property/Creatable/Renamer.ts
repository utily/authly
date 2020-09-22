export interface Renamer {
	[key: string]: string
}
export namespace Renamer {
	export function is(value: Renamer | any): value is Renamer {
		return typeof value == "object" && Object.entries(value).every(thing => typeof thing[1] == "string")
	}
}
