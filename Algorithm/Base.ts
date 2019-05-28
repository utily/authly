import { Name } from "./Name"

export abstract class Base {
	abstract get name(): Name
	abstract sign(data: Uint8Array): Promise<Uint8Array>
	abstract verify(data: Uint8Array, signature: Uint8Array): Promise<boolean>
}
