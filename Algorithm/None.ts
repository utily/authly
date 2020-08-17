import { register } from "./Algorithm"
import { Symmetric } from "./Symmetric"
import { Name } from "./Name"

export class None extends Symmetric {
	get name(): Name {
		return "none"
	}
	signBinary(_: Uint8Array): Promise<Uint8Array> {
		return Promise.resolve(new Uint8Array(0))
	}
}
register("none", (_: [Uint8Array | string | undefined, Uint8Array | string | undefined]) => new None())
