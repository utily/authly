import { Symmetric } from "./Symmetric"
import { Name } from "./Name"

export class None extends Symmetric {
	get name(): Name { return "none" }
	sign(data: string): string { return "" }
}
