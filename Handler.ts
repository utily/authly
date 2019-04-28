import { Type } from "./Type"

export abstract class Handler<T> {
	constructor(protected readonly type: Type) {
	}

}
