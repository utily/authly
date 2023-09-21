import { Payload } from "../Payload"
import { Transformer } from "./Transformer"

export class Renamer implements Transformer {
	private backwardTransformMap: { [key: string]: string }
	constructor(readonly forwardTransformMap: { [key: string]: string }) {
		this.createBackwardTransformMap()
	}

	private createBackwardTransformMap() {
		const result: { [key: string]: string } = {}
		for (const key in this.forwardTransformMap) {
			result[this.forwardTransformMap[key]] = key
		}
		this.backwardTransformMap = result ? result : {}
	}
	apply(payload: Payload | undefined): Payload | undefined {
		return payload && this.remap(payload, true)
	}
	reverse(payload: Payload | undefined): Payload | undefined {
		return payload && this.remap(payload, false)
	}
	private remap(payload: Payload, forward: boolean): Payload {
		const transformMap = forward ? this.forwardTransformMap : this.backwardTransformMap
		const result: Payload = {}
		for (const key in payload)
			if (key in transformMap)
				result[transformMap[key]] = this.resolve(payload[key], forward)
			else
				result[key] = this.resolve(payload[key], forward)
		return result
	}
	private resolve<T>(payload: T, forward: boolean): T {
		let result: any
		if (Array.isArray(payload)) {
			result = []
			payload.forEach(value => result.push(this.resolve(value, forward)))
		} else
			result = typeof payload == "object" ? this.remap((payload as unknown) as Payload, forward) : payload
		return result as T
	}
}
