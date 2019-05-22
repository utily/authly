import { Name } from "./Name"

export abstract class Base {
	abstract get name(): Name
	abstract sign(data: string): string
	abstract verify(data: string, signature: string): boolean
}
