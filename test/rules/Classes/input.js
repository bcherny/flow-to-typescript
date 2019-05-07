/* @flow */

interface Interface1<T : string> {
  prop1: T,
  prop2: ?number
}

type Type1 = {
  prop1: string,
  prop2: ?number
}

class Clazz1 implements Interface1<string> {
  prop1: string
  prop2: ?number = null
  
  constructor(prop1: string) {
    this.prop1 = prop1
  }
  
  increment() {
    if (typeof this.prop2 === "number")
      this.prop2++
    else
      this.prop2 = 0
  }
}


const Type1Clazz1:Type1 = new Clazz1("hello")

export default Type1Clazz1

export {
  Clazz1
}

