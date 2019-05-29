export class TextEncoder {
	readonly encoding: "utf-8" = "utf-8"
	constructor() {
	}
	encode(data: string): Uint8Array {
		return Uint8Array.from(unescape(encodeURIComponent(data)).split(""), c => c.charCodeAt(0))
	}
}
