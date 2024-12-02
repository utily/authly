import { Payload } from "../../Payload"

export class Remover {
	private constructor(readonly toRemove: string[]) {}

	apply(payload: Payload | undefined): Payload | undefined {
		return payload && this.removeFrom(payload)
	}
	reverse(payload: Payload | undefined): Payload | undefined {
		return payload && this.removeFrom(payload)
	}

	private removeFrom(payload: Payload): Payload {
		let result = { ...payload }
		this.toRemove.forEach(str => {
			const property: string[] = str.split(".")
			result = this.removeProperty(result, property)
		})
		return result
	}
	private removeProperty(payload: Payload, property: string[]): Payload {
		const result = { ...payload }
		if (result[property[0]])
			if (property.length == 1)
				delete result[property[0]]
			else
				result[property[0]] = this.removeProperty(result[property[0]] as Payload, property.slice(1))
		return result
	}
	static create(toRemove: string[]) {
		return toRemove.length == 0 ? undefined : new Remover(toRemove)
	}
}
