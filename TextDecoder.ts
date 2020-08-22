export class TextDecoder {
	readonly encoding: "utf-8" = "utf-8"
	decode(view: ArrayBufferView | undefined, options?: { stream?: boolean }): string {
		return !view
			? ""
			: decodeURIComponent(
					escape(
						Array.from(new Uint8Array(view.buffer, view.byteOffset, view.byteLength), c => String.fromCharCode(c)).join(
							""
						)
					)
			  )
	}
}
