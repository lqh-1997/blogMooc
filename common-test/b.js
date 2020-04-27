const { add, mul } = require("./a")
// 因为是package.json里面的依赖，所以可以直接引用
const _ = require('lodash')

const sum = add(1, 3)
const result = mul(5, 4)

console.log(sum)
console.log(result)

const arr = _.concat([1, 2], 3)
console.log(arr)