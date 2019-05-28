import { Symmetric } from "./Symmetric"
import { Name } from "./Name"

export class None extends Symmetric {
	get name(): Name { return "none" }
	sign(_: Uint8Array): Promise<Uint8Array> { return Promise.resolve(new Uint8Array(0)) }
}
