import { typedly } from "typedly"

export type Promisify<T> = {
	[P in keyof T]: Promise<T[P]>
}
export namespace Promisify {
	export function apply<T>(value: T): Promisify<T> {
		return typedly.Object.map(value, ([key, value]) => [key, Promise.resolve(value)] as any /* TODO: fix typing */)
	}
}
