import { Payload } from "./Payload"

export class PropertyRenamer {
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
	apply(payload: Payload): Payload {
		return this.remap(payload, this.forwardTransformMap)
	}
	reverse(payload: Payload): Payload {
		return this.remap(payload, this.backwardTransformMap)
	}
	remap(payload: Payload, transformMap: { [key: string]: string }): Payload {
		const result: Payload = {}
		for (const key in payload) {
			if (key in transformMap) {
				result[transformMap[key]] = this.resolve(payload[key], transformMap)
			} else
				result[key] = this.resolve(payload[key], transformMap)
		}
		return result
	}
	private resolve<T>(payload: T, transformMap: { [key: string]: string }): T {
		let result: any
		if (Array.isArray(payload)) {
			result = []
			payload.forEach(value => {
				result.push(this.resolve(value, transformMap))
			})
		} else {
			result = typeof payload == "object" ? this.remap((payload as unknown) as Payload, transformMap) : payload
		}
		return result as T
	}
}
