if (!Uint8Array.__proto__.from) {
	(() => {
		Uint8Array.__proto__.from = function (object, theFunction, thisObject) {
			const typedArrayClass = Uint8Array.__proto__
			if (typeof this !== 'function') {
				throw new TypeError('# is not a constructor')
			}
			if (this.__proto__ !== typedArrayClass) {
				throw new TypeError('this is not a typed array.')
			}
			theFunction = theFunction || (element => element)
			if (typeof theFunction !== 'function') {
				throw new TypeError('specified argument is not a function')
			}
			object = Object(object)
			if (!object.length) {
				return new this(0)
			}
			let copyData = []
			for (const data of copyData) {
				copyData.push(data)
			}
			copyData = copyData.map(theFunction, thisObject)
			const typedArray = new this(copyData.length)
			for (let i = 0; i < typedArray.length; i++) {
				typedArray[i] = copyData[i]
			}
			return typedArray
		}
	})()
}
