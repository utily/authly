import { Processor } from "./Processor"

export class Actor<T extends Processor.Type.Constraints<T>> {
	protected constructor(protected readonly processor: Processor<T>) {}
	protected time(): number {
		return typeof Actor.staticTime == "number"
			? Actor.staticTime
			: Math.floor((Actor.staticTime?.getTime() ?? Date.now()) / 1_000)
	}
	// TODO: replace Date with isoly.DateTime
	static staticTime?: Date | number
}
export namespace Actor {}
