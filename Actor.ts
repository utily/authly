import { isoly } from "isoly"
import { Processor } from "./Processor"

export class Actor<T extends Processor.Type.Constraints<T>> {
	protected constructor(protected readonly processor: Processor<T>) {}
	protected time(): number {
		const time = (this.constructor as typeof Actor).staticTime ?? Actor.staticTime
		return typeof time == "number" ? time : Math.floor(isoly.DateTime.epoch(time ? time : isoly.DateTime.now()) / 1_000)
	}
	// TODO: replace Date with isoly.DateTime
	static staticTime?: isoly.Date | number
}
export namespace Actor {}
