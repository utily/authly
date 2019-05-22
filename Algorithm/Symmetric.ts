import { Base } from "./Base"

export abstract class Symmetric extends Base {
	verify(data: string, signature: string): boolean {
		return this.sign(data) == signature
	}
}
